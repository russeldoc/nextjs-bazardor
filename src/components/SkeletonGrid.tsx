export default function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true" aria-label="পণ্য লোড হচ্ছে">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-green-900/10 bg-white p-4">
          <div className="flex justify-between">
            <div className="h-14 w-14 rounded-xl bg-gray-200" />
            <div className="h-6 w-16 rounded-full bg-gray-200" />
          </div>
          <div className="mt-4 h-5 w-3/4 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-1/3 rounded bg-gray-200" />
          <div className="mt-6 h-6 w-full rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
