import type { Impact, PaymentMethod, ShippingDetails } from "@/lib/types";

export type ShippingField = keyof ShippingDetails;
export type ShippingErrors = Partial<Record<ShippingField, string>>;

export const SHIPPING_FIELDS: ShippingField[] = [
  "name",
  "phone",
  "pincode",
  "address",
  "city",
];

export const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  label: string;
  hint: string;
}[] = [
  { value: "upi", label: "UPI", hint: "Pay with any UPI app" },
  { value: "card", label: "Card", hint: "Credit or debit card (demo)" },
  { value: "cod", label: "Cash on delivery", hint: "Pay when it arrives" },
];

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  upi: "UPI",
  card: "Card",
  cod: "Cash on delivery",
};

export function cleanShipping(details: ShippingDetails): ShippingDetails {
  return {
    name: details.name.trim().replace(/\s+/g, " "),
    phone: details.phone.trim(),
    address: details.address.trim().replace(/\s+/g, " "),
    city: details.city.trim().replace(/\s+/g, " "),
    pincode: details.pincode.trim(),
  };
}

export function validateField(field: ShippingField, value: string): string | undefined {
  const clean = value.trim();

  if (!clean) {
    const labels: Record<ShippingField, string> = {
      name: "Please enter your full name.",
      phone: "Please enter your mobile number.",
      address: "Please enter your delivery address.",
      city: "Please enter your city.",
      pincode: "Please enter your 6-digit pincode.",
    };
    return labels[field];
  }

  switch (field) {
    case "name":
      if (clean.length < 2) return "Name must contain at least 2 characters.";
      if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(clean)) return "Please enter a valid name.";
      return undefined;
    case "phone": {
      const digits = clean.replace(/[\s()-]/g, "").replace(/^\+91/, "");
      if (!/^\d{10}$/.test(digits)) return "Enter a valid 10-digit Indian mobile number.";
      if (!/^[6-9]/.test(digits)) return "Enter a valid Indian mobile number.";
      return undefined;
    }
    case "pincode":
      return /^[1-9]\d{5}$/.test(clean) ? undefined : "Enter a valid 6-digit pincode.";
    case "address":
      return clean.length >= 8 ? undefined : "Please enter a more complete address.";
    case "city":
      return clean.length >= 2 ? undefined : "City must contain at least 2 characters.";
  }
}

export function validateShipping(details: ShippingDetails): ShippingErrors {
  const errors: ShippingErrors = {};
  for (const field of SHIPPING_FIELDS) {
    const error = validateField(field, details[field]);
    if (error) errors[field] = error;
  }
  return errors;
}

export function shareText(orderId: string, pieces: number, impact: Impact): string {
  return [
    `I just thrifted my outfit with Thrift Lens!`,
    `Order: ${orderId}`,
    `${pieces} pre-loved/local pieces in my haul.`,
    `Estimated impact: ${impact.kgCO2} kg CO₂ avoided, ${impact.litresWater.toLocaleString("en-IN")} litres of water saved, and ₹${impact.inrSaved.toLocaleString("en-IN")} saved vs buying new.`,
    `Find your next look sustainably with Thrift Lens.`,
  ].join("\n");
}
