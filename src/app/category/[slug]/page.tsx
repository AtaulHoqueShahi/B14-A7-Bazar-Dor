


import { Suspense } from "react";
import { notFound } from "next/navigation";
import CategoryPageClient from "./CategoryPageClient";

const VALID_CATEGORY_SLUGS = new Set([
  "chal", "dal", "tel", "sobji", "mach", "mangsho", "dim-dudh", "moshla",
]);

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function CategoryContent({ params }: PageProps) {
  const { slug } = await params;
  const normalizedSlug = decodeURIComponent(slug).toLowerCase();

  if (!VALID_CATEGORY_SLUGS.has(normalizedSlug)) notFound();

  return <CategoryPageClient slug={normalizedSlug} />;
}

export default function CategoryPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-screen max-w-7xl px-4 py-10">
          <div className="mb-6 h-8 w-56 animate-pulse rounded-lg bg-gray-200" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        </main>
      }
    >
      <CategoryContent params={params} />
    </Suspense>
  );
}
