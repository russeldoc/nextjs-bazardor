export default function SkeletonGrid({count=8}:{count?:number}) {
  return <div className="product-grid" aria-label="পণ্য লোড হচ্ছে">{Array.from({length:count},(_,i)=><div className="skeleton-card" key={i}><div className="skeleton skeleton-icon"/><div className="skeleton skeleton-line"/><div className="skeleton skeleton-line short"/><div className="skeleton skeleton-line"/></div>)}</div>;
}