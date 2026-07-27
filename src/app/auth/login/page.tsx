import { Metadata } from 'next';

import { BackgroundGradient } from '@/components/auth/background-gradient';
import { CompositionBridge } from '@/components/auth/composition-bridge';
import { HeroIllustration } from '@/components/auth/hero-illustration';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Sign In | Elipsonics',
  description: 'Sign in to your Elipsonics account and manage your support operations',
};

export default function LoginPage() {
  return (
    /**
     * Root: overflow-hidden clips anything beyond viewport.
     * The CompositionBridge SVG lives here at z-[6], spanning the full width
     * so its curves bridge illustration → login card as one continuous scene.
     */
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden lg:flex-row">
      {/* Layer 0 — ambient page gradient */}
      <BackgroundGradient />

      {/* Layer 1 — composition bridge: flows from illustration into the card */}
      <CompositionBridge />

      {/* ── LEFT COLUMN — Headline + Illustration ── */}
      {/*
       * overflow-visible lets illustration widgets extend slightly beyond
       * the column boundary, creating natural overlap with the bridge curves.
       * flex-[1.05] gives a hair more space to the illustration side.
       */}
      <div className="z-10 hidden flex-[1.2] flex-col items-center justify-center gap-8 overflow-visible py-12 pr-2 pl-10 lg:flex xl:pr-4 xl:pl-16 2xl:pl-24">
        {/* Marketing headline */}
        <div className="w-full max-w-2xl space-y-4 text-center">
          <h1
            className="leading-[1.15] font-bold tracking-tight text-slate-900"
            style={{
              fontSize: 'clamp(2.5rem, 3.2vw, 3.1rem)',
              fontFamily: 'var(--font-manrope), Manrope, system-ui, sans-serif',
            }}
          >
            Resolve Support Tickets Faster
            <br />
            with <span className="text-blue-600">Elipsonics</span>
          </h1>
          <p className="mx-auto max-w-xl text-[17px] leading-relaxed text-slate-500">
            Join thousands of teams delivering exceptional customer support with
            <br />
            intelligent automation and real-time collaboration.
          </p>
        </div>

        {/* Illustration — overflow-visible so widgets can extend right */}
        <div className="-mt-10 flex min-h-[500px] w-full max-w-4xl flex-1 items-center justify-center overflow-visible">
          <HeroIllustration />
        </div>
      </div>

      {/* ── RIGHT COLUMN — Login Card ──
       *
       * flex-[0.78] is slightly narrower than before, moving the card closer
       * to the illustration. No separator div; the composition bridge takes
       * that role visually.
       *
       * z-[15] keeps the card above the bridge curves (z-[6]) so curves
       * appear to flow *behind* the card — like they lead the eye to it.
       */}
      <div className="relative z-[15] flex min-w-0 flex-col items-center justify-center py-12 pr-6 pl-6 sm:pr-8 sm:pl-8 lg:flex-1 lg:py-10 lg:pr-16 lg:pl-4 xl:pr-24 xl:pl-8 2xl:pr-32">
        {/* Shared-lighting halo: a soft glow that bleeds leftward, tying
            the card into the same light source as the illustration */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-full" aria-hidden="true">
          <div
            className="absolute top-1/2 -left-32 h-[70%] w-64 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(99,102,241,0.09) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
        </div>

        <div className="flex w-full items-center justify-center">
          <LoginForm />
        </div>

        {/* Mobile-only branding */}
        <div className="mt-12 space-y-4 text-center lg:hidden">
          <p className="text-base font-medium text-slate-600">
            Trusted by <span className="font-bold text-slate-900">5,000+</span> support teams
          </p>
          <p className="text-sm text-slate-500">
            Powered by <span className="font-semibold text-slate-700">Elipsonics</span>
          </p>
        </div>
      </div>
    </div>
  );
}
