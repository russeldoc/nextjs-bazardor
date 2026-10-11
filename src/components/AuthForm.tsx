"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";


// Newer lucide-react versions removed brand icons, so these are inline SVGs.
function GoogleIcon() {
  return <span aria-hidden="true" className="flex h-[18px] w-[18px] items-center justify-center text-base font-extrabold leading-none">G</span>;
}
function GithubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function safeNext(v: string | null) {
  return v && v.startsWith("/") && !v.startsWith("//") ? v : "/";
}

const input =
  "mt-1 w-full rounded-xl border border-green-900/20 bg-white px-4 py-2.5 focus-visible:outline-2 focus-visible:outline-leaf";

export default function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const isSignup = mode === "signup";
  const sp = useSearchParams();
  const next = safeNext(sp.get("next"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sp.get("auth") === "required") toast.error("এই পেজ দেখতে আগে সাইন ইন করুন", { id: "auth-required" });
  }, [sp]);

  function fail(message: string) {
    setError(message);
    toast.error(message);
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (isSignup && !name.trim()) return fail("আপনার নাম লিখুন");
    if (!/^\S+@\S+\.\S+$/.test(email)) return fail("সঠিক ইমেইল দিন");
    if (password.length < 8) return fail("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    setLoading(true);
    let navigating = false;
    try {
      if (isSignup) {
        const res = await authClient.signUp.email({ name: name.trim(), email, password });
        if (res.error) throw new Error(res.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
        // sign-up may auto sign-in; the requirement says go to the login page
        await authClient.signOut();
        navigating = true;
        sessionStorage.setItem("flash", "অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।");
        window.location.assign(next === "/" ? "/signin" : `/signin?next=${encodeURIComponent(next)}`);
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) throw new Error(res.error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়");
        navigating = true; // keep the spinner until the browser leaves this page
        sessionStorage.setItem("flash", "স্বাগতম! সফলভাবে সাইন ইন হয়েছে");
        window.location.assign(next); // full page load: always works, fresh session + data
      }
    } catch (err) {
      fail(err instanceof Error ? err.message : "কিছু একটা সমস্যা হয়েছে");
    } finally {
      if (!navigating) setLoading(false);
    }
  }

  async function social(provider: "google" | "github") {
    try {
      const res = await authClient.signIn.social({ provider, callbackURL: next });
      if (res?.error) fail(res.error.message || "সোশ্যাল লগইন করা যায়নি");
    } catch {
      fail("সোশ্যাল লগইন চালু করতে OAuth credentials যোগ করুন");
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-green-900/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="text-center">
        <div className="text-4xl">🛒</div>
        <h1 className="mt-2 text-2xl font-bold">{isSignup ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন করুন"}</h1>
        <p className="mt-1 text-sm text-ink/60">{isSignup ? "বাজারদর দেখতে আপনার তথ্য দিন" : "আপনার অ্যাকাউন্টে প্রবেশ করুন"}</p>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        {isSignup && (
          <label className="block text-sm font-semibold">
            নাম
            <input className={input} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="আপনার পূর্ণ নাম" />
          </label>
        )}
        <label className="block text-sm font-semibold">
          ইমেইল
          <input className={input} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label className="block text-sm font-semibold">
          পাসওয়ার্ড
          <input className={input} type="password" autoComplete={isSignup ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="কমপক্ষে ৮ অক্ষর" />
        </label>
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
            {!isSignup && (
              <> — অ্যাকাউন্ট না থাকলে <Link href="/signup" className="font-bold underline">সাইন আপ করুন</Link></>
            )}
          </p>
        )}
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-leaf py-3 font-bold text-white hover:bg-leaf-dark disabled:opacity-60">
          {loading && <LoaderCircle size={18} className="animate-spin" />}
          {isSignup ? "রেজিস্টার করুন" : "লগইন করুন"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-ink/50">
        <span className="h-px flex-1 bg-green-900/15" /> অথবা <span className="h-px flex-1 bg-green-900/15" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => social("google")} className="flex items-center justify-center gap-2 rounded-full border border-green-900/20 py-2.5 text-sm font-semibold hover:bg-green-50">
          <GoogleIcon /> Google
        </button>
        <button type="button" onClick={() => social("github")} className="flex items-center justify-center gap-2 rounded-full border border-green-900/20 py-2.5 text-sm font-semibold hover:bg-green-50">
          <GithubIcon /> GitHub
        </button>
      </div>

      <p className="mt-6 text-center text-sm">
        {isSignup ? "আগে থেকেই অ্যাকাউন্ট আছে?" : "অ্যাকাউন্ট নেই?"}{" "}
        <Link className="font-bold text-leaf underline" href={isSignup ? "/signin" : "/signup"}>
          {isSignup ? "সাইন ইন করুন" : "সাইন আপ করুন"}
        </Link>
      </p>
    </div>
  );
}
