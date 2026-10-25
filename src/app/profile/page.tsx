

"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowLeftRight, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-cilent";

type ProfileUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const result = await authClient.getSession();
        const sessionUser = result.data?.user as ProfileUser | undefined;

        if (sessionUser) {
          setUser(sessionUser);
          setName(sessionUser.name ?? "");
        }
      } catch (error) {
        console.error("Profile load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!name.trim()) {
      setMessage("নাম লিখুন।");
      return;
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser({
        name: name.trim(),
      });

      if (result.error) {
        setMessage(result.error.message ?? "নাম আপডেট করা যায়নি।");
        return;
      }

      setUser((current) =>
        current ? { ...current, name: name.trim() } : current,
      );
      setMessage("নাম সফলভাবে আপডেট হয়েছে।");
    } catch {
      setMessage("আপডেট করতে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    try {
      await authClient.signOut();
      window.location.assign("/sign-in");
    } catch {
      setMessage("সাইন আউট করা যায়নি।");
    }
  }

  return (
    <section className="min-h-[calc(100vh-140px)] bg-[#f0f5f0] px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-[700px]">
        <header className="mb-5">
          <h1 className="text-2xl font-bold text-[#24352b]">
            আমার প্রোফাইল
          </h1>
          <p className="mt-1 text-sm text-[#7b847d]">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন
          </p>
        </header>

        {loading ? (
          <div className="h-24 animate-pulse rounded-xl border border-[#e2e9e2] bg-white" />
        ) : user ? (
          <>
            <div className="flex flex-col gap-4 rounded-xl border border-[#e3eae3] bg-[#fbfdfb] p-4 sm:flex-row sm:items-center">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt="প্রোফাইল ছবি"
                  className="h-14 w-14 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#edf2ed] text-[#07883e]">
                  <UserRound size={28} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-[#27352c]">
                  {user.name || "ব্যবহারকারী"}
                </h2>
                <p className="break-all text-sm text-[#7c847e]">
                  {user.email}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="self-start rounded-md border border-red-400 px-3 py-2 text-sm text-red-500 transition hover:bg-red-50 sm:self-center"
              >
                ↶ সাইন আউট
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="mt-4 rounded-xl border border-[#e3eae3] bg-[#fbfdfb] p-5 sm:p-6"
            >
              <h2 className="mb-6 text-base font-semibold text-[#27352c]">
                তথ্য
              </h2>

              <label
                htmlFor="profile-name"
                className="mb-2 block pl-1 text-sm text-[#515c54]"
              >
                নাম
              </label>

              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="আপনার নাম"
                className="h-10 w-full rounded-md border border-[#e2e9e2] bg-transparent px-3 text-sm text-[#24352b] outline-none transition focus:border-[#07883e] focus:ring-2 focus:ring-[#07883e]/10"
              />

              {message && (
                <p className="mt-3 text-sm text-[#07883e]" role="status">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="mt-3 flex h-10 w-full items-center justify-center rounded-md bg-[#07883e] text-sm font-medium text-white shadow-sm transition hover:bg-[#067333] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "আপডেট হচ্ছে..." : "আপডেট"}
              </button>
            </form>
          </>
        ) : (
          <div className="rounded-xl border border-[#e3eae3] bg-[#fbfdfb] p-6 text-center">
            <p className="text-sm text-[#58645b]">
              প্রোফাইল দেখতে আগে সাইন ইন কর।
            </p>
            <a
              href="/sign-in"
              className="mt-4 inline-flex rounded-md bg-[#07883e] px-5 py-2 text-sm text-white hover:bg-[#067333]"
            >
              সাইন ইন
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
