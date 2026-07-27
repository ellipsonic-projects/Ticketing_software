import { TenantDetails } from '@/components/tenants/tenant-details';

export default async function TenantDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="container mx-auto px-4 py-10 md:px-8">
      <TenantDetails id={id} />
    </div>
  );
}
