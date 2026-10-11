"use client";
import { FormEvent, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const currentName = session?.user?.name;

  useEffect(() => {
    if (!isPending && !session) window.location.replace("/signin?next=/profile/update&auth=required");
  }, [isPending, session]);

  useEffect(() => {
    if (currentName) setName(currentName);
  }, [currentName]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return void toast.error("নাম খালি রাখা যাবে না");
    setLoading(true);
    const { error } = await authClient.updateUser({ name: name.trim() });
    if (error) {
      setLoading(false);
      return void toast.error(error.message || "তথ্য আপডেট করা যায়নি");
    }
    sessionStorage.setItem("flash", "নাম আপডেট হয়েছে");
    window.location.assign("/profile");
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <div className="rounded-2xl border border-green-900/10 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold">তথ্য আপডেট করুন</h1>
        {isPending || !session ? (
          <div className="mt-6 h-24 animate-pulse rounded-xl bg-gray-200" />
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold">
              নাম
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="mt-1 w-full rounded-xl border border-green-900/20 px-4 py-2.5 focus-visible:outline-2 focus-visible:outline-leaf"
              />
            </label>
            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-leaf py-3 font-bold text-white hover:bg-leaf-dark disabled:opacity-60">
              {loading && <LoaderCircle size={18} className="animate-spin" />} তথ্য আপডেট করুন
            </button>
          </form>
        )}
      </div>
    </main>
  );
}