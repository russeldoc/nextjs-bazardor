import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";
import Navbar from "@/components/Navbar";
import { getCategories, getProducts } from "@/lib/products";
export const metadata: Metadata = {
  title: "বাজার দর | প্রতিদিনের বাজারদর",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে — বাংলাদেশের বাজারদর জানুন।",
  applicationName: "BazarDor"
};
export default async function RootLayout({children}:{children:React.ReactNode}) {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return <html lang="bn"><body><ToastProvider/><Navbar categories={categories} products={products}/>{children}<footer className="site-footer"><div className="wrap footer-inner"><div><div className="footer-brand">🛒 বাজার দর</div><p>প্রয়োজনীয় পণ্যের দাম এক নজরে।</p></div><p className="footer-note">সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p></div></footer></body></html>;
}