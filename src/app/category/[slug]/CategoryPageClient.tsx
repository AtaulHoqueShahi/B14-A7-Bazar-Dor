
"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id?: number | string;
  _id?: string;
  slug?: string;
  nameBn?: string;
  name?: string;
  title?: string;
  category?: string;
  categoryIcon?: string;
  today?: number | string;
  yesterday?: number | string;
  unit?: string;
  image?: string;
  change?: {
    dir?: "up" | "down" | "same" | string;
    pct?: number | string;
  };
};

type Props = {
  slug: string;
};

const API_URLS = [
  process.env.NEXT_PUBLIC_MAIN_API_URL ||
    "https://openapi.programming-hero.com/api/bazardor",
  process.env.NEXT_PUBLIC_BASE_URL_1 ||
    "https://api.api-store.workers.dev/api/bazardor",
  process.env.NEXT_PUBLIC_BASE_URL_2 ||
    "https://api.abcz.workers.dev/api/bazardor",
];

const CATEGORY_INFO: Record<
  string,
  { title: string; subtitle: string; icon: string }
> = {
  chal: {
    title: "চাল",
    subtitle: "চাল পণ্যের আজকের দাম ও পরিবর্তন",
    icon: "🍚",
  },
  dal: {
    title: "ডাল",
    subtitle: "ডাল পণ্যের আজকের দাম ও পরিবর্তন",
    icon: "🫘",
  },
  tel: {
    title: "তেল",
    subtitle: "তেল পণ্যের আজকের দাম ও পরিবর্তন",
    icon: "🫗",
  },
  sobji: {
    title: "সবজি",
    subtitle: "সবজি পণ্যের আজকের দাম ও পরিবর্তন",
    icon: "🥬",
  },
  mach: {
    title: "মাছ",
    subtitle: "মাছ পণ্যের আজকের দাম ও পরিবর্তন",
    icon: "🐟",
  },
  mangsho: {
    title: "মাংস",
    subtitle: "মাংস পণ্যের আজকের দাম ও পরিবর্তন",
    icon: "🍗",
  },
  "dim-dudh": {
    title: "ডিম-দুধ",
    subtitle: "ডিম ও দুধের আজকের দাম ও পরিবর্তন",
    icon: "🥚",
  },
  moshla: {
    title: "মসলা",
    subtitle: "মসলার আজকের দাম ও পরিবর্তন",
    icon: "🌶️",
  },
};

function getProducts(payload: unknown): Product[] {
  if (Array.isArray(payload)) {
    return payload as Product[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const object = payload as {
    data?: unknown;
    products?: unknown;
  };

  if (Array.isArray(object.products)) {
    return object.products as Product[];
  }

  if (Array.isArray(object.data)) {
    return object.data as Product[];
  }

  if (object.data && typeof object.data === "object") {
    const nested = object.data as { products?: unknown };

    if (Array.isArray(nested.products)) {
      return nested.products as Product[];
    }
  }

  return [];
}

function getPrice(value: number | string | undefined): number {
  const price = Number(value);
  return Number.isFinite(price) ? price : 0;
}

function getProductName(product: Product): string {
  return product.nameBn ?? product.name ?? product.title ?? "পণ্য";
}

export default function CategoryPageClient({ slug }: Props) {
  const categorySlug = decodeURIComponent(slug).toLowerCase();
  const category = CATEGORY_INFO[categorySlug] ?? {
    title: categorySlug,
    subtitle: "এই ক্যাটাগরির পণ্যের আজকের দাম ও পরিবর্তন",
    icon: "🛒",
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError("");

      for (const baseUrl of API_URLS) {
        try {
          const url = `${baseUrl.replace(/\/$/, "")}/products?category=${encodeURIComponent(categorySlug)}`;
          const response = await fetch(url, { cache: "no-store" });

          if (!response.ok) continue;

          const payload: unknown = await response.json();
          const fetchedProducts = getProducts(payload);

          const filteredProducts = fetchedProducts.filter((product) => {
            if (!product.category) return true;
            return product.category.toLowerCase() === categorySlug;
          });

          if (!cancelled) {
            setProducts(filteredProducts);
            setError("");
          }

          return;
        } catch {
          // Try the next API endpoint.
        }
      }

      if (!cancelled) {
        setProducts([]);
        setError("পণ্যের তথ্য পাওয়া যায়নি। কিছুক্ষণ পর আবার চেষ্টা কর।");
      }
    }

    void loadProducts().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  const sortedProducts = useMemo(() => {
    const items = [...products];

    if (sort === "low") {
      items.sort((a, b) => getPrice(a.today) - getPrice(b.today));
    } else if (sort === "high") {
      items.sort((a, b) => getPrice(b.today) - getPrice(a.today));
    } else if (sort === "name") {
      items.sort((a, b) =>
        getProductName(a).localeCompare(getProductName(b), "bn"),
      );
    }

    return items;
  }, [products, sort]);

  return (
    <main className="min-h-[calc(100vh-140px)] bg-[#f0f5f0] px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-[1060px]">
        {/* Category heading */}
        <section className="flex items-center gap-3 rounded-xl border border-[#e3eae3] bg-[#fbfdfb] px-4 py-4 sm:px-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf3ed] text-2xl">
            {category.icon}
          </div>

          <div>
            <h1 className="text-lg font-bold text-[#27352c]">
              {category.title}
            </h1>
            <p className="mt-0.5 text-xs text-[#7c857e]">
              {category.subtitle}
            </p>
          </div>
        </section>

        {/* Sort and count */}
        <section className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e3eae3] bg-[#fbfdfb] px-4 py-3">
          <p className="text-xs text-[#7c857e]">
            মোট{" "}
            <span className="font-semibold text-[#27352c]">
              {loading ? "..." : sortedProducts.length}
            </span>{" "}
            টি পণ্য
          </p>

          <div className="flex items-center gap-2">
            <label
              htmlFor="product-sort"
              className="text-xs text-[#7c857e]"
            >
              সাজান:
            </label>

            <select
              id="product-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="max-w-[190px] rounded-md border border-[#dce4dc] bg-white px-2 py-2 text-xs text-[#455148] outline-none focus:border-[#07883e]"
            >
              <option value="default">ডিফল্ট</option>
              <option value="low">দাম: কম থেকে বেশি</option>
              <option value="high">দাম: বেশি থেকে কম</option>
              <option value="name">নাম অনুযায়ী</option>
            </select>
          </div>
        </section>

        {/* Loading state */}
        {loading && (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-xl border border-[#e3eae3] bg-[#fbfdfb]"
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-100 bg-white px-4 py-8 text-center text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && sortedProducts.length === 0 && (
          <div className="mt-4 rounded-xl border border-[#e3eae3] bg-[#fbfdfb] px-4 py-10 text-center">
            <p className="text-2xl">{category.icon}</p>
            <p className="mt-2 text-sm text-[#68736a]">
              এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
            </p>
          </div>
        )}

        {/* Product grid */}
        {!loading && !error && sortedProducts.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedProducts.map((product, index) => {
              const name = getProductName(product);
              const today = getPrice(product.today);
              const yesterday = getPrice(product.yesterday);
              const direction =
                product.change?.dir ??
                (today > yesterday
                  ? "up"
                  : today < yesterday
                    ? "down"
                    : "same");

              const percentage =
                product.change?.pct !== undefined
                  ? Math.abs(Number(product.change.pct)) || 0
                  : yesterday > 0
                    ? Math.abs(((today - yesterday) / yesterday) * 100)
                    : 0;

              return (
                <article
                  key={
                    product.id ??
                    product._id ??
                    product.slug ??
                    `${name}-${index}`
                  }
                  className="rounded-xl border border-[#e3eae3] bg-[#fbfdfb] p-4 transition hover:border-[#cbdccb]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#edf3ed]">
                      {product.image &&
                      /^https?:\/\//i.test(product.image) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xl">
                          {product.categoryIcon || category.icon}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-sm font-semibold text-[#27352c]">
                        {name}
                      </h2>
                      <p className="mt-1 text-[11px] text-[#7c857e]">
                        প্রতি{" "}
                        {product.unit === "kg"
                          ? "কেজি"
                          : product.unit || "একক"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-2 border-t border-[#edf0ed] pt-3">
                    <div>
                      <p className="text-[11px] text-[#7c857e]">
                        আজকের দাম
                      </p>
                      <p className="mt-1 text-base font-bold text-[#27352c]">
                        ৳{today.toLocaleString("bn-BD")}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                        direction === "up"
                          ? "bg-red-50 text-red-600"
                          : direction === "down"
                            ? "bg-green-50 text-[#07883e]"
                            : "bg-gray-100 text-gray-500"
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
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
