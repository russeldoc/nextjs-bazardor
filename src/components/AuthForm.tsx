 "use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Github, Chrome, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
export default function AuthForm({mode}:{mode:"signin"|"signup"}) {
  const isSignup=mode==="signup"; const router=useRouter();
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(password.length<8){toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");return;}
    setLoading(true);
    try {
      if(isSignup) {
        const result=await authClient.signUp.email({name,email,password});
        if(result.error) throw new Error(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
        toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।"); router.push("/signin");
      } else {
        const result=await authClient.signIn.email({email,password});
        if(result.error) throw new Error(result.error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়");
        toast.success("স্বাগতম! সফলভাবে সাইন ইন হয়েছে"); router.push("/");
      }
    } catch(err) { toast.error(err instanceof Error ? err.message : "কিছু একটা সমস্যা হয়েছে"); }
    finally { setLoading(false); }
  }
  async function social(provider:"google"|"github") {
    try { await authClient.signIn.social({provider, callbackURL: "/" }); }
    catch { toast.error(`${provider} লগইন চালু করতে OAuth credentials যোগ করুন`); }
  }
  return <div className="auth-card"><div className="auth-heading"><span className="auth-icon">🛒</span><h1>{isSignup?"নতুন অ্যাকাউন্ট তৈরি করুন":"আবার স্বাগতম"}</h1><p>{isSignup?"বাজারদর দেখতে আপনার তথ্য দিন":"আপনার অ্যাকাউন্টে সাইন ইন করুন"}</p></div>
    <form onSubmit={submit} className="auth-form">
      {isSignup&&<label>আপনার নাম<input autoComplete="name" required value={name} onChange={e=>setName(e.target.value)} placeholder="আপনার পূর্ণ নাম"/></label>}
      <label>ইমেইল<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
      <label>পাসওয়ার্ড<input type="password" autoComplete={isSignup?"new-password":"current-password"} minLength={8} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="কমপক্ষে ৮ অক্ষর"/></label>
      <button className="btn btn-primary auth-submit" disabled={loading}>{loading?<LoaderCircle className="spin" size={18}/>:null}{isSignup?"অ্যাকাউন্ট তৈরি করুন":"সাইন ইন"}</button>
    </form>
    <div className="auth-divider"><span>অথবা</span></div>
    <div className="social-row"><button onClick={()=>social("google")} className="btn btn-social" type="button"><Chrome size={18}/> Google</button><button onClick={()=>social("github")} className="btn btn-social" type="button"><Github size={18}/> GitHub</button></div>
    <p className="auth-switch">{isSignup?"আগে থেকেই অ্যাকাউন্ট আছে?":"অ্যাকাউন্ট নেই?"} <Link href={isSignup?"/signin":"/signup"}>{isSignup?"সাইন ইন করুন":"সাইন আপ করুন"}</Link></p>
  </div>;
}