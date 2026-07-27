'use client';
export function BackgroundGradient() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/40 to-blue-50/30">
      <div
        className="absolute -top-[20%] -right-[10%] h-[70%] w-[70%] animate-pulse rounded-full bg-gradient-to-br from-blue-300/20 via-indigo-300/15 to-purple-300/12 blur-[160px]"
        style={{ animationDuration: '9s' }}
      />
      <div
        className="absolute top-[30%] -left-[15%] h-[65%] w-[60%] animate-pulse rounded-full bg-gradient-to-tr from-purple-300/18 via-pink-300/12 to-blue-300/10 blur-[140px]"
        style={{ animationDuration: '11s', animationDelay: '2s' }}
      />
      <div
        className="absolute right-[5%] bottom-[0%] h-[50%] w-[50%] animate-pulse rounded-full bg-gradient-to-tl from-cyan-300/14 via-blue-300/10 to-indigo-300/8 blur-[120px]"
        style={{ animationDuration: '13s', animationDelay: '4s' }}
      />
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-white/25 to-white/45" />
    </div>
  );
}
