import type { Product } from "@/lib/products";
import { pct, toBn, direction } from "@/lib/format";

export default function Ticker({ products }: { products: Product[] }) {
  const items = products.slice(0, 20);
  const group = (copy: number) => (
    <div className="flex shrink-0 items-center" key={copy} aria-hidden={copy === 1}>
      {items.length ? (
        items.map((p) => {
          const d = direction(p.change);
          return (
            <span key={`${copy}-${p.id}`} className="mx-5 inline-flex items-center gap-1.5 whitespace-nowrap text-sm">
              <span>{p.emoji}</span>
              <span className="font-semibold">{p.name}</span>
              <span>{toBn(Math.round(p.price))} টাকা/{p.unit.replace(/^প্রতি\s*/, "")}</span>
              <span className={d === "up" ? "text-green-300" : d === "down" ? "text-red-300" : "text-gray-300"}>
                {d === "up" ? "▲" : d === "down" ? "▼" : "—"} {pct(p.change)}%
              </span>
            </span>
          );
        })
      ) : (
        <span className="mx-5 text-sm">🛒 বাজার দর — আজকের বাজারদর এক নজরে</span>
      )}
    </div>
  );
  return (
    <div className="ticker overflow-hidden bg-leaf-dark py-2 text-white" aria-label="আজকের বাজারদর">
      <div className="ticker-track">{[0, 1].map(group)}</div>
    </div>
  );
}
