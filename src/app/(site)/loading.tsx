export default function Loading() {
  return (
    <div className="page-shell space-y-6">
      <div className="h-40 animate-pulse rounded-[32px] border border-white/10 bg-white/5" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-56 animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
        <div className="h-56 animate-pulse rounded-[28px] border border-white/10 bg-white/5 lg:col-span-2" />
      </div>
    </div>
  );
}
