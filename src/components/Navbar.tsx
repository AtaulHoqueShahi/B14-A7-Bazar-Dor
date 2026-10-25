import { Suspense } from "react";
import NavbarClient from "./NavbarCilient";

export type ApiProduct = {
  id: number;
  slug: string;
  nameBn?: string;
  name?: string;
  categoryIcon?: string;
  category?: string;
  unit?: string;
  image?: string;
  today: number;
  change?: {
    dir: "up" | "down" | "same";
    pct: number;
  };
};

const API_URLS = [
  process.env.MAIN_API_URL ||
    "https://openapi.programming-hero.com/api/bazardor",
  process.env.BASE_URL_1 || "https://api.api-store.workers.dev/api/bazardor",
  process.env.BASE_URL_2 || "https://api.abcz.workers.dev/api/bazardor",
];

async function getTickerProducts(): Promise<ApiProduct[]> {
  for (const baseUrl of API_URLS) {
    try {
      const response = await fetch(`${baseUrl.replace(/\/$/, "")}/products`, {
        cache: "no-store",
      });

      if (!response.ok) continue;

      const payload: unknown = await response.json();

      if (Array.isArray(payload) && payload.length > 0) {
        return payload as ApiProduct[];
      }

      if (
        payload &&
        typeof payload === "object" &&
        "data" in payload &&
        Array.isArray(payload.data) &&
        payload.data.length > 0
      ) {
        return payload.data as ApiProduct[];
      }
    } catch (error) {
      console.error("Ticker API error:", error);
    }
  }

  return [];
}

function NavbarFallback() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e5ebe5] bg-[#fbfdfb]">
      <div className="mx-auto flex min-h-[58px] max-w-[1120px] items-center justify-between gap-3 px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#07883e] text-xl text-white">
            🛒
          </span>
          <span className="text-lg font-extrabold text-[#26352b]">
            বাজার দর
          </span>
        </a>
      </div>
    </header>
  );
}

export default async function Navbar() {
  const products = await getTickerProducts();

  return (
    <Suspense fallback={<NavbarFallback />}>
      <NavbarClient products={products} />
    </Suspense>
  );
}
