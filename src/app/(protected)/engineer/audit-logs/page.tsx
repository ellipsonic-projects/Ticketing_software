import { Metadata } from 'next';
import { AuditLogsTable } from '@/components/audit-logs/audit-logs-table';

export const metadata: Metadata = {
  title: 'Audit Logs | Engineer | Elipdesk',
  description: 'View audit logs for assigned tickets',
};

export default function EngineerAuditLogsPage() {
  return (
    <div className="flex h-full flex-col p-8">
      <div className="flex-1 min-h-0">
        <AuditLogsTable />
      </div>
    </div>
  );
}
