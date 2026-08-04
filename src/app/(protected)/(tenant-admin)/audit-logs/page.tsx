import { Metadata } from 'next';
import { AuditLogsTable } from '@/components/audit-logs/audit-logs-table';

export const metadata: Metadata = {
  title: 'Audit Logs | Tenant Admin | Elipdesk',
  description: 'View tenant audit logs',
};

export default function TenantAuditLogsPage() {
  return (
    <div className="flex h-full flex-col p-8">
      <div className="flex-1 min-h-0">
        <AuditLogsTable />
      </div>
    </div>
  );
}
