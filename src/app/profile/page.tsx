 "use client";
import Link from "next/link";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
export default function ProfilePage(){
  const {data:session,isPending}=authClient.useSession();const router=useRouter();
  useEffect(()=>{if(!isPending&&!session){toast("প্রোফাইল দেখতে সাইন ইন করুন");router.replace("/signin")}},[isPending,session,router]);
  if(isPending||!session)return <main className="page-content wrap"><div className="skeleton-card"><div className="skeleton skeleton-line"/></div></main>;
  return <main><section className="page-banner"><div className="wrap"><h1 className="page-title">আমার প্রোফাইল</h1><p className="section-subtitle">আপনার অ্যাকাউন্টের তথ্য</p></div></section><section className="page-content wrap"><div className="profile-card"><div style={{fontSize:44}}>👤</div><h2>{session.user.name}</h2><p className="profile-meta">{session.user.email}</p><Link href="/profile/update" className="btn btn-primary">তথ্য আপডেট করুন</Link></div></section></main>;
}