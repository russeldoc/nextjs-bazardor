import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUp, ShieldCheck, TrendingUp } from "lucide-react";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
export const revalidate = 300;
export default async function HomePage() {
  const products=await getProducts();
  const risers=products.filter(p=>p.change>0).sort((a,b)=>b.change-a.change).slice(0,6);
  const fallers=products.filter(p=>p.change<0).sort((a,b)=>a.change-b.change).slice(0,6);
  return <main>
    <section className="hero"><div className="wrap hero-inner"><div>
      <span className="eyebrow"><TrendingUp size={15}/> প্রতিদিনের বাজারদর, এক জায়গায়</span>
      <h1>বাজারের সঠিক খবর,<br/><span>সিদ্ধান্ত হোক সহজ।</span></h1>
      <p>চাল, ডাল, মাছ, মাংস থেকে নিত্যপ্রয়োজনীয় সব পণ্যের দাম জানুন এক নজরে। বাজার বুঝে কেনাকাটা করুন আত্মবিশ্বাসের সঙ্গে।</p>
      <a href="#সব-পণ্য" className="btn btn-primary">সব পণ্য দেখুন <ArrowRight size={17}/></a>
      <div className="hero-stats"><div className="hero-stat"><ShieldCheck size={20}/><span><b>সহজ ও স্বচ্ছ</b>বাজারদরের তথ্য</span></div><div className="hero-stat"><TrendingUp size={20}/><span><b>দৈনিক আপডেট</b>দাম ওঠানামার খবর</span></div></div>
    </div><div className="hero-visual"><Image src="/bazar-hero.png" alt="তাজা বাজারের পণ্য" width={390} height={300} priority className="hero-image"/></div></div></section>
    <section className="section"><div className="wrap"><div className="section-head"><div><h2 className="section-title">আজ দাম বেড়েছে <span className="up">▲</span></h2><p className="section-subtitle">যেসব পণ্যের দাম আজ ঊর্ধ্বমুখী</p></div></div>
      {risers.length ? <div className="product-grid">{risers.map(p=><ProductCard key={p.id} product={p}/>)}</div> : <div className="empty-state"><div className="empty-emoji">📈</div><h2>দাম বৃদ্ধির তথ্য পাওয়া যায়নি</h2><p>API-তে মূল্য পরিবর্তনের তথ্য এলে এখানে দেখা যাবে।</p></div>}
    </div></section>
    <section className="section section-muted"><div className="wrap"><div className="section-head"><div><h2 className="section-title">আজ দাম কমেছে <span className="down">▼</span></h2><p className="section-subtitle">কম দামে কেনাকাটার সুযোগ খুঁজে নিন</p></div></div>
      {fallers.length ? <div className="product-grid">{fallers.map(p=><ProductCard key={p.id} product={p}/>)}</div> : <div className="empty-state"><div className="empty-emoji">📉</div><h2>দাম কমার তথ্য পাওয়া যায়নি</h2><p>API-তে মূল্য পরিবর্তনের তথ্য এলে এখানে দেখা যাবে।</p></div>}
    </div></section>
    <section className="section" id="সব-পণ্য"><div className="wrap"><div className="section-head"><div><h2 className="section-title">সব পণ্য</h2><p className="section-subtitle">নিত্যপ্রয়োজনীয় পণ্যের বর্তমান দাম দেখুন। বিস্তারিত জানতে যেকোনো পণ্যে ক্লিক করুন।</p></div><span className="section-link">{products.length.toLocaleString("bn-BD")}টি পণ্য</span></div>
      {products.length ? <div className="product-grid">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div> : <div className="empty-state"><div className="empty-emoji">🛒</div><h2>পণ্যের তথ্য লোড করা যায়নি</h2><p>ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।</p><Link href="/" className="btn btn-primary">আবার চেষ্টা করুন</Link></div>}
    </div></section>
  </main>;
}