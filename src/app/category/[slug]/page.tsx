import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getProducts } from "@/lib/products";
import SortProducts from "@/components/SortProducts";
export const revalidate=300;
export default async function CategoryPage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const [categories,allProducts]=await Promise.all([getCategories(),getProducts()]);
  const category=categories.find(c=>c.slug.toLowerCase()===slug.toLowerCase()||c.id.toLowerCase()===slug.toLowerCase());
  const products=allProducts.filter(p=>p.category.toLowerCase()===slug.toLowerCase()||p.categoryName.toLowerCase()===category?.name.toLowerCase()||p.category.toLowerCase()===category?.name.toLowerCase());
  if(!category && products.length===0) notFound();
  return <main><section className="page-banner"><div className="wrap"><div className="breadcrumbs"><Link href="/">হোম</Link> / {category?.name || slug}</div><h1 className="page-title">{category?.emoji || "🛒"} {category?.name || slug}</h1><p className="section-subtitle">এই ক্যাটাগরির পণ্যের বর্তমান বাজারদর</p></div></section>
    <section className="page-content wrap">{products.length ? <SortProducts products={products}/> : <div className="empty-state"><div className="empty-emoji">📦</div><h2>এই ক্যাটাগরিতে পণ্য নেই</h2><p>অন্য ক্যাটাগরি থেকে পণ্য দেখুন।</p><Link className="btn btn-primary" href="/">হোম পেজে ফিরে যান</Link></div>}</section></main>;
}