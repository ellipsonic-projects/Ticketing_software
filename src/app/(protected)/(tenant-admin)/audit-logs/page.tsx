import { Metadata } from 'next';

import { AuditLogsTable } from '@/components/audit-logs/audit-logs-table';

export const metadata: Metadata = {
  title: 'Logs | Tenant Admin | Elipdesk',
  description: 'View tenant logs',
};

export default function TenantAuditLogsPage() {
  return (
    <div className="flex h-full flex-col p-8">
      <div className="min-h-0 flex-1">
        <AuditLogsTable />
      </div>
    </div>
  );
}
