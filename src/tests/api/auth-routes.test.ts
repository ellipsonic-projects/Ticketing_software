import { NextRequest } from 'next/server';

import { User } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { POST as loginRoute } from '@/app/api/v1/auth/login/route';
import { POST as logoutRoute } from '@/app/api/v1/auth/logout/route';
import { authService } from '@/services/auth/auth.service';
import { JwtPayload } from '@/lib/auth/token-types';
import { RequestContext, requestContextStore } from '@/lib/request-context';

vi.mock('@/services/auth/auth.service');
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    set: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  })),
}));

describe('Auth API Routes', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should login and return tokens', async () => {
    vi.mocked(authService.login).mockResolvedValue({
      user: {
        id: 'user-1',
        email: 'test@example.com',
        role: 'ENGINEER',
        password: 'hash',
      } as unknown as User,
      tokens: { accessToken: 'access', refreshToken: 'refresh' },
    });

    const req = new Request('http://localhost/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
    });

    // We simulate RequestContext to satisfy withErrorHandler if needed
    const res = await requestContextStore.run(new RequestContext({ requestId: 'req-1' }), () => {
      return loginRoute(req as unknown as NextRequest);
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.accessToken).toBe('access');
    expect(data.user.email).toBe('test@example.com');
  });

  it('should logout and clear cookies', async () => {
    const req = new Request('http://localhost/api/v1/auth/logout', {
      method: 'POST',
      headers: { authorization: 'Bearer valid-token' },
    });

    vi.mocked(authService.authenticate).mockResolvedValue({
      sub: 'user-1',
      sessionId: 'session-1',
      tenantId: 'tenant-1',
      role: 'ENGINEER',
      tokenType: 'access',
    } as unknown as JwtPayload);

    const res = await requestContextStore.run(new RequestContext({ requestId: 'req-1' }), () => {
      return logoutRoute(req as unknown as NextRequest);
    });

    expect(res.status).toBe(200);
    expect(authService.logout).toHaveBeenCalledWith('session-1');
  });
});
