import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { SiteHeader } from "@/components/shell/SiteHeader";
import { Marquee } from "@/components/ui";
import { StoreProvider } from "@/store";
import "./globals.css";

// Self-hosted (app/fonts, from fontsource) so builds work offline and in CI.
const bowlby = localFont({
  src: "./fonts/bowlby-one-latin-400-normal.woff2",
  weight: "400",
  variable: "--font-bowlby",
});

const fraunces = localFont({
  src: "./fonts/fraunces-latin-wght-italic.woff2",
  weight: "100 900",
  style: "italic",
  variable: "--font-fraunces",
});

const dmSans = localFont({
  src: "./fonts/dm-sans-latin-wght-normal.woff2",
  weight: "100 1000",
  variable: "--font-dm-sans",
});

const silkscreen = localFont({
  src: [
    { path: "./fonts/silkscreen-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/silkscreen-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-silkscreen",
});

export const metadata: Metadata = {
  title: "Thrift Lens",
  description:
    "Upload any outfit, get it broken into pieces, and buy each piece in its greenest, cheapest form.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bowlby.variable} ${fraunces.variable} ${dmSans.variable} ${silkscreen.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-paper text-lyons font-sans">
        <StoreProvider>
          <a
            href="#main"
            className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-3 focus-visible:top-3 focus-visible:z-[110] focus-visible:rounded-full focus-visible:border-2 focus-visible:border-lyons focus-visible:bg-mikado focus-visible:px-4 focus-visible:py-2 focus-visible:font-pixel focus-visible:text-xs focus-visible:font-bold focus-visible:uppercase focus-visible:tracking-widest"
          >
            Skip to content
          </a>
          <Marquee items={["LOOK IT. FIND IT. KEEP IT OUT OF LANDFILL."]} tone="lyons" />
          <SiteHeader />
          <div id="main" className="flex-1">{children}</div>
          <SiteFooter />
        </StoreProvider>
      </body>
    </html>
  );
}
