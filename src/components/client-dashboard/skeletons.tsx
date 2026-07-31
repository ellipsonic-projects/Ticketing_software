'use client';

// NOTE: This skeleton renders INSIDE the layout's <main> — the real sidebar and
// header remain visible while data loads. Do NOT add a full-page shell here.
export function DashboardSkeleton() {
  return (
    <div className="mx-auto flex max-w-7xl animate-pulse flex-col gap-6">
      {/* Row 1 — Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-32 rounded-3xl border border-slate-200 bg-white" />
        ))}
      </div>

      {/* Row 2 — Tickets + SLA */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="h-80 rounded-3xl border border-slate-200 bg-white xl:col-span-2" />
        <div className="h-80 rounded-3xl border border-slate-200 bg-white" />
      </div>

      {/* Row 3 — Project health + Timeline */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-72 rounded-3xl border border-slate-200 bg-white" />
        <div className="h-72 rounded-3xl border border-slate-200 bg-white" />
      </div>
    </div>
  );
}

