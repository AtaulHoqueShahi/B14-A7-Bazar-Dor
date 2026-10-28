
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  UserRound,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { authClient } from "@/lib/auth-cilent";
import type { ApiProduct } from "./Navbar";

type NavbarClientProps = {
  products: ApiProduct[];
};

const categories = [
  { name: "সব পণ্য", slug: "" },
  { name: "চাল", slug: "chal" },
  { name: "ডাল", slug: "dal" },
  { name: "তেল", slug: "tel" },
  { name: "সবজি", slug: "sobji" },
  { name: "মাছ", slug: "mach" },
  { name: "মাংস", slug: "mangsho" },
  { name: "ডিম-দুধ", slug: "dim-dudh" },
  { name: "মসলা", slug: "moshla" },
];

export default function NavbarClient({
  products,
}: NavbarClientProps) {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [todayDate, setTodayDate] = useState("");

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

 
  useEffect(() => {
    const updateDate = () => {
      const formattedDate = new Intl.DateTimeFormat("bn-BD", {
        timeZone: "Asia/Dhaka",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());

      setTodayDate(formattedDate);
    };

    updateDate();
  }, []);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await authClient.signOut();
      setProfileMenuOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setSigningOut(false);
    }
  };

  const formatPrice = (price: number) =>
    Number(price).toLocaleString("bn-BD");

  const formatPercentage = (percentage: number) =>
    Number(percentage).toLocaleString("bn-BD", {
      maximumFractionDigits: 1,
    });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e5ebe5] bg-[#fbfdfb]">
  
      <div className="mx-auto flex min-h-[58px] max-w-[1120px] items-center justify-between gap-3 px-4 sm:px-6">
     
        <Link
          href="/"
          className="flex shrink-0 flex-col items-start"
          aria-label="বাজার দর হোম"
        >
          <span className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#07883e] text-base text-white">
              🛒
            </span>

            <span className="text-base font-extrabold tracking-tight text-[#26352b]">
              বাজার দর
            </span>
          </span>

          <span className="ml-10 mt-0.5 whitespace-nowrap text-[9px] leading-tight text-[#68736a]">
            {todayDate || "তারিখ লোড হচ্ছে..."}
          </span>
        </Link>

        <div className="hidden items-center gap-2 sm:flex">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-100" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setProfileMenuOpen((previous) => !previous)
                }
                className="flex items-center gap-2 rounded-lg border border-[#e0e8e0] px-3 py-2 text-sm font-semibold text-[#26352b] transition hover:bg-[#f0f7f0]"
                aria-expanded={profileMenuOpen}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <UserRound size={18} />
                )}

                <span className="max-w-[120px] truncate">
                  {user.name || user.email || "আমার অ্যাকাউন্ট"}
                </span>

                <ChevronDown size={15} />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[#e5ebe5] bg-white p-2 shadow-lg">
                  <Link
                    href="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-[#26352b] hover:bg-[#f0f7f0]"
                  >
                    প্রোফাইল
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    <LogOut size={16} />
                    {signingOut
                      ? "লগ আউট হচ্ছে..."
                      : "সাইন আউট"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-[#26352b] transition hover:bg-[#edf5ed]"
              >
                সাইন ইন
              </Link>

              <Link
                href="/sign-up"
                className="rounded-lg bg-[#07883e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#066e33]"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>

   
        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen((previous) => !previous)
          }
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#e5ebe5] text-[#26352b] transition hover:bg-[#edf5ed] sm:hidden"
          aria-label={
            mobileMenuOpen ? "মেনু বন্ধ করো" : "মেনু খোলো"
          }
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

     
      <nav className="hidden border-t border-[#edf0ed] sm:block">
        <div className="mx-auto flex max-w-[1120px] items-center justify-center gap-1 overflow-x-auto px-4 sm:px-6">
          {categories.map((category) => {
            const href = category.slug
              ? `/category/${category.slug}`
              : "/";

            const isActive =
              category.slug === ""
                ? pathname === "/"
                : pathname === href ||
                  pathname.startsWith(`${href}/`);

            return (
              <Link
                key={category.name}
                href={href}
                className={`shrink-0 border-b-2 px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "border-[#07883e] text-[#07883e]"
                    : "border-transparent text-[#58645a] hover:border-[#b6d9bf] hover:text-[#07883e]"
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      </nav>

   
      {mobileMenuOpen && (
        <div className="border-t border-[#e5ebe5] bg-white px-4 py-3 sm:hidden">
          <div className="mb-3 border-b border-[#edf0ed] pb-3 text-[10px] text-[#68736a]">
            {todayDate || "তারিখ লোড হচ্ছে..."}
          </div>

          <nav className="grid grid-cols-2 gap-2">
            {categories.map((category) => {
              const href = category.slug
                ? `/category/${category.slug}`
                : "/";

              const isActive =
                category.slug === ""
                  ? pathname === "/"
                  : pathname === href ||
                    pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={category.name}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#eaf6ed] text-[#07883e]"
                      : "text-[#465348] hover:bg-[#f3f7f3]"
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-3 border-t border-[#edf0ed] pt-3">
            {isPending ? (
              <p className="px-2 py-2 text-sm text-gray-500">
                লোড হচ্ছে...
              </p>
            ) : user ? (
              <div className="flex flex-col gap-2">
                <p className="truncate px-2 text-sm text-[#59645b]">
                  {user.name || user.email}
                </p>

                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-[#26352b] hover:bg-[#f0f7f0]"
                >
                  প্রোফাইল
                </Link>

                <button
                  type="button"
                  disabled={signingOut}
                  onClick={handleSignOut}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  <LogOut size={16} />
                  {signingOut
                    ? "লগ আউট হচ্ছে..."
                    : "সাইন আউট"}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-lg border border-[#dce7dd] px-3 py-2.5 text-center text-sm font-semibold text-[#26352b]"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 rounded-lg bg-[#07883e] px-3 py-2.5 text-center text-sm font-semibold text-white"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="ticker-viewport w-full border-t border-[#e5ebe5] bg-[#fbfdfb]">
        {products.length > 0 ? (
          <div className="ticker-track">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="ticker-group"
                aria-hidden={copy === 1}
              >
                {products.map((product, index) => {
                  const name =
                    product.nameBn ||
                    product.name ||
                    product.slug;

                  const unit =
                    product.unit === "kg"
                      ? "কেজি"
                      : product.unit || "একক";

                  const changeDirection = product.change?.dir;
                  const percentage = Number(
                    product.change?.pct ?? 0
                  );

                  return (
                    <Link
                      key={`${copy}-${product.id}-${index}`}
                      href={`/product/${product.slug}`}
                      tabIndex={copy === 1 ? -1 : undefined}
                      className="flex shrink-0 items-center gap-1.5 border-r border-[#e7ece7] px-3 py-2 text-[10px] sm:text-[11px]"
                    >
                      <span>
                        {product.categoryIcon || "🛒"}
                      </span>

                      <span className="whitespace-nowrap font-medium text-[#374238]">
                        {name}
                      </span>

                      <span className="whitespace-nowrap text-[#374238]">
                        {formatPrice(product.today)} টাকা/{unit}
                      </span>

                      {changeDirection === "up" ? (
                        <span className="whitespace-nowrap font-semibold text-red-500">
                          ▲ {formatPercentage(percentage)}%
                        </span>
                      ) : changeDirection === "down" ? (
                        <span className="whitespace-nowrap font-semibold text-[#07883e]">
                          ▼ {formatPercentage(percentage)}%
                        </span>
                      ) : (
                        <span className="whitespace-nowrap font-semibold text-[#68736a]">
                          — ০%
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <p className="flex min-h-[34px] items-center px-4 text-xs text-[#68736a]">
            বর্তমানে বাজারদরের তথ্য পাওয়া যাচ্ছে না।
          </p>
        )}
      </div>
    </header>
  );
}
