import { CreateTenantDialog } from '@/components/tenants/create-tenant-dialog';
import { TenantList } from '@/components/tenants/tenant-list';

export default function TenantsPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tenants</h1>
          <p className="mt-1 text-slate-500">
            Manage platform tenants, domains, and configurations.
          </p>
        </div>
        <CreateTenantDialog />
      </div>

      <TenantList />
    </div>
  );
}
