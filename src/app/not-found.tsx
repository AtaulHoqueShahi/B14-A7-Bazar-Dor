import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <SearchX className="h-10 w-10 text-green-600" />
        </div>

        <p className="mb-2 text-sm font-semibold text-green-600">
          ERROR 404
        </p>

        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          পেজটি খুঁজে পাওয়া যায়নি!
        </h1>

        <p className="mb-8 text-sm leading-6 text-gray-500">
          দুঃখিত! তুমি যে পেজটি খুঁজছো সেটি পাওয়া যাচ্ছে না।
          অনুগ্রহ করে URL চেক করো অথবা হোম পেজে ফিরে যাও।
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
        >
          <Home size={18} />
          হোম পেজে ফিরে যাও
        </Link>
      </div>
    </main>
  );
}