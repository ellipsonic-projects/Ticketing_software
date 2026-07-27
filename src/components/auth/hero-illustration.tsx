'use client';

import { AIWidget } from './ai-widget';
import { AnalyticsCard } from './analytics-card';
import { BackgroundCurves } from './background-curves';
import { BackgroundGlow } from './background-glow';
import { CloudIcon } from './cloud-icon';
import { FloatingParticles } from './floating-particles';
import { MetricCard } from './metric-card';
import { NotificationCard } from './notification-card';
import { QuickActionCard } from './quick-action-card';
import { StatusBadge } from './status-badge';
import { SupportTicketCard } from './support-ticket-card';
import { TeamCard } from './team-card';
import { SimulationProvider } from './use-simulation';
import { WorkflowCard } from './workflow-card';

export function HeroIllustration() {
  return (
    <SimulationProvider>
      <div className="relative flex h-full min-h-[600px] w-full items-center justify-center">
        <BackgroundGlow />
        <BackgroundCurves />

        {/* Core workflow in center */}
        <WorkflowCard />

        {/* Top area widgets */}
        <NotificationCard />
        <StatusBadge />

        {/* Left side widgets */}
        <SupportTicketCard />
        <AnalyticsCard />

        {/* Right side widgets */}
        <TeamCard />
        <CloudIcon />
        <QuickActionCard />
        <MetricCard />

        {/* AI widget - prominent */}
        <AIWidget />

        {/* Floating particles for atmosphere */}
        <FloatingParticles />
      </div>
    </SimulationProvider>
  );
}
