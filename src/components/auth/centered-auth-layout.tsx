import { ReactNode } from 'react';

export function CenteredAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-muted/30 flex min-h-screen w-full items-center justify-center p-4">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="bg-primary/10 absolute -top-[25%] -left-[10%] h-[50%] w-[50%] rounded-full blur-3xl" />
        <div className="bg-secondary/10 absolute top-[20%] -right-[10%] h-[60%] w-[40%] rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute -bottom-[20%] left-[20%] h-[50%] w-[60%] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full justify-center">{children}</div>
    </div>
  );
}
