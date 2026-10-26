
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type MarketPrice = {
  market?: string;
  marketName?: string;
  name?: string;
  seller?: string;
  vendor?: string;
  min?: number;
  minPrice?: number;
  max?: number;
  maxPrice?: number;
  avg?: number;
  average?: number;
  price?: number;
  today?: number;
};

type Product = {
  id: number | string;
  slug: string;
  nameBn?: string;
  name?: string;
  category?: string;
  categoryName?: string;
  categoryIcon?: string;
  image?: string;
  imageUrl?: string;
  unit?: string;
  today: number;
  yesterday?: number;
  change?: {
    dir?: "up" | "down" | "same";
    pct?: number;
  };
  markets?: MarketPrice[];
  marketPrices?: MarketPrice[];
  priceHistory?: MarketPrice[];
  description?: string;
};

const API_URLS = [
  process.env.MAIN_API_URL ||
    "https://openapi.programming-hero.com/api/bazardor",
  process.env.BASE_URL_1 ||
    "https://api.api-store.workers.dev/api/bazardor",
  process.env.BASE_URL_2 ||
    "https://api.abcz.workers.dev/api/bazardor",
];

const CATEGORY_NAMES: Record<string, string> = {
  chal: "চাল",
  dal: "ডাল",
  tel: "তেল",
  sobji: "সবজি",
  mach: "মাছ",
  mangsho: "মাংস",
  "dim-dudh": "ডিম-দুধ",
  moshla: "মসলা",
};

const CATEGORY_EMOJIS: Record<string, string> = {
  chal: "🍚",
  dal: "🫘",
  tel: "🫙",
  sobji: "🥬",
  mach: "🐟",
  mangsho: "🥩",
  "dim-dudh": "🥚",
  moshla: "🌶️",
};

function getBanglaCategory(category?: string) {
  if (!category) return "সাধারণ পণ্য";

  return CATEGORY_NAMES[category.toLowerCase()] || category;
}

function getCategoryEmoji(product: Product) {
  const category = product.category?.toLowerCase() || "";

  return (
    CATEGORY_EMOJIS[category] ||
    product.categoryIcon ||
    "🛒"
  );
}

function getBanglaUnit(unit?: string) {
  const units: Record<string, string> = {
    kg: "কেজি",
    kilogram: "কেজি",
    liter: "লিটার",
    litre: "লিটার",
    piece: "টি",
    pcs: "টি",
    dozen: "ডজন",
  };

  if (!unit) return "কেজি";

  return units[unit.toLowerCase()] || unit;
}

function isValidImageUrl(value?: string) {
  if (!value) return false;

  try {
    const url = new URL(value);

    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      !/^[\p{Extended_Pictographic}\s]+$/u.test(value)
    );
  } catch {
    return false;
  }
}

async function getProduct(slug: string): Promise<Product | null> {
  for (const base of API_URLS) {
    try {
      const baseUrl = base.replace(/\/$/, "");

      const response = await fetch(`${baseUrl}/products`, {
        next: { revalidate: 300 },
      });

      if (!response.ok) continue;

      const payload = await response.json();

      const list: Product[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      const found = list.find((item) => item.slug === slug);

      if (!found) continue;

      try {
        const detailResponse = await fetch(
          `${baseUrl}/products/${found.id}`,
          { next: { revalidate: 300 } }
        );

        if (detailResponse.ok) {
          const detailPayload = await detailResponse.json();

          const detail =
            detailPayload?.data ??
            detailPayload?.product ??
            detailPayload;

          if (
            detail &&
            typeof detail === "object" &&
            !Array.isArray(detail)
          ) {
            return {
              ...found,
              ...detail,
              slug: detail.slug || found.slug,
            } as Product;
          }
        }
      } catch {
        // বিস্তারিত API ব্যর্থ হলে তালিকার তথ্য ব্যবহার হবে।
      }

      return found;
    } catch (error) {
      console.error("Product API error:", error);
    }
  }

  return null;
}

function money(value: number | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "—";
  }

  return `${value.toLocaleString("bn-BD")} টাকা`;
}

function getMarkets(product: Product): MarketPrice[] {
  return (
    product.markets ??
    product.marketPrices ??
    product.priceHistory ??
    []
  );
}

function getMinimum(market: MarketPrice) {
  return market.min ?? market.minPrice ?? market.price ?? market.today;
}

function getMaximum(market: MarketPrice) {
  return market.max ?? market.maxPrice ?? market.price ?? market.today;
}

function getAverage(market: MarketPrice) {
  return market.avg ?? market.average ?? market.price ?? market.today;
}

function getMarketName(market: MarketPrice) {
  return market.market ?? market.marketName ?? market.name ?? "—";
}

function getSeller(market: MarketPrice) {
  return market.seller ?? market.vendor ?? "—";
}

function getDirection(product: Product) {
  if (product.change?.dir) return product.change.dir;

  if (typeof product.yesterday === "number") {
    if (product.today > product.yesterday) return "up";
    if (product.today < product.yesterday) return "down";
  }

  return "same";
}

function getPercentage(product: Product) {
  if (typeof product.change?.pct === "number") {
    return Math.abs(product.change.pct);
  }

  if (
    typeof product.yesterday === "number" &&
    product.yesterday !== 0
  ) {
    return (
      (Math.abs(product.today - product.yesterday) /
        product.yesterday) *
      100
    );
  }

  return 0;
}

function ProductDetailsFallback() {
  return (
    <div className="min-h-[60vh] bg-[#f0f5f0] px-4 py-8">
      <div className="mx-auto max-w-[1120px] animate-pulse">
        <div className="mb-5 h-4 w-40 rounded bg-gray-200" />
        <div className="mb-4 h-28 rounded-xl bg-white" />
        <div className="mb-4 h-40 rounded-xl bg-white" />
        <div className="h-64 rounded-xl bg-white" />
      </div>
    </div>
  );
}

async function ProductDetailsContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const name = product.nameBn || product.name || product.slug;
  const category = getBanglaCategory(
    product.categoryName || product.category
  );
  const unit = getBanglaUnit(product.unit);
  const direction = getDirection(product);
  const percentage = getPercentage(product);
  const markets = getMarkets(product);

  const minimums = markets
    .map(getMinimum)
    .filter(
      (value): value is number =>
        typeof value === "number" && Number.isFinite(value)
    );

  const maximums = markets
    .map(getMaximum)
    .filter(
      (value): value is number =>
        typeof value === "number" && Number.isFinite(value)
    );

  const averages = markets
    .map(getAverage)
    .filter(
      (value): value is number =>
        typeof value === "number" && Number.isFinite(value)
    );

  const lowest =
    minimums.length > 0 ? Math.min(...minimums) : product.today;

  const highest =
    maximums.length > 0 ? Math.max(...maximums) : product.today;

  const average =
    averages.length > 0
      ? Math.round(
          averages.reduce((sum, value) => sum + value, 0) /
            averages.length
        )
      : product.today;

  const imageUrl = isValidImageUrl(product.image)
    ? product.image
    : isValidImageUrl(product.imageUrl)
      ? product.imageUrl
      : undefined;

  return (
    <div className="min-h-screen bg-[#f0f5f0] text-[#26352b]">
      <main className="mx-auto w-full max-w-[1120px] px-4 pb-16 pt-5 sm:px-6 sm:pt-7">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-2 text-sm text-[#68766b]"
        >
          <Link href="/" className="hover:text-[#07883e]">
            হোম
          </Link>

          <span>/</span>
          <span>{category}</span>
          <span>/</span>

          <span className="font-medium text-[#344438]">
            {name}
          </span>
        </nav>

        {/* Product Overview */}
        <section className="mb-4 rounded-2xl border border-[#e4ebe4] bg-[#fbfdfb] p-5 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f0f5ef]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name}
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <span
                    role="img"
                    aria-label={category}
                    className="text-4xl"
                  >
                    {getCategoryEmoji(product)}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-extrabold sm:text-3xl">
                  {name}
                </h1>

                <p className="mt-2 text-sm text-[#68766b]">
                  পণ্যের ধরন: {category}
                </p>

                <p className="mt-2 text-sm leading-6 text-[#68766b]">
                  {product.description ||
                    "সারাদেশের বাজারদরের তথ্য এক নজরে দেখুন।"}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-5 rounded-2xl bg-[#f0f5f0] px-5 py-4 sm:min-w-[158px] sm:flex-col sm:items-start sm:gap-1">
              <div>
                <p className="text-xs text-[#68766b]">
                  আজকের বাজারদর
                </p>

                <p className="mt-1 text-3xl font-extrabold">
                  {product.today.toLocaleString("bn-BD")}
                </p>

                <p className="text-sm text-[#68766b]">
                  টাকা / {unit}
                </p>
              </div>

              <p
                className={`text-sm font-bold ${
                  direction === "up"
                    ? "text-red-500"
                    : direction === "down"
                      ? "text-[#07883e]"
                      : "text-[#68766b]"
                }`}
              >
                {direction === "up"
                  ? "▲"
                  : direction === "down"
                    ? "▼"
                    : "—"}{" "}
                {percentage.toLocaleString("bn-BD", {
                  maximumFractionDigits: 1,
                })}
                %
              </p>
            </div>
          </div>
        </section>

        {/* Price Summary */}
        <section className="mb-4 rounded-2xl border border-[#e4ebe4] bg-[#fbfdfb] p-5 sm:p-6">
          <h2 className="mb-4 text-base font-bold">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#e5ebe5] p-4">
              <p className="text-sm text-[#68766b]">
                সর্বনিম্ন দাম
              </p>
              <p className="mt-2 text-2xl font-extrabold text-[#07883e]">
                {lowest.toLocaleString("bn-BD")} টাকা
              </p>
              <p className="mt-2 text-xs text-[#68766b]">
                {markets.length
                  ? "প্রাপ্ত বাজারের মধ্যে সর্বনিম্ন"
                  : "পণ্যের বর্তমান দাম"}
              </p>
            </div>

            <div className="rounded-xl border border-[#e5ebe5] p-4">
              <p className="text-sm text-[#68766b]">
                গড় বাজারদর
              </p>
              <p className="mt-2 text-2xl font-extrabold text-[#07883e]">
                {average.toLocaleString("bn-BD")} টাকা
              </p>
              <p className="mt-2 text-xs text-[#68766b]">
                {markets.length
                  ? "প্রাপ্ত বাজারদরের গড়"
                  : "পণ্যের বর্তমান দাম"}
              </p>
            </div>

            <div className="rounded-xl border border-[#e5ebe5] p-4">
              <p className="text-sm text-[#68766b]">
                সর্বোচ্চ দাম
              </p>
              <p className="mt-2 text-2xl font-extrabold text-[#07883e]">
                {highest.toLocaleString("bn-BD")} টাকা
              </p>
              <p className="mt-2 text-xs text-[#68766b]">
                {markets.length
                  ? "প্রাপ্ত বাজারের মধ্যে সর্বোচ্চ"
                  : "পণ্যের বর্তমান দাম"}
              </p>
            </div>
          </div>
        </section>

        {/* Market Comparison */}
        <section className="rounded-2xl border border-[#e4ebe4] bg-[#fbfdfb] p-5 sm:p-6">
          <h2 className="text-base font-bold">
            বাজারভিত্তিক আলাদা দাম
          </h2>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-sm">
              <thead>
                <tr className="border-y border-[#e5ebe5] text-left text-[#68766b]">
                  <th className="px-3 py-3 font-medium">বাজার</th>
                  <th className="px-3 py-3 font-medium">বিক্রেতা</th>
                  <th className="px-3 py-3 text-right font-medium">
                    সর্বনিম্ন
                  </th>
                  <th className="px-3 py-3 text-right font-medium">
                    সর্বোচ্চ
                  </th>
                  <th className="px-3 py-3 text-right font-medium">
                    গড়
                  </th>
                </tr>
              </thead>

              <tbody>
                {markets.length > 0 ? (
                  markets.map((market, index) => (
                    <tr
                      key={`${getMarketName(market)}-${index}`}
                      className="border-b border-[#e5ebe5] transition hover:bg-[#f0f6f0]"
                    >
                      <td className="px-3 py-3 font-medium">
                        {getMarketName(market)}
                      </td>
                      <td className="px-3 py-3">
                        {getSeller(market)}
                      </td>
                      <td className="px-3 py-3 text-right">
                        {money(getMinimum(market))}
                      </td>
                      <td className="px-3 py-3 text-right">
                        {money(getMaximum(market))}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold">
                        {money(getAverage(market))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center leading-7 text-[#68766b]"
                    >
                      এই পণ্যের আলাদা বাজারভিত্তিক দামের তথ্য
                      পাওয়া যায়নি।
                      <br />
                      API-তে তথ্য পাওয়া গেলে এখানে দেখানো হবে।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ProductDetailsFallback />}>
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}
