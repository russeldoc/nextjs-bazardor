import Link from "next/link";
export default function Hero() {
  return <section className="hero container">
    <div className="hero-copy"><span className="eyebrow">আপনার প্রতিদিনের বাজারদর</span>
      <h1>বাজারের সঠিক দাম,<br/><span>এক নজরেই জানুন</span></h1>
      <p>চাল, ডাল, মাছ, মাংস ও নিত্যপ্রয়োজনীয় পণ্যের বাজারদর সহজেই দেখুন। সচেতন কেনাকাটা শুরু হোক এখান থেকেই।</p>
      <a href="#সব-পণ্য" className="btn btn-primary">সব পণ্যের দাম দেখুন ↓</a>
      <div className="hero-note">✓ সহজ তথ্য <span>✓ দ্রুত তুলনা</span><span>✓ বাংলা অভিজ্ঞতা</span></div>
    </div>
    <div className="hero-art" aria-label="বাজারের পণ্য"><div className="art-circle"></div><span className="food food-one">🥦</span><span className="food food-two">🍅</span><span className="food food-three">🍚</span><span className="food food-four">🥕</span><span className="food food-five">🧅</span><div className="art-label">আজকের বাজার <b>এক নজরে</b></div></div>
  </section>;
}
