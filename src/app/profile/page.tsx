
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-cilent";
import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getUser() {
      try {
        const result = await authClient.getSession();
        const currentUser =
          (result.data?.user as User | undefined) ?? null;

        setUser(currentUser);
        setName(currentUser?.name ?? "");
      } catch (error) {
        console.error("Profile session error:", error);
      } finally {
        setLoading(false);
      }
    }

    void getUser();
  }, []);

  async function handleUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (!name.trim()) {
      setMessage("নাম লিখতে হবে।");
      return;
    }

    setUpdating(true);

    try {
      const result = await authClient.updateUser({
        name: name.trim(),
      });

      if (result.error) {
        setMessage(result.error.message || "নাম আপডেট করা যায়নি।");
        return;
      }

      setUser((previous) =>
        previous ? { ...previous, name: name.trim() } : previous
      );

      setMessage("নাম সফলভাবে আপডেট হয়েছে।");
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage("কিছু সমস্যা হয়েছে। আবার চেষ্টা করো।");
    } finally {
      setUpdating(false);
    }
  }

  async function handleLogout() {
    try {
      await authClient.signOut();
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setMessage("লগ আউট করা যায়নি। আবার চেষ্টা করো।");
    }
  }

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#f1f6f2] px-4 py-16">
        <div className="mx-auto max-w-md animate-pulse">
          <div className="mb-5 h-7 w-40 rounded bg-gray-200" />
          <div className="mb-3 h-20 rounded-xl bg-white" />
          <div className="h-36 rounded-xl bg-white" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f1f6f2] px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-800">
            প্রোফাইল দেখতে সাইন ইন কর
          </h1>

          <Link
            href="/sign-in"
            className="mt-4 inline-block rounded-lg bg-green-700 px-5 py-2 text-sm text-white"
          >
            সাইন ইন
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-[#f1f6f2] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-md">

       
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-800">
            আমার প্রোফাইল
          </h1>

          <p className="mt-1 text-xs text-gray-500">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* User Profile Card */}
        <section className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

          <div className="flex min-w-0 items-center gap-3">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt="Profile"
                className="h-12 w-12 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                <UserRound size={25} />
              </div>
            )}

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-gray-800">
                {user.name || "ব্যবহারকারী"}
              </h2>

              <p className="truncate text-xs text-gray-500">
                {user.email || "ইমেইল পাওয়া যায়নি"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            type="button"
            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-red-300 px-2.5 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={13} />
            লগ আউট
          </button>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-5 text-sm font-semibold text-gray-800">
            তথ্য
          </h2>

          <form onSubmit={handleUpdate}>
            <label
              htmlFor="name"
              className="mb-2 block text-xs font-medium text-gray-700"
            >
              নাম
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম লিখুন"
              className="mb-3 h-9 w-full rounded-md border border-gray-200 px-3 text-sm text-gray-800 outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />

            {message && (
              <p className="mb-3 text-xs text-gray-600" role="status">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={updating}
              className="h-9 w-full rounded-md bg-green-700 text-xs font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
