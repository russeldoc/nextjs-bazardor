import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";

export const dynamic = "force-dynamic";

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{children}</div>;
}

export default async function HomePage() {
  const products = await getProducts();
  const risers = products.filter((p) => p.change > 0).sort((a, b) => b.change - a.change).slice(0, 6);
  const fallers = products.filter((p) => p.change < 0).sort((a, b) => a.change - b.change).slice(0, 6);

  return (
    <main>
      {/* Hero */}
      <section className="bg-leaf-dark text-white">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-16">
          <div>
            <p className="text-sm font-semibold text-saffron">প্রতিদিনের বাজারদর, এক জায়গায়</p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              বাজারে যাওয়ার আগে দামটা জেনে নিন
            </h1>
            <p className="mt-4 max-w-xl text-white/85">
              চাল, ডাল, মাছ, মাংস ও সবজিসহ নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম এবং কোন পণ্যের দাম বাড়ল বা কমল — সব এক নজরে।
            </p>
            <a href="#সব-পণ্য" className="mt-6 inline-flex items-center gap-2 rounded-full bg-saffron px-6 py-3 font-bold text-ink hover:brightness-95">
              সব পণ্য দেখুন <ArrowDown size={18} />
            </a>
          </div>
          <div className="flex justify-center md:justify-end">
            <Image src="/bazar-hero.png" alt="তাজা বাজারের পণ্য" width={520} height={400} priority className="h-auto w-full max-w-md rounded-2xl object-cover" />
          </div>
        </div>
      </section>

      {/* Section A */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-10">
        <h2 className="text-2xl font-bold">আজ দাম বেড়েছে <span className="text-green-600">▲</span></h2>
        <p className="mb-5 text-sm text-ink/60">যেসব পণ্যের দাম সবচেয়ে বেশি বেড়েছে</p>
        {risers.length ? <Grid>{risers.map((p) => <ProductCard key={p.id} product={p} />)}</Grid> : <p className="rounded-xl bg-white p-6 text-center text-ink/60">আজ দাম বাড়ার তথ্য নেই।</p>}
      </section>

      {/* Section B */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-10">
        <h2 className="text-2xl font-bold">আজ দাম কমেছে <span className="text-red-600">▼</span></h2>
        <p className="mb-5 text-sm text-ink/60">যেসব পণ্যের দাম সবচেয়ে বেশি কমেছে</p>
        {fallers.length ? <Grid>{fallers.map((p) => <ProductCard key={p.id} product={p} />)}</Grid> : <p className="rounded-xl bg-white p-6 text-center text-ink/60">আজ দাম কমার তথ্য নেই।</p>}
      </section>

      {/* Section C */}
      <section id="সব-পণ্য" className="mx-auto w-full max-w-6xl px-4 pt-10">
        <h2 className="text-2xl font-bold">সব পণ্য</h2>
        <p className="mb-5 text-sm text-ink/60">নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম। বিস্তারিত দেখতে যেকোনো পণ্যে ক্লিক করুন।</p>
        {products.length ? (
          <Grid>{products.map((p) => <ProductCard key={p.id} product={p} />)}</Grid>
        ) : (
          <EmptyState emoji="🛒" title="পণ্যের তথ্য লোড করা যায়নি" text="ইন্টারনেট সংযোগ পরীক্ষা করে পেজটি রিলোড করুন।" />
        )}
      </section>
    </main>
  );
}
