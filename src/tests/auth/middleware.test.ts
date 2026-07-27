import { NextRequest } from 'next/server';

import { authenticate } from '@/middleware/authenticate';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authService } from '@/services/auth/auth.service';
import { MissingTokenError } from '@/lib/errors/auth-errors';
import { RequestContext, requestContextStore } from '@/lib/request-context';

vi.mock('@/services/auth/auth.service');

describe('Authenticate Middleware', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should throw MissingTokenError if no auth header', async () => {
    const req = new NextRequest('http://localhost', { headers: {} });
    const handler = authenticate(async () => new Response());

    await expect(handler(req)).rejects.toThrow(MissingTokenError);
  });

  it('should authenticate token and propagate request context', async () => {
    const req = new NextRequest('http://localhost', {
      headers: { authorization: 'Bearer valid-token' },
    });

    const payload = {
      sub: 'user-1',
      tenantId: 'tenant-1',
      role: 'ENGINEER',
      sessionId: 'session-1',
    };

    vi.mocked(authService.authenticate).mockResolvedValue(
      payload as unknown as Awaited<ReturnType<typeof authService.authenticate>>,
    );

    // We need an initial RequestContext simulating `withErrorHandler`
    const initialContext = new RequestContext({ requestId: 'req-1' });

    const handler = authenticate(async () => {
      // Inside handler, context should be populated
      const ctx = requestContextStore.getStore();
      expect(ctx?.identity?.id).toBe('user-1');
      expect(ctx?.tenantId).toBe('tenant-1');
      return new Response('OK');
    });

    await requestContextStore.run(initialContext, async () => {
      const res = await handler(req);
      expect(res.status).toBe(200);
    });

    expect(authService.authenticate).toHaveBeenCalledWith('valid-token');
  });

  it('should reject when request context tenantId mismatches payload tenantId', async () => {
    const req = new NextRequest('http://localhost', {
      headers: { authorization: 'Bearer valid-token' },
    });

    const payload = {
      sub: 'user-1',
      tenantId: 'tenant-1',
      role: 'ENGINEER',
      sessionId: 'session-1',
    };

    vi.mocked(authService.authenticate).mockResolvedValue(
      payload as unknown as Awaited<ReturnType<typeof authService.authenticate>>,
    );

    // Initial context has a different tenantId
    const initialContext = new RequestContext({ requestId: 'req-1', tenantId: 'tenant-999' });

    const handler = authenticate(async () => new Response('OK'));

    await requestContextStore.run(initialContext, async () => {
      // Need to dynamically import to avoid circular dependency in test, or just catch it.
      // We expect InvalidTenantContextError
      await expect(handler(req)).rejects.toThrow('Tenant context mismatch');
    });
  });
});
