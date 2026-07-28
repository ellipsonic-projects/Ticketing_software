import { Tenant, TenantStatus } from '@prisma/client';

import { CreateTenantInput, ListTenantQuery, UpdateTenantInput } from '@/lib/tenant/tenant.schema';

import { apiClient } from './api-client';

export const tenantApi = {
  getTenants: async (params: ListTenantQuery, token: string) => {
    // filter out undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined),
    );
    const query = new URLSearchParams(cleanParams as Record<string, string>).toString();
    return apiClient<{ data: Tenant[]; pagination: unknown }>(`/platform/tenants?${query}`, {
      token,
    });
  },

  getTenant: async (id: string, token: string) => {
    return apiClient<{ data: Tenant }>(`/platform/tenants/${id}`, { token });
  },

  createTenant: async (data: CreateTenantInput, token: string) => {
    return apiClient<{ data: Tenant }>('/platform/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  },

  updateTenant: async (id: string, data: UpdateTenantInput, token: string) => {
    return apiClient<{ data: Tenant }>(`/platform/tenants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    });
  },

  updateTenantStatus: async (id: string, status: TenantStatus, token: string) => {
    return apiClient<{ data: Tenant }>(`/platform/tenants/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      token,
    });
  },

  deleteTenant: async (id: string, token: string) => {
    return apiClient<{ data: Tenant }>(`/platform/tenants/${id}`, {
      method: 'DELETE',
      token,
    });
  },
};
