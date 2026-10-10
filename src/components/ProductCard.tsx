import Link from "next/link";
import type { Product } from "@/lib/products";
import { toBn } from "@/lib/products";
export default function ProductCard({product}:{product:Product}) {
  const trend = product.change > 0 ? "up" : product.change < 0 ? "down" : "flat";
  return <Link href={`/product/${product.slug}`} className="product-card">
    <div className="product-card-top"><span className="product-emoji">{product.emoji}</span><span className={`change-badge ${trend}`}>{product.change > 0 ? "▲" : product.change < 0 ? "▼" : "—"} {toBn(Math.abs(product.change))}%</span></div>
    <div className="product-title-row"><h3>{product.name}</h3><span className="category-chip">{product.categoryName}</span></div>
    <p className="unit-text">{product.unit}</p>
    <div className="price-row"><span>আজকের দাম</span><strong>{toBn(Math.round(product.price))} <small>টাকা</small></strong></div>
  </Link>;
}