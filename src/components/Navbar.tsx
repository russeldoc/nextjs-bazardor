"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import type { Category, Product } from "@/lib/products";
import Ticker from "./Ticker";

export default function Navbar({ categories, products, today }: { categories: Category[]; products: Product[]; today: string }) {
  const path = decodeURIComponent(usePathname());
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  async function logout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সফলভাবে সাইন আউট হয়েছে");
          router.push("/");
          router.refresh();
        },
      },
    });
  }

  const link = (active: boolean) =>
    `whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition ${
      active ? "bg-leaf text-white" : "text-ink/75 hover:bg-green-100"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-green-900/10 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex flex-col leading-tight" aria-label="বাজার দর হোম">
          <span className="text-xl font-extrabold text-leaf-dark sm:text-2xl">🛒 বাজার দর</span>
          <span className="text-xs text-ink/60">{today}</span>
        </Link>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="h-9 w-28 animate-pulse rounded-full bg-gray-200" />
          ) : session?.user ? (
            <>
              <Link href="/profile" className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-green-100">
                <UserRound size={17} />
                <span className="hidden max-w-28 truncate sm:inline">{session.user.name || "প্রোফাইল"}</span>
              </Link>
              <button onClick={logout} className="flex items-center gap-1.5 rounded-full border border-leaf px-3 py-1.5 text-sm font-semibold text-leaf hover:bg-green-50 sm:px-4">
                <LogOut size={16} /> <span className="hidden sm:inline">সাইন আউট</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" className="rounded-full border border-leaf px-3 py-1.5 text-sm font-semibold text-leaf hover:bg-green-50 sm:px-4">সাইন ইন</Link>
              <Link href="/signup" className="rounded-full bg-leaf px-3 py-1.5 text-sm font-semibold text-white hover:bg-leaf-dark sm:px-4">সাইন আপ</Link>
            </>
          )}
        </div>
      </div>

      <nav className="border-t border-green-900/10" aria-label="ক্যাটাগরি">
        <div className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-4 py-2">
          <Link href="/" className={link(path === "/")}>হোম</Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className={link(path === `/category/${c.slug}`)}>
              {c.emoji} {c.name}
            </Link>
          ))}
        </div>
      </nav>

      <Ticker products={products} />
    </header>
  );
}
