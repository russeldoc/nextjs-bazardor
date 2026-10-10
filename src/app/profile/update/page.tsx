 "use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
export default function UpdateProfilePage(){
 const {data:session,isPending}=authClient.useSession();const router=useRouter();const [name,setName]=useState("");const [loading,setLoading]=useState(false);
 useEffect(()=>{if(session?.user.name)setName(session.user.name)},[session]);
 useEffect(()=>{if(!isPending&&!session){toast("আগে সাইন ইন করুন");router.replace("/signin")}},[isPending,session,router]);
 async function submit(e:FormEvent){e.preventDefault();if(!name.trim()){toast.error("নাম লিখুন");return}setLoading(true);try{const result=await authClient.updateUser({name:name.trim()});if(result.error)throw new Error(result.error.message||"আপডেট করা যায়নি");toast.success("আপনার তথ্য আপডেট হয়েছে");router.push("/profile")}catch(err){toast.error(err instanceof Error?err.message:"সমস্যা হয়েছে")}finally{setLoading(false)}}
 if(isPending||!session)return <main className="page-content wrap"><div className="skeleton-card"/></main>;
 return <main><section className="page-banner"><div className="wrap"><h1 className="page-title">তথ্য আপডেট করুন</h1><p className="section-subtitle">আপনার প্রোফাইলের নাম পরিবর্তন করুন</p></div></section><section className="page-content wrap"><div className="profile-card"><form onSubmit={submit} className="profile-form"><label>নাম<input required value={name} onChange={e=>setName(e.target.value)} placeholder="আপনার নাম"/></label><button disabled={loading} className="btn btn-primary">{loading?"আপডেট হচ্ছে…":"তথ্য আপডেট করুন"}</button></form></div></section></main>;
}