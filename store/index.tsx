"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { bundleImpact } from "@/lib/impact";
import { PRODUCT_BY_ID } from "@/lib/products";
import type { CartItem, Order, PaymentMethod, Product, ShippingDetails } from "@/lib/types";

const STORAGE_KEY = "thrift-lens:v1";

/** One-off thrift pieces can only be bought once. */
const maxQty = (p: Product) => (p.source === "secondhand" ? 1 : 10);

type Data = { cart: CartItem[]; wishlist: string[]; savedLooks: string[]; orders: Order[] };
type State = Data & { hydrated: boolean };

type Action =
  | { type: "hydrate"; data: Data }
  | { type: "cart/add"; productId: string; size: string; qty: number }
  | { type: "cart/remove"; productId: string; size: string }
  | { type: "cart/setQty"; productId: string; size: string; qty: number }
  | { type: "wishlist/toggle"; productId: string }
  | { type: "look/toggle"; lookId: string }
  | { type: "order/add"; order: Order };

const initial: State = { cart: [], wishlist: [], savedLooks: [], orders: [], hydrated: false };

const same = (a: CartItem, productId: string, size: string) => a.productId === productId && a.size === size;
const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { ...action.data, hydrated: true };
    case "cart/add": {
      const product = PRODUCT_BY_ID[action.productId];
      if (!product) return state;
      const cap = maxQty(product);
      const existing = state.cart.find((i) => same(i, action.productId, action.size));
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i === existing ? { ...i, qty: Math.min(cap, i.qty + action.qty) } : i,
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { productId: action.productId, size: action.size, qty: Math.min(cap, action.qty) }],
      };
    }
    case "cart/remove":
      return { ...state, cart: state.cart.filter((i) => !same(i, action.productId, action.size)) };
    case "cart/setQty": {
      const product = PRODUCT_BY_ID[action.productId];
      if (!product) return state;
      if (action.qty <= 0) {
        return { ...state, cart: state.cart.filter((i) => !same(i, action.productId, action.size)) };
      }
      const qty = Math.min(maxQty(product), action.qty);
      return { ...state, cart: state.cart.map((i) => (same(i, action.productId, action.size) ? { ...i, qty } : i)) };
    }
    case "wishlist/toggle":
      return { ...state, wishlist: toggle(state.wishlist, action.productId) };
    case "look/toggle":
      return { ...state, savedLooks: toggle(state.savedLooks, action.lookId) };
    case "order/add":
      return { ...state, orders: [action.order, ...state.orders], cart: [] };
  }
}

function load(): Data | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Partial<Data>;
    const arr = <T,>(v: T[] | undefined) => (Array.isArray(v) ? v : []);
    return {
      // drop anything pointing at a product that no longer exists
      cart: arr(d.cart).filter((i) => PRODUCT_BY_ID[i.productId]),
      wishlist: arr(d.wishlist).filter((id) => PRODUCT_BY_ID[id]),
      savedLooks: arr(d.savedLooks),
      orders: arr(d.orders),
    };
  } catch {
    return null;
  }
}

export type CartLine = { product: Product; size: string; qty: number; lineTotal: number };

type Store = {
  /** false on the server and first client render; gate count badges on this to avoid hydration mismatch */
  hydrated: boolean;
  cart: CartItem[];
  cartLines: CartLine[];
  cartCount: number;
  cartTotal: number;
  addToCart: (productId: string, size: string, qty?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  setCartQty: (productId: string, size: string, qty: number) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  savedLooks: string[];
  toggleSavedLook: (lookId: string) => void;
  isLookSaved: (lookId: string) => boolean;
  orders: Order[];
  /** Turns the cart into an order, clears the cart, returns the order (null if the cart is empty). */
  placeOrder: (shipping: ShippingDetails, payment: PaymentMethod) => Order | null;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  // Read localStorage after mount so the server and first client render match (both empty).
  useEffect(() => {
    dispatch({ type: "hydrate", data: load() ?? { cart: [], wishlist: [], savedLooks: [], orders: [] } });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      const { cart, wishlist, savedLooks, orders } = state;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, wishlist, savedLooks, orders }));
    } catch {
      // private mode or quota: the app still works for this session
    }
  }, [state]);

  const cartLines = useMemo<CartLine[]>(
    () =>
      state.cart.flatMap((i) => {
        const product = PRODUCT_BY_ID[i.productId];
        return product ? [{ product, size: i.size, qty: i.qty, lineTotal: product.price * i.qty }] : [];
      }),
    [state.cart],
  );

  const addToCart = useCallback(
    (productId: string, size: string, qty = 1) => dispatch({ type: "cart/add", productId, size, qty }),
    [],
  );
  const removeFromCart = useCallback(
    (productId: string, size: string) => dispatch({ type: "cart/remove", productId, size }),
    [],
  );
  const setCartQty = useCallback(
    (productId: string, size: string, qty: number) => dispatch({ type: "cart/setQty", productId, size, qty }),
    [],
  );
  const toggleWishlist = useCallback((productId: string) => dispatch({ type: "wishlist/toggle", productId }), []);
  const toggleSavedLook = useCallback((lookId: string) => dispatch({ type: "look/toggle", lookId }), []);

  const placeOrder = useCallback(
    (shipping: ShippingDetails, payment: PaymentMethod): Order | null => {
      if (cartLines.length === 0) return null;
      const now = new Date();
      const order: Order = {
        id: `TL-${now.getTime().toString(36).toUpperCase().slice(-6)}`,
        placedAt: now.toISOString(),
        lines: cartLines.map((l) => ({
          productId: l.product.id,
          name: l.product.name,
          size: l.size,
          qty: l.qty,
          unitPrice: l.product.price,
        })),
        total: cartLines.reduce((sum, l) => sum + l.lineTotal, 0),
        impact: bundleImpact(cartLines),
        shipping,
        payment,
      };
      dispatch({ type: "order/add", order });
      return order;
    },
    [cartLines],
  );

  const value = useMemo<Store>(
    () => ({
      hydrated: state.hydrated,
      cart: state.cart,
      cartLines,
      cartCount: cartLines.reduce((n, l) => n + l.qty, 0),
      cartTotal: cartLines.reduce((n, l) => n + l.lineTotal, 0),
      addToCart,
      removeFromCart,
      setCartQty,
      wishlist: state.wishlist,
      toggleWishlist,
      isWishlisted: (id) => state.wishlist.includes(id),
      savedLooks: state.savedLooks,
      toggleSavedLook,
      isLookSaved: (id) => state.savedLooks.includes(id),
      orders: state.orders,
      placeOrder,
    }),
    [state, cartLines, addToCart, removeFromCart, setCartQty, toggleWishlist, toggleSavedLook, placeOrder],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider> (wired in app/layout.tsx)");
  return ctx;
}
