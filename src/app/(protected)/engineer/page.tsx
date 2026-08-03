import { Metadata } from 'next';

import { EngineerDashboardTickets } from '@/components/engineer/dashboard/engineer-dashboard-tickets';
import { EngineerDonutChart } from '@/components/engineer/dashboard/engineer-donut-chart';
import { EngineerKpiCards } from '@/components/engineer/dashboard/engineer-kpi-cards';
import { EngineerRecentActivity } from '@/components/engineer/dashboard/engineer-recent-activity';
import { EngineerSlaOverview } from '@/components/engineer/dashboard/engineer-sla-overview';
import { EngineerUpcomingDeadlines } from '@/components/engineer/dashboard/engineer-upcoming-deadlines';

export const metadata: Metadata = {
  title: 'Engineer Dashboard | Elipsonics',
  description: 'View assigned tickets, SLAs, and recent activity.',
};

export default function EngineerDashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
      {/* Top Row: KPIs */}
      <EngineerKpiCards />

      {/* Middle Row: Charts and Deadlines */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <EngineerDonutChart />
        </div>
        <div className="lg:col-span-1">
          <EngineerSlaOverview />
        </div>
        <div className="lg:col-span-1">
          <EngineerUpcomingDeadlines />
        </div>
      </div>

      {/* Bottom Row: Tickets Table & Activity Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EngineerDashboardTickets />
        </div>
        <div className="lg:col-span-1">
          <EngineerRecentActivity />
        </div>
      </div>
    </div>
  );
}
