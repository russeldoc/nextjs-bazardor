"use client";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";

type SortMode = "default" | "asc" | "desc";

export default function SortProducts({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortMode>("default");
  // price is already a number (Bengali digits are parsed in numeric()), so this sorts by value, not text
  const sorted = useMemo(() => {
    if (sort === "asc") return [...products].sort((a, b) => a.price - b.price);
    if (sort === "desc") return [...products].sort((a, b) => b.price - a.price);
    return products;
  }, [products, sort]);

  return (
    <>
      <div className="mb-5 flex items-center justify-end gap-2">
        <label htmlFor="sort" className="text-sm font-semibold">সাজান:</label>
        <div className="relative">
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="appearance-none rounded-full border border-green-900/20 bg-white py-2 pl-4 pr-10 text-sm font-medium focus-visible:outline-2 focus-visible:outline-leaf"
          >
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}
