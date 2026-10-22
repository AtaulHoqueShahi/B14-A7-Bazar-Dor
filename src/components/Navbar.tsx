
import Link from "next/link";

type ApiProduct = {
  id: number;
  slug: string;
  nameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  change: {
    dir: "up" | "down" | "same";
    pct: number;
  };
};

const API_URLS = [
  process.env.MAIN_API_URL ||
    "https://openapi.programming-hero.com/api/bazardor",
  process.env.BASE_URL_1 ||
    "https://api.api-store.workers.dev/api/bazardor",
  process.env.BASE_URL_2 ||
    "https://api.abcz.workers.dev/api/bazardor",
];

const categories = [
  { name: "সব পণ্য", slug: "", icon: "🛒" },
  { name: "চাল", slug: "chal", icon: "🍚" },
  { name: "ডাল", slug: "dal", icon: "🫘" },
  { name: "তেল", slug: "tel", icon: "🫗" },
  { name: "সবজি", slug: "sobji", icon: "🥬" },
  { name: "মাছ", slug: "mach", icon: "🐟" },
  { name: "মাংস", slug: "mangsho", icon: "🍗" },
  { name: "ডিম-দুধ", slug: "dim-dudh", icon: "🥚" },
  { name: "মসলা", slug: "moshla", icon: "🌶️" },
];

async function getTickerProducts(): Promise<ApiProduct[]> {
  for (const baseUrl of API_URLS) {
    try {
      const response = await fetch(
        `${baseUrl.replace(/\/$/, "")}/products`,
        { cache: "no-store" },
      );

      if (!response.ok) continue;

      const data: unknown = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        return data as ApiProduct[];
      }
    } catch (error) {
      console.error("Ticker API error:", error);
    }
  }

  return [];
}

export default async function Navbar() {
  const products = await getTickerProducts();
  const tickerProducts =
    products.length > 0 ? [...products, ...products] : [];

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[68px] items-center justify-between gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-2xl text-white">
              🛒
            </span>

            <span className="text-xl font-extrabold tracking-tight text-emerald-800 sm:text-2xl">
              বাজার দর
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/sign-in"
              className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50 sm:px-4 sm:text-sm"
            >
              সাইন ইন
            </Link>

            <Link
              href="/sign-up"
              className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 sm:px-4 sm:text-sm"
            >
              সাইন আপ
            </Link>
          </div>
        </div>

        <nav
          aria-label="পণ্যের ক্যাটাগরি"
          className="-mx-1 flex gap-1 overflow-x-auto border-t border-emerald-50 py-2"
        >
          {categories.map((category) => (
            <Link
              key={category.slug || "all"}
              href={
                category.slug
                  ? `/category/${category.slug}`
                  : "/#সব-পণ্য"
              }
              className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-800"
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="overflow-hidden border-t border-emerald-100 bg-[#edf7ee]">
        <div className="flex min-h-10 items-center">
          <span className="z-10 shrink-0 bg-emerald-700 px-3 py-2 text-xs font-bold text-white sm:px-4">
            বাজারদর
          </span>

          {tickerProducts.length > 0 ? (
            <div className="ticker-track flex min-w-0 items-center">
              {tickerProducts.map((product, index) => (
                <Link
                  key={`${product.id}-${index}`}
                  href={`/product/${product.slug}`}
                  className="flex shrink-0 items-center gap-2 whitespace-nowrap px-4 py-2 text-xs sm:text-sm"
                >
                  <span>
                    {product.image || product.categoryIcon || "🛒"}
                  </span>

                  <span className="font-medium text-gray-700">
                    {product.nameBn}
                  </span>

                  <span className="font-bold text-emerald-800">
                    ৳{product.today}/
                    {product.unit === "kg" ? "কেজি" : product.unit}
                  </span>

                  {product.change?.dir === "up" ? (
                    <span className="font-semibold text-red-600">
                      ▲ {product.change.pct}%
                    </span>
                  ) : product.change?.dir === "down" ? (
                    <span className="font-semibold text-green-700">
                      ▼ {product.change.pct}%
                    </span>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}

                  <span className="ml-2 text-emerald-200">|</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="px-4 py-2 text-xs text-gray-500">
              বর্তমানে বাজারদরের তথ্য পাওয়া যাচ্ছে না।
            </p>
          )}
        </div>
      </div>

      <style>{`
        .ticker-track {
          width: max-content;
          animation: bazardor-marquee 55s linear infinite;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes bazardor-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
          }
        }
      `}</style>
    </header>
  );
}
