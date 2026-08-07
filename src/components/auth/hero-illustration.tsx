'use client';

import { AIWidget } from './ai-widget';
import { AnalyticsCard } from './analytics-card';
import { CloudIcon } from './cloud-icon';
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
      <div className="login-illustration relative flex h-full min-h-[600px] w-full items-center justify-center">
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
      </div>
    </SimulationProvider>
  );
}
