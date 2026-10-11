import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/products";
import SortProducts from "@/components/SortProducts";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = (await getCategories()).find((c) => c.slug === decodeURIComponent(slug).toLowerCase());
  return { title: cat ? cat.name : "ক্যাটাগরি" };
}

export default async function CategoryPage({ params }: Props) {
  const slug = decodeURIComponent((await params).slug).toLowerCase();
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const category = categories.find((c) => c.slug === slug);
  const items = products.filter((p) => p.category.toLowerCase() === slug);

  if (!category || items.length === 0) {
    return <EmptyState code="404" title="এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি" text="ক্যাটাগরির লিংকটি সঠিক কি না যাচাই করুন, অথবা হোম পেজে ফিরে যান।" />;
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-6 flex items-center gap-3 text-3xl font-extrabold">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-3xl">{category.emoji}</span>
        {category.name}
      </h1>
      <SortProducts products={items} />
    </main>
  );
}
