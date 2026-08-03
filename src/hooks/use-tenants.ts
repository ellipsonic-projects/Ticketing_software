import { TenantStatus } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { tenantApi } from '@/services/api/tenant-api';
import { ListTenantQuery } from '@/lib/tenant/tenant.schema';

export function useTenants(params: ListTenantQuery, token: string) {
  return useQuery({
    queryKey: ['tenants', params],
    queryFn: () => tenantApi.getTenants(params, token),
    enabled: !!token,
  });
}

export function useTenantStats(token: string) {
  return useQuery({
    queryKey: ['tenants', 'stats'],
    queryFn: () => tenantApi.getTenantStats(token),
    enabled: !!token,
  });
}

export function useDeleteTenant(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tenantApi.deleteTenant(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}

export function useUpdateTenantStatus(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TenantStatus }) =>
      tenantApi.updateTenantStatus(id, status, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}
