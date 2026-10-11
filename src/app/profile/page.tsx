"use client";
import { useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) window.location.replace("/signin?next=/profile&auth=required");
  }, [isPending, session]);

  if (isPending || !session) {
    return (
      <main className="mx-auto w-full max-w-xl px-4 py-10">
        <div className="h-56 animate-pulse rounded-2xl bg-gray-200" />
      </main>
    );
  }

  const user = session.user;
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10">
      <div className="rounded-2xl border border-green-900/10 bg-white p-6 text-center shadow-sm sm:p-8">
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="" className="mx-auto h-20 w-20 rounded-full object-cover" />
        ) : (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-leaf text-3xl font-bold text-white">
            {(user.name || user.email).charAt(0).toUpperCase()}
          </div>
        )}
        <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
        <p className="text-ink/60">{user.email}</p>
        <Link href="/profile/update" className="mt-6 inline-flex rounded-full bg-leaf px-6 py-3 font-bold text-white hover:bg-leaf-dark">
          তথ্য আপডেট করুন
        </Link>
      </div>
    </main>
  );
}