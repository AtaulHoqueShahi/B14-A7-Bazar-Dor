"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-cilent";

export default function ProfileUpdatePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => { if (user?.name) setName(user.name); }, [user?.name]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) { toast.error("নাম লিখতে হবে।"); return; }
    setUpdating(true);
    try {
      const result = await authClient.updateUser({ name: trimmedName });
      if (result.error) { toast.error(result.error.message || "নাম আপডেট করা যায়নি।"); return; }
      toast.success("নাম সফলভাবে আপডেট হয়েছে।");
      router.push("/profile");
      router.refresh();
    } catch { toast.error("কিছু সমস্যা হয়েছে। আবার চেষ্টা করো।"); }
    finally { setUpdating(false); }
  }

  if (isPending) return <main className="min-h-[65vh] px-4 py-12"><div className="mx-auto h-48 max-w-md animate-pulse rounded-xl bg-gray-100" /></main>;
  if (!user) return <main className="flex min-h-[65vh] items-center justify-center px-4"><div className="text-center"><h1 className="text-xl font-bold">তথ্য আপডেট করতে সাইন ইন করুন</h1><Link href="/sign-in?required=1&redirectTo=%2Fprofile%2Fupdate" className="mt-4 inline-flex rounded-lg bg-green-700 px-5 py-2 text-sm text-white">সাইন ইন</Link></div></main>;

  return (
    <main className="min-h-[65vh] bg-[#f1f6f2] px-4 py-10 sm:py-14">
      <section className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <Link href="/profile" className="mb-5 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-green-700"><ArrowLeft size={16} />প্রোফাইলে ফিরে যান</Link>
        <h1 className="mb-2 text-xl font-bold text-gray-900">তথ্য আপডেট করুন</h1><p className="mb-5 text-sm text-gray-500">আপনার অ্যাকাউন্টের নাম পরিবর্তন করুন।</p>
        <form onSubmit={handleSubmit} className="space-y-4"><div><label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">নাম</label><input id="name" type="text" value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} autoComplete="name" className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" /></div><button type="submit" disabled={updating} className="h-10 w-full rounded-md bg-green-700 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60">{updating ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}</button></form>
      </section>
    </main>
  );
}
