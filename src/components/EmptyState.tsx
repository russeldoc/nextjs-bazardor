import Link from "next/link";

export default function EmptyState({
  code, emoji = "🧺", title, text,
}: { code?: string; emoji?: string; title: string; text: string }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center">
      {code ? <div className="text-7xl font-extrabold text-leaf">{code}</div> : <div className="text-6xl">{emoji}</div>}
      <h1 className="mt-4 text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-ink/70">{text}</p>
      <Link href="/" className="mt-6 inline-flex rounded-full bg-leaf px-6 py-3 font-bold text-white hover:bg-leaf-dark">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
