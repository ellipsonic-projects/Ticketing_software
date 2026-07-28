import React from 'react';

import { Tenant } from '@prisma/client';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TenantList } from '@/components/tenants/tenant-list';
import { tenantApi, TenantPagination } from '@/services/api/tenant-api';

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ accessToken: 'mock-token' }),
}));

vi.mock('@/services/api/tenant-api', () => ({
  tenantApi: {
    getTenants: vi.fn(),
  },
}));

const mockTenant: Tenant = {
  id: '1',
  name: 'Test Corp',
  slug: 'test-corp',
  status: 'ACTIVE',
  domain: null,
  contactEmail: null,
  contactPhone: null,
  timezone: 'UTC',
  currency: 'USD',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  createdBy: null,
  updatedBy: null,
};

const mockPagination: TenantPagination = {
  total: 1,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

describe('TenantList Component', () => {
  it('should render loading state initially', () => {
    vi.mocked(tenantApi.getTenants).mockReturnValue(new Promise(() => {}));
    const { container } = render(<TenantList />);
    expect(container.querySelector('.animate-spin')).toBeTruthy();
  });

  it('should display tenants after fetch', async () => {
    vi.mocked(tenantApi.getTenants).mockResolvedValue({
      data: [mockTenant],
      pagination: mockPagination,
    });

    render(<TenantList />);

    await waitFor(() => {
      expect(screen.getByText('Test Corp')).toBeTruthy();
    });
  });
});
