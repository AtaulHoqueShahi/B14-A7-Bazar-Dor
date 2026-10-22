
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import BanglaDate from "@/components/BanglaDate";

export const instant = false;

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type ApiProduct = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "same";
    pct: number;
  };
  markets: Market[];
};

type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  changeDirection: "up" | "down" | "same";
  changePercent: number;
  markets: Market[];
};

const API_URLS = [
  process.env.MAIN_API_URL ||
    "https://openapi.programming-hero.com/api/bazardor",
  process.env.BASE_URL_1 ||
    "https://api.api-store.workers.dev/api/bazardor",
  process.env.BASE_URL_2 ||
    "https://api.abcz.workers.dev/api/bazardor",
];

async function getProducts(): Promise<Product[]> {
  for (const baseUrl of API_URLS) {
    try {
      const response = await fetch(
        `${baseUrl.replace(/\/$/, "")}/products`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) continue;

      const data: unknown = await response.json();

      if (!Array.isArray(data) || data.length === 0) continue;

      return (data as ApiProduct[]).map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.nameBn,
        category: item.category,
        categoryName: item.categoryNameBn,
        unit: item.unit,
        image: item.image || item.categoryIcon || "🛒",
        today: item.today,
        yesterday: item.yesterday,
        changeDirection: item.change?.dir || "same",
        changePercent: item.change?.pct ?? 0,
        markets: item.markets || [],
      }));
    } catch (error) {
      console.error(`Failed to fetch ${baseUrl}`, error);
    }
  }

  return [];
}

function ProductCard({ product }: { product: Product }) {
  const isUp = product.changeDirection === "up";
  const isDown = product.changeDirection === "down";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col rounded-2xl border border-emerald-100 bg-white p-3 transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg sm:p-4"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
          {product.image}
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
            isUp
              ? "bg-red-50 text-red-600"
              : isDown
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {isUp ? (
            <ArrowUpRight size={13} />
          ) : isDown ? (
            <ArrowDownRight size={13} />
          ) : null}

          {product.changePercent === 0
            ? "পরিবর্তন নেই"
            : `${product.changePercent}%`}
        </span>
      </div>

      <p className="mb-1 text-xs text-gray-500">
        {product.categoryName}
      </p>

      <h3 className="line-clamp-1 text-sm font-bold text-gray-800">
        {product.name}
      </h3>

      <div className="mt-auto flex items-end justify-between gap-2 pt-4">
        <div>
          <p className="text-lg font-extrabold text-emerald-800">
            ৳{product.today.toLocaleString("en-US")}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            প্রতি {product.unit === "kg" ? "কেজি" : product.unit}
          </p>
        </div>

        <ArrowRight
          size={17}
          className="mb-1 shrink-0 text-emerald-600 transition group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-extrabold text-gray-900 sm:text-xl">
        {title}
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default async function HomePage() {
  const products = await getProducts();

  const risingProducts = products
    .filter((product) => product.changeDirection === "up")
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 6);

  const fallingProducts = products
    .filter((product) => product.changeDirection === "down")
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#f5faf5] text-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="relative isolate overflow-hidden rounded-2xl border border-emerald-100 bg-[#e7f5e9] px-5 py-8 sm:px-9 sm:py-10 lg:px-12 lg:py-12">
          <div className="relative z-10 max-w-xl">
            {/* Today's Bangla date */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3 py-2 text-sm font-medium text-emerald-800">
              <span aria-hidden="true">📅</span>
              <BanglaDate />
            </div>

            <div>
              <span className="inline-flex rounded-full border border-emerald-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                আপনার নিত্যদিনের বাজার সঙ্গী
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              প্রতিদিনের বাজার দর,
              <br />
              এখন এক নজরে
            </h1>

            <p className="mt-4 max-w-md text-sm leading-7 text-gray-600 sm:text-base">
              নিত্যপ্রয়োজনীয় পণ্যের দাম দেখুন, বাজারের পরিবর্তন জানুন এবং
              সচেতনভাবে বাজার করুন।
            </p>

            <Link
              href="#সব-পণ্য"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
            >
              বাজার দর দেখুন
              <ArrowRight size={17} />
            </Link>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-8 -right-4 text-8xl opacity-20 sm:right-8 sm:text-9xl lg:right-12 lg:text-[180px]"
          >
            🧺
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-8 top-5 text-4xl sm:right-32 sm:top-8 sm:text-5xl"
          >
            🥬
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-5 right-24 text-4xl sm:right-52 sm:text-5xl"
          >
            🍅
          </div>
        </section>

        <section className="mt-9">
          <SectionHeading
            title="📈 যেসব পণ্যের দাম বেড়েছে"
            description="গত দিনের তুলনায় দাম বেড়েছে"
          />

          {risingProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
              {risingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-emerald-100 bg-white p-5 text-sm text-gray-500">
              দাম বৃদ্ধির পণ্য পাওয়া যায়নি।
            </p>
          )}
        </section>

        <section className="mt-9">
          <SectionHeading
            title="📉 যেসব পণ্যের দাম কমেছে"
            description="গত দিনের তুলনায় দাম কমেছে"
          />

          {fallingProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
              {fallingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-emerald-100 bg-white p-5 text-sm text-gray-500">
              দাম কমার পণ্য পাওয়া যায়নি।
            </p>
          )}
        </section>

        <section id="সব-পণ্য" className="mt-10 scroll-mt-36">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                🛒 সকল পণ্যের বাজার দর
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                মোট {products.length}টি পণ্য
              </p>
            </div>

         
<Link
  href="/#সব-পণ্য"
  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
>
  <RefreshCw size={15} />
  রিফ্রেশ
</Link>

          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-12 text-center">
              <div className="text-5xl">🛒</div>

              <h3 className="mt-4 font-bold text-gray-800">
                পণ্যের তথ্য লোড করা যায়নি
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                ইন্টারনেট সংযোগ অথবা API response পরীক্ষা কর।
              </p>

              <a
                href={`${API_URLS[0].replace(/\/$/, "")}/products`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
              >
                API পরীক্ষা কর
                <ArrowRight size={16} />
              </a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
