export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-[#020704] px-5 py-12 text-slate-100 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl animate-pulse grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="aspect-square rounded-2xl border border-emerald-300/15 bg-emerald-950/40" />
        <div className="space-y-5 rounded-2xl border border-emerald-300/15 bg-[#06130e]/80 p-8">
          <div className="h-3 w-28 rounded bg-emerald-800/70" />
          <div className="h-10 w-3/4 rounded bg-emerald-900/70" />
          <div className="h-4 w-full rounded bg-emerald-950" />
          <div className="h-4 w-5/6 rounded bg-emerald-950" />
          <div className="mt-8 h-8 w-32 rounded bg-emerald-800/70" />
          <div className="mt-10 h-12 w-full rounded-full bg-emerald-800/70" />
        </div>
      </div>
    </main>
  );
}
