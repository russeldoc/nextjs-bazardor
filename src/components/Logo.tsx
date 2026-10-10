import Image from "next/image";
export default function Logo() {
  return <a href="/" className="brand" aria-label="বাজার দর হোম">
    <Image src="/logo-icon.png" alt="" width={48} height={48} className="brand-icon" priority />
    <span><strong>বাজার দর</strong><small>{new Intl.DateTimeFormat("bn-BD", { dateStyle: "full" }).format(new Date())}</small></span>
  </a>;
}