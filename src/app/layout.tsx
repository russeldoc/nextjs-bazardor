import type { Metadata } from "next";
// import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";
import { getCategories, getProducts } from "@/lib/products";

// const font = Noto_Sans_Bengali({ subsets: ["bengali", "latin"], variable: "--font-bn", display: "swap" });

export const metadata: Metadata = {
  title: { default: "বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে", template: "%s | বাজার দর" },
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দৈনিক বাজারদর, দাম ওঠানামা ও বাজারভিত্তিক দাম।",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const today = new Intl.DateTimeFormat("bn-BD", { dateStyle: "full", timeZone: "Asia/Dhaka" }).format(new Date());
  return (
    <html lang="bn">
      <body className="flex min-h-screen flex-col">
        <ToastProvider />
        <Navbar categories={categories} products={products} today={today} />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
