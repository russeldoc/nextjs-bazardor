import Link from "next/link";
import type { Product } from "@/lib/products";
import { toBn } from "@/lib/format";
import ChangeBadge from "./ChangeBadge";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug)}`}
      className="group flex flex-col rounded-2xl border border-green-900/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-leaf hover:shadow-md focus-visible:outline-2 focus-visible:outline-leaf"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-3xl">{product.emoji}</span>
        <ChangeBadge change={product.change} />
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug">{product.name}</h3>
      <p className="text-sm text-ink/60">{product.unit}</p>
      <div className="mt-4 flex items-baseline justify-between border-t border-dashed border-green-900/15 pt-3">
        <span className="text-sm text-ink/60">আজকের দাম</span>
        <strong className="text-xl text-leaf-dark">
          {toBn(Math.round(product.price))} <span className="text-sm font-semibold">টাকা</span>
        </strong>
      </div>
    </Link>
  );
}
