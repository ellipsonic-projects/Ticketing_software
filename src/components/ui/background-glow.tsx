'use client';
export function BackgroundGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute top-[10%] left-[5%] h-[80%] w-[90%] rounded-full bg-indigo-300/12 blur-[120px]" />
      <div className="absolute top-[20%] left-[15%] h-[60%] w-[70%] rounded-full bg-blue-300/10 blur-[100px]" />
    </div>
  );
}
