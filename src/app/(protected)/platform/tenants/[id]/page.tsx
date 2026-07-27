import { TenantDetails } from '@/components/tenants/tenant-details';

export default function TenantDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-10 md:px-8">
      <TenantDetails id={params.id} />
    </div>
  );
}
