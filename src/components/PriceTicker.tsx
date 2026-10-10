import type { Product } from "@/lib/api";
import { formatBdt, formatPercent } from "@/lib/api";
export default function PriceTicker({ products }: { products: Product[] }) {
  const items = products.slice(0, 12);
  if (!items.length) return null;
  return <div className="ticker" aria-label="পণ্যের দাম পরিবর্তন"><div className="ticker-track">
    {[0,1].map(copy => <div className="ticker-group" key={copy} aria-hidden={copy === 1}>
      {items.map(p => <span className="ticker-item" key={`${copy}-${p.id}`}>{p.emoji} {p.name} <b>{formatBdt(p.price)}</b> <i className={p.change > 0 ? "up" : p.change < 0 ? "down" : "flat"}>{p.change > 0 ? "▲" : p.change < 0 ? "▼" : "—"} {formatPercent(p.change)}</i></span>)}
    </div>)}
  </div></div>;
}
