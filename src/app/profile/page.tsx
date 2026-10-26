
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-cilent";
import Link from "next/link";

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const result = await authClient.getSession();
        setUser((result.data?.user as User | undefined) ?? null);
      } catch (error) {
        console.error("Profile session error:", error);
      } finally {
        setLoading(false);
      }
    }

    void getUser();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        প্রোফাইল লোড হচ্ছে...
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl p-6 text-center">
        <h1 className="text-2xl font-bold">প্রোফাইল দেখতে সাইন ইন কর</h1>
        <Link
          href="/sign-in"
          className="mt-4 inline-block rounded-lg bg-green-700 px-5 py-2 text-white"
        >
          সাইন ইন
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          আমার প্রোফাইল
        </h1>

        <div className="flex items-center gap-4">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt="Profile"
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
              👤
            </div>
          )}

          <div className="min-w-0">
            <h2 className="break-words text-xl font-semibold text-gray-800">
              {user.name || "ব্যবহারকারী"}
            </h2>
            <p className="break-all text-sm text-gray-500">
              {user.email || "ইমেইল পাওয়া যায়নি"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
