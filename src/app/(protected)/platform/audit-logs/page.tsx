import { Metadata } from 'next';

import { AuditLogsTable } from '@/components/audit-logs/audit-logs-table';

export const metadata: Metadata = {
  title: 'Logs | Platform Admin | Elipdesk',
  description: 'View system-wide logs',
};

export default function PlatformAuditLogsPage() {
  return (
    <div className="flex h-full flex-col p-8">
      <div className="min-h-0 flex-1">
        <AuditLogsTable />
      </div>
    </div>
  );
}
