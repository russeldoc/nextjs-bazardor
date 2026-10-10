 "use client";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";
type SortMode = "default" | "asc" | "desc";
export default function SortProducts({products}:{products:Product[]}) {
  const [sort,setSort] = useState<SortMode>("default");
  const sorted = useMemo(()=>sort==="asc" ? [...products].sort((a,b)=>a.price-b.price) : sort==="desc" ? [...products].sort((a,b)=>b.price-a.price) : products,[products,sort]);
  return <><label className="sort-control">সাজান:
    <span className="select-wrap"><select value={sort} onChange={e=>setSort(e.target.value as SortMode)}><option value="default">ডিফল্ট</option><option value="asc">দাম: কম থেকে বেশি</option><option value="desc">দাম: বেশি থেকে কম</option></select><ChevronDown size={16}/></span>
  </label><div className="product-grid">{sorted.map(p=><ProductCard key={p.id} product={p}/>)}</div></>;
}