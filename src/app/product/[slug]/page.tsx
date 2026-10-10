 "use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { getProductBySlug, Product, toBn } from "@/lib/products";
import { ArrowLeft, LoaderCircle } from "lucide-react";
export default function ProductDetailPage() {
  const params=useParams<{slug:string}>(); const router=useRouter();
  const {data:session,isPending}=authClient.useSession();
  const [product,setProduct]=useState<Product|null>(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{if(!isPending&&!session){toast("পণ্যের বিস্তারিত দেখতে সাইন ইন করুন");router.replace(`/signin?next=/product/${params.slug}`)}},[isPending,session,router,params.slug]);
  useEffect(()=>{let alive=true;fetch("/api/products").then(r=>r.json()).then((data:Product[])=>{if(alive)setProduct(data.find(p=>p.slug===params.slug||p.id===params.slug)||null)}).catch(()=>{if(alive)setProduct(null)}).finally(()=>{if(alive)setLoading(false)});return()=>{alive=false}},[params.slug]);
  if(isPending||!session||loading)return <main className="page-content wrap"><div className="skeleton-card"><div className="skeleton skeleton-icon"/><div className="skeleton skeleton-line"/><div className="skeleton skeleton-line short"/></div></main>;
  if(!product)return <main className="not-found"><div className="code">404</div><h1>পণ্যটি খুঁজে পাওয়া যায়নি</h1><p>পণ্যের লিংকটি সঠিক কি না যাচাই করুন।</p><Link className="btn btn-primary" href="/">হোম পেজে ফিরে যান</Link></main>;
  const markets=product.markets?.length?product.markets:[{market:"সামগ্রিক বাজার",price:product.price,unit:product.unit}];
  return <main><section className="page-banner"><div className="wrap"><div className="breadcrumbs"><Link href="/">হোম</Link> / {product.name}</div><Link href="/" className="section-link"><ArrowLeft size={14} style={{display:"inline"}}/> সব পণ্যে ফিরুন</Link></div></section>
    <section className="page-content wrap"><div className="detail-summary"><div className="detail-product"><div className="detail-emoji">{product.emoji}</div><div><h1>{product.name}</h1><p>{product.description}</p><div className="tag-row"><span className="tag">{product.categoryName}</span><span className="tag">{product.unit}</span></div></div></div><div className="detail-current"><span>আজকের গড় দাম</span><strong>{toBn(Math.round(product.price))} টাকা</strong><span className={product.change>0?"up":product.change<0?"down":"flat"}>{product.change>0?"▲":product.change<0?"▼":"—"} {toBn(Math.abs(product.change))}%</span></div></div>
      <div className="summary-grid"><div className="summary-box"><span>সর্বনিম্ন দাম</span><strong>{toBn(Math.round(product.minPrice))} ৳</strong></div><div className="summary-box"><span>সর্বোচ্চ দাম</span><strong>{toBn(Math.round(product.maxPrice))} ৳</strong></div><div className="summary-box"><span>গড় দাম</span><strong>{toBn(Math.round(product.avgPrice))} ৳</strong></div></div>
      <div className="section-head"><div><h2 className="section-title">বাজারভিত্তিক আজকের দাম</h2><p className="section-subtitle">বিভিন্ন বাজারের প্রকাশিত মূল্য তুলনা করুন</p></div></div>
      <div className="market-table-wrap"><table className="market-table"><thead><tr><th>বাজারের নাম</th><th>একক</th><th>আজকের দাম</th></tr></thead><tbody>{markets.map((m,i)=><tr key={`${m.market}-${i}`}><td>{m.market}</td><td>{m.unit}</td><td>{toBn(Math.round(m.price))} টাকা</td></tr>)}</tbody></table></div>
    </section></main>;
}