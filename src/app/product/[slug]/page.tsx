import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProductBySlug } from "@/lib/products";
import { toBn } from "@/lib/format";
import ChangeBadge from "@/components/ChangeBadge";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProductBySlug(decodeURIComponent((await params).slug));
  return { title: p ? p.name : "পণ্য" };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(decodeURIComponent((await params).slug));
  if (!product) notFound();

  const tk = (n: number) => `${toBn(Math.round(n))} টাকা`;
  const markets = product.markets.length
    ? product.markets
    : [{ market: "সামগ্রিক বাজার", division: "—", min: product.price, max: product.price, price: product.price, unit: product.unit }];
  const history = [
    ["গতকাল", product.yesterday],
    ["গত সপ্তাহ", product.lastWeek],
    ["গত মাস", product.lastMonth],
  ].filter(([, v]) => (v as number) > 0);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-leaf hover:underline">
        <ArrowLeft size={15} /> সব পণ্যে ফিরুন
      </Link>

      <section className="mt-4 flex flex-col gap-6 rounded-2xl border border-green-900/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-5xl">{product.emoji}</span>
          <div>
            <h1 className="text-3xl font-extrabold">{product.name}</h1>
            <p className="mt-1 max-w-xl text-ink/70">{product.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <Link href={`/category/${product.category}`} className="rounded-full bg-green-100 px-3 py-1 font-semibold text-leaf-dark hover:bg-green-200">
                {product.categoryEmoji} {product.categoryName}
              </Link>
              <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-800">{product.unit}</span>
            </div>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm text-ink/60">আজকের দাম</p>
          <p className="text-3xl font-extrabold text-leaf-dark">{tk(product.price)}</p>
          <div className="mt-1"><ChangeBadge change={product.change} /></div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-3">
        {[
          ["সর্বনিম্ন দাম", product.minPrice, "text-green-700"],
          ["সর্বোচ্চ দাম", product.maxPrice, "text-red-700"],
          ["গড় দাম", product.avgPrice, "text-ink"],
        ].map(([label, value, color]) => (
          <div key={label as string} className="rounded-2xl border border-green-900/10 bg-white p-5">
            <p className="text-sm text-ink/60">{label as string}</p>
            <p className={`mt-1 text-2xl font-extrabold ${color}`}>{tk(value as number)}</p>
          </div>
        ))}
      </section>

      {history.length > 0 && (
        <section className="mt-4 flex flex-wrap gap-x-8 gap-y-2 rounded-2xl border border-green-900/10 bg-white px-5 py-4 text-sm">
          {history.map(([label, value]) => (
            <p key={label as string}><span className="text-ink/60">{label as string}: </span><strong>{tk(value as number)}</strong></p>
          ))}
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-2xl font-bold">বাজারভিত্তিক আজকের দাম</h2>
        <p className="mb-4 text-sm text-ink/60">{product.unit} — বিভিন্ন বাজারের সর্বনিম্ন ও সর্বোচ্চ দাম</p>
        <div className="overflow-x-auto rounded-2xl border border-green-900/10 bg-white">
          <table className="w-full min-w-[32rem] text-left">
            <thead className="bg-green-50 text-sm">
              <tr>
                <th className="px-4 py-3">বাজারের নাম</th>
                <th className="px-4 py-3">বিভাগ</th>
                <th className="px-4 py-3 text-right">সর্বনিম্ন</th>
                <th className="px-4 py-3 text-right">সর্বোচ্চ</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((m, i) => (
                <tr key={`${m.market}-${i}`} className="border-t border-green-900/10">
                  <td className="px-4 py-3 font-medium">{m.market}</td>
                  <td className="px-4 py-3 text-ink/70">{m.division || "—"}</td>
                  <td className="px-4 py-3 text-right font-bold text-green-700">{tk(m.min)}</td>
                  <td className="px-4 py-3 text-right font-bold text-red-700">{tk(m.max)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
