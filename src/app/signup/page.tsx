import { Suspense } from "react";
import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = { title: "সাইন আপ" };

export default function SignUpPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl justify-center px-4 py-10">
      <Suspense fallback={<div className="h-[28rem] w-full max-w-md animate-pulse rounded-2xl bg-gray-200" />}>
        <AuthForm mode="signup" />
      </Suspense>
    </main>
  );
}
