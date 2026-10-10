 "use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import Logo from "./Logo";
import { authClient } from "@/lib/auth-client";
import type { Category, Product } from "@/lib/products";
export default function Navbar({categories, products}:{categories:Category[];products:Product[]}) {
  const path = usePathname(); const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const movers = [...products].sort((a,b)=>Math.abs(b.change)-Math.abs(a.change)).slice(0,12);
  async function logout() {
    await authClient.signOut({ fetchOptions: { onSuccess: () => { toast.success("সফলভাবে সাইন আউট হয়েছে"); router.push("/"); router.refresh(); } } });
  }
  return <header className="site-header">
    <div className="nav-main wrap"><Logo />
      <div className="nav-actions">
        {session?.user ? <><Link className="profile-link" href="/profile"><UserRound size={17}/><span>{session.user.name || "প্রোফাইল"}</span></Link><button className="btn btn-outline btn-small" onClick={logout}><LogOut size={16}/> সাইন আউট</button></>
          : <><Link className="btn btn-outline btn-small" href="/signin">সাইন ইন</Link><Link className="btn btn-primary btn-small" href="/signup">সাইন আপ</Link></>}
      </div>
    </div>
    <div className="category-nav"><nav className="wrap category-links">
      <Link className={path === "/" ? "active" : ""} href="/">হোম</Link>
      {categories.map(c=><Link key={c.slug} className={path === `/category/${c.slug}` ? "active" : ""} href={`/category/${c.slug}`}>{c.emoji} {c.name}</Link>)}
    </nav></div>
    <div className="ticker" aria-label="আজকের বাজারদর">
      <div className="ticker-track">{[0,1].map(copy=><div className="ticker-group" key={copy}>{movers.length ? movers.map(p=><span className="ticker-item" key={`${copy}-${p.id}`}>{p.emoji} {p.name} <b>{p.price.toLocaleString("bn-BD")} টাকা</b> <small>{p.unit}</small> <em className={p.change > 0 ? "up" : p.change < 0 ? "down" : "flat"}>{p.change > 0 ? "▲" : p.change < 0 ? "▼" : "—"} {Math.abs(p.change).toLocaleString("bn-BD")}%</em></span>) : <span className="ticker-item">🛒 বাজার দর — আজকের বাজারদর দেখুন</span>}</div>)}</div>
    </div>
  </header>;
}