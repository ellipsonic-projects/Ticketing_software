import { Metadata } from 'next';

import { EngineerDonutChart } from '@/components/engineer/dashboard/engineer-donut-chart';
import { EngineerKpiCards } from '@/components/engineer/dashboard/engineer-kpi-cards';
import { EngineerSlaOverview } from '@/components/engineer/dashboard/engineer-sla-overview';

export const metadata: Metadata = {
  title: 'Engineer Dashboard | Elipdesk',
  description: 'View assigned tickets and SLAs.',
};

export default function EngineerDashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
      {/* Top Row: KPIs */}
      <EngineerKpiCards />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="min-w-0">
          <EngineerDonutChart />
        </div>
        <div className="min-w-0">
          <EngineerSlaOverview />
        </div>
      </div>
    </div>
  );
}
