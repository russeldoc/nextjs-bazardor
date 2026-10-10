"use client";
import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
export default function Protected({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    authClient.getSession().then((result: any) => {
      if (!alive) return;
      const data = result?.data;
      if (!data?.session) {
        toast.error("এই পেজটি দেখতে আগে সাইন ইন করুন");
        router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
      } else setReady(true);
    }).catch(() => {
      if (alive) router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
    });
    return () => { alive = false; };
  }, [pathname, router]);
  if (!ready) return <main className="container protected-loading"><div className="loader-ring"/><p>আপনার তথ্য যাচাই করা হচ্ছে...</p></main>;
  return <>{children}</>;
}
