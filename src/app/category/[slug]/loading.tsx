import SkeletonGrid from "@/components/SkeletonGrid";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 h-14 w-64 animate-pulse rounded-xl bg-gray-200" />
      <SkeletonGrid count={8} />
    </main>
  );
}
