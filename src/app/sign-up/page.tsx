
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-cilent";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("দুটি পাসওয়ার্ড মিলছে না।");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
        return;
      }

      window.location.assign("/");
    } catch {
      setError("অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা কর।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignUp(provider: "google" | "github") {
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (result.error) {
        setError(result.error.message || "সোশ্যাল লগইন করা যায়নি।");
        setLoading(false);
      }
    } catch {
      setError("সোশ্যাল লগইন করা যায়নি। আবার চেষ্টা কর।");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[500px] items-start justify-center bg-[#f0f6f1] px-4 pb-12 pt-7 text-gray-800 sm:pt-10">
      <section className="w-full max-w-[360px]">
        <div className="mb-5 text-center">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            অ্যাকাউন্ট তৈরি করুন
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            বিনা ঝামেলায় বাজারদরের প্রয়োজনীয় তথ্য দেখুন।
          </p>
        </div>

        <div className="rounded-xl border border-[#e1e9e2] bg-white p-5 shadow-sm sm:p-6">
          {error && (
            <p
              role="alert"
              className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                নাম
              </label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="তোমার নাম"
                autoComplete="name"
                required
                className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                ইমেইল
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="h-10 w-full rounded-md border border-gray-200 px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                পাসওয়ার্ড
              </label>
              <div className="flex h-10 items-center rounded-md border border-gray-200 pr-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label="পাসওয়ার্ড দেখাও বা লুকাও"
                  className="text-gray-400 hover:text-emerald-700"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <div className="flex h-10 items-center rounded-md border border-gray-200 pr-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="আবার পাসওয়ার্ড লিখ"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((value) => !value)}
                  aria-label="পাসওয়ার্ড দেখাও বা লুকাও"
                  className="text-gray-400 hover:text-emerald-700"
                >
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">অথবা</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSocialSignUp("google")}
              className="flex min-h-10 items-center justify-center gap-2 rounded-md border border-gray-200 px-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
            >
              <span className="text-base font-bold text-blue-600">G</span>
              Google
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSocialSignUp("github")}
              className="flex min-h-10 items-center justify-center gap-2 rounded-md border border-gray-200 px-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
            >
              <span className="text-base font-bold text-gray-900">GH</span>
              GitHub
            </button>
          </div>

          <p className="mt-5 text-center text-sm text-gray-500">
            অ্যাকাউন্ট আছে?{" "}
            <Link href="/sign-in" className="font-semibold text-emerald-700 hover:underline">
              সাইন ইন করুন
            </Link>
          </p>
        </div>

        <Link
          href="/"
          className="mt-5 flex items-center justify-center gap-1.5 text-xs text-gray-500 transition hover:text-emerald-700"
        >
          <ArrowLeft size={14} />
          হোম পেজে ফিরে যান
        </Link>
      </section>
    </main>
  );
}
