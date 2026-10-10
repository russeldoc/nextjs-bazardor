export default function ProductSkeleton() {
  return <div className="product-grid">{Array.from({length:6},(_,i)=><div className="skeleton-card" key={i}><div className="skeleton-art"/><div className="skeleton-line"/><div className="skeleton-line short"/><div className="skeleton-line"/></div>)}</div>;
}
