"use client";

import Link from "next/link";
import { useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-cilent";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [signingOut, setSigningOut] = useState(false);
  const user = session?.user;

  async function handleLogout() {
    setSigningOut(true);
    try {
      await authClient.signOut();
      window.location.assign("/?auth=logout");
    } catch {
      toast.error("লগ আউট করা যায়নি। আবার চেষ্টা করো।");
      setSigningOut(false);
    }
  }

  if (isPending) {
    return <main className="min-h-[70vh] bg-[#f1f6f2] px-4 py-16"><div className="mx-auto max-w-md animate-pulse"><div className="mb-5 h-7 w-40 rounded bg-gray-200" /><div className="mb-3 h-20 rounded-xl bg-white" /><div className="h-24 rounded-xl bg-white" /></div></main>;
  }

  if (!user) {
    return <main className="flex min-h-[70vh] items-center justify-center bg-[#f1f6f2] px-4"><div className="text-center"><h1 className="text-xl font-bold text-gray-800">প্রোফাইল দেখতে সাইন ইন করো</h1><Link href="/sign-in?required=1&redirectTo=%2Fprofile" className="mt-4 inline-block rounded-lg bg-green-700 px-5 py-2 text-sm text-white">সাইন ইন</Link></div></main>;
  }

  return (
    <main className="min-h-[70vh] bg-[#f1f6f2] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-md">
        <div className="mb-5"><h1 className="text-xl font-bold text-gray-800">আমার প্রোফাইল</h1><p className="mt-1 text-xs text-gray-500">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p></div>
        <section className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex min-w-0 items-center gap-3">
            {user.image ? <img src={user.image} alt="প্রোফাইল ছবি" className="h-12 w-12 shrink-0 rounded-xl object-cover" /> : <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600"><UserRound size={25} /></div>}
            <div className="min-w-0"><h2 className="truncate text-sm font-semibold text-gray-800">{user.name || "ব্যবহারকারী"}</h2><p className="truncate text-xs text-gray-500">{user.email || "ইমেইল পাওয়া যায়নি"}</p></div>
          </div>
          <button onClick={handleLogout} type="button" disabled={signingOut} className="inline-flex shrink-0 items-center gap-1 rounded-md border border-red-300 px-2.5 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-60"><LogOut size={13} />{signingOut ? "লগ আউট হচ্ছে..." : "লগ আউট"}</button>
        </section>
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"><p className="mb-4 text-sm text-gray-600">নাম পরিবর্তন বা প্রোফাইলের তথ্য আপডেট করুন।</p><Link href="/profile/update" className="inline-flex h-10 w-full items-center justify-center rounded-md bg-green-700 text-sm font-semibold text-white transition hover:bg-green-800">তথ্য আপডেট করুন</Link></section>
      </div>
    </main>
  );
}
