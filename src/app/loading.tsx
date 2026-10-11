import SkeletonGrid from "@/components/SkeletonGrid";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 h-8 w-56 animate-pulse rounded bg-gray-200" />
      <SkeletonGrid count={8} />
    </main>
  );
}
