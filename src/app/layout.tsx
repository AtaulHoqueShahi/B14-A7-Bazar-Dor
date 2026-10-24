
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "বাজার দর",
  description: "প্রয়োজনীয় পণ্যের বাজারদর এক নজরে দেখুন।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className="flex min-h-screen flex-col">
       <Suspense
  fallback={
    <div className="h-24 animate-pulse bg-white" />
  }
>
  <Navbar />
</Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
