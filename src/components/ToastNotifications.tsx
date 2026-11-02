"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function ToastNotifications() {
  const pathname = usePathname();

  useEffect(() => {
    const url = new URL(window.location.href);
    const authStatus = url.searchParams.get("auth");
    const required = url.searchParams.get("required");

    if (authStatus === "login") toast.success("সাইন ইন সফল হয়েছে।");
    if (authStatus === "signup") toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।");
    if (authStatus === "logout") toast.success("সাইন আউট সফল হয়েছে।");
    if (required === "1") toast("এই পৃষ্ঠাটি দেখতে আগে সাইন ইন করুন।");

    if (authStatus || required) {
      url.searchParams.delete("auth");
      url.searchParams.delete("required");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }
  }, [pathname]);

  return <Toaster position="top-center" toastOptions={{ duration: 3500 }} />;
}
