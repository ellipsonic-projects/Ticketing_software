import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TenantList } from '@/components/tenants/tenant-list';
import { tenantApi } from '@/services/api/tenant-api';

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({ accessToken: 'mock-token' }),
}));

vi.mock('@/services/api/tenant-api', () => ({
  tenantApi: {
    getTenants: vi.fn(),
  },
}));

describe('TenantList Component', () => {
  it('should render loading state initially', () => {
    vi.mocked(tenantApi.getTenants).mockReturnValue(new Promise(() => {}));
    const { container } = render(<TenantList />);
    expect(container.querySelector('.animate-spin')).toBeTruthy();
  });

  it('should display tenants after fetch', async () => {
    vi.mocked(tenantApi.getTenants).mockResolvedValue({
      data: [
        {
          id: '1',
          name: 'Test Corp',
          slug: 'test-corp',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        } as unknown as React.ComponentProps<typeof TenantList>,
      ],
      pagination: { totalPages: 1 },
    });

    render(<TenantList />);

    await waitFor(() => {
      expect(screen.getByText('Test Corp')).toBeTruthy();
      expect(screen.getByText('ACTIVE')).toBeTruthy();
    });
  });
});
