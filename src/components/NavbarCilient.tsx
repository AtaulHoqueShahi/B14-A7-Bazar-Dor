
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  UserRound,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-cilent";
import type { ApiProduct } from "./Navbar";

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

const categories = [
  { name: "সব পণ্য", slug: "", icon: "🛒" },
  { name: "চাল", slug: "chal", icon: "🍚" },
  { name: "ডাল", slug: "dal", icon: "🫘" },
  { name: "তেল", slug: "tel", icon: "🫗" },
  { name: "সবজি", slug: "sobji", icon: "🥬" },
  { name: "মাছ", slug: "mach", icon: "🐟" },
  { name: "মাংস", slug: "mangsho", icon: "🍗" },
  { name: "ডিম-দুধ", slug: "dim-dudh", icon: "🥚" },
  { name: "মসলা", slug: "moshla", icon: "🌶️" },
];

function ProfileMenu() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const result = await authClient.getSession();
        const sessionUser = result.data?.user as
          | SessionUser
          | undefined;

        if (active) {
          setUser(sessionUser ?? null);
        }
      } catch (error) {
        console.error("Session error:", error);
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadSession();

    return () => {
      active = false;
    };
  }, []);

  async function handleSignOut() {
    try {
      const result = await authClient.signOut();

      if (result.error) {
        console.error("Sign out error:", result.error);
        return;
      }

      window.location.assign("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  if (loading) {
    return (
      <div className="h-9 w-24 animate-pulse rounded-lg bg-[#edf2ed]" />
    );
  }

  if (!user) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/sign-in"
          className="rounded-md border border-[#07883e] px-3 py-2 text-xs font-medium text-[#07883e] transition hover:bg-[#f0f5f0]"
        >
          সাইন ইন
        </Link>
        <Link
          href="/sign-up"
          className="rounded-md bg-[#07883e] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#067333]"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-[#f0f5f0]"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt="Profile"
            className="h-8 w-8 rounded-xl object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e8eee8] text-[#07883e]">
            <UserRound size={19} />
          </span>
        )}

        <span className="max-w-24 truncate text-xs font-medium text-[#27352c]">
          {user.name || "ব্যবহারকারী"}
        </span>

        <ChevronDown
          size={12}
          className={`text-[#7c857e] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[60] mt-2 w-44 rounded-lg border border-[#e3eae3] bg-white p-1.5 shadow-lg">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm text-[#27352c] transition hover:bg-[#f0f5f0]"
          >
            আমার প্রোফাইল
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={15} />
            সাইন আউট
          </button>
        </div>
      )}
    </div>
  );
}

export default function NavbarClient({
  products,
}: {
  products: ApiProduct[];
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5ebe5] bg-[#fbfdfb] text-[#26352b]">
      <div className="mx-auto flex min-h-[58px] max-w-[1120px] items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#07883e] text-xl text-white">
            🛒
          </span>

          <span>
            <span className="block text-lg font-extrabold leading-5 tracking-tight">
              বাজার দর
            </span>
            <span className="mt-0.5 block text-[9px] text-[#68736a]">
              প্রয়োজনীয় পণ্যের বাজারদর, এক নজরে
            </span>
          </span>
        </Link>

        <div className="ml-auto hidden sm:block">
          <ProfileMenu />
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          aria-label="মেনু"
          aria-expanded={mobileMenuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#f0f5f0] sm:hidden"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav
        aria-label="পণ্যের ক্যাটাগরি"
        className="border-t border-[#f0f2f0]"
      >
        <div className="mx-auto hidden min-h-[38px] max-w-[1120px] items-center justify-center gap-1 overflow-x-auto px-4 sm:flex">
          {categories.map((category) => {
            const href = category.slug
              ? `/category/${category.slug}`
              : "/#সব-পণ্য";

            const active = category.slug
              ? pathname === `/category/${category.slug}`
              : pathname === "/";

            return (
              <Link
                key={category.slug || "all"}
                href={href}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-[11px] transition ${
                  active
                    ? "bg-[#07883e] font-semibold text-white"
                    : "text-[#354137] hover:bg-[#edf4ed]"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </Link>
            );
          })}
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-[#e5ebe5] bg-[#fbfdfb] px-4 py-3 sm:hidden">
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug || "all"}
                  href={
                    category.slug
                      ? `/category/${category.slug}`
                      : "/#সব-পণ্য"
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-md px-3 py-2 text-sm ${
                    category.slug &&
                    pathname === `/category/${category.slug}`
                      ? "bg-[#07883e] text-white"
                      : "bg-[#f0f5f0] text-[#354137]"
                  }`}
                >
                  {category.icon} {category.name}
                </Link>
              ))}
            </div>

            <div className="mt-3 border-t border-[#e5ebe5] pt-3">
              <ProfileMenu />
            </div>
          </div>
        )}
      </nav>

      <div className="overflow-hidden border-t border-[#e5ebe5] bg-[#fbfdfb]">
        <div className="flex min-h-[32px] items-center overflow-hidden">
          {products.length > 0 ? (
            <div className="flex w-max shrink-0 animate-[ticker_55s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0">
                  {products.map((product, index) => {
                    const name =
                      product.nameBn || product.name || product.slug;
                    const unit =
                      product.unit === "kg"
                        ? "কেজি"
                        : product.unit || "একক";

                    return (
                      <Link
                        key={`${copy}-${product.id}-${index}`}
                        href={`/product/${product.slug}`}
                        className="flex shrink-0 items-center gap-1.5 border-r border-[#e7ece7] px-3 py-2 text-[10px] sm:text-[11px]"
                      >
                        <span>
                          {product.categoryIcon || "🛒"}
                        </span>

                        <span className="font-medium text-[#374238]">
                          {name}
                        </span>

                        <span className="whitespace-nowrap text-[#374238]">
                          {Number(product.today).toLocaleString("bn-BD")}
                          {" "}টাকা/{unit}
                        </span>

                        {product.change?.dir === "up" ? (
                          <span className="whitespace-nowrap font-semibold text-red-500">
                            ▲{" "}
                            {Number(product.change.pct).toLocaleString("bn-BD")}
                            %
                          </span>
                        ) : product.change?.dir === "down" ? (
                          <span className="whitespace-nowrap font-semibold text-[#07883e]">
                            ▼{" "}
                            {Number(product.change.pct).toLocaleString("bn-BD")}
                            %
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
            <p className="px-4 py-2 text-xs text-[#68736a]">
              বর্তমানে বাজারদরের তথ্য পাওয়া যাচ্ছে না।
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
