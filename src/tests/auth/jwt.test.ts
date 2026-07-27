import jwt from 'jsonwebtoken';
import { describe, expect, it, vi } from 'vitest';

import { jwtService } from '@/lib/auth/jwt';

vi.mock('@/config', () => ({
  authConfig: {
    jwt: {
      accessSecret: 'test-access-secret',
      refreshSecret: 'test-refresh-secret',
      accessExpires: '15m',
      refreshExpires: '7d',
    },
  },
}));

describe('JWT Service', () => {
  const payload = {
    sub: 'user-123',
    tenantId: 'tenant-123',
    sessionId: 'session-123',
    role: 'ENGINEER' as const,
  };

  it('should generate and verify an access token', () => {
    const token = jwtService.generateAccessToken(payload);
    const decoded = jwtService.verifyAccessToken(token);

    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.tokenType).toBe('access');
  });

  it('should generate and verify a refresh token', () => {
    const token = jwtService.generateRefreshToken(payload);
    const decoded = jwtService.verifyRefreshToken(token);

    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.tokenType).toBe('refresh');
  });

  it('should reject an access token if verified as refresh token', () => {
    const token = jwt.sign(
      { ...payload, tokenType: 'access' },
      'test-refresh-secret', // using refresh secret so signature passes
      { expiresIn: '15m' },
    );
    expect(() => jwtService.verifyRefreshToken(token)).toThrow(
      'Invalid token type for refresh token',
    );
  });

  it('should reject a refresh token if verified as access token', () => {
    const token = jwt.sign(
      { ...payload, tokenType: 'refresh' },
      'test-access-secret', // using access secret so signature passes
      { expiresIn: '7d' },
    );
    expect(() => jwtService.verifyAccessToken(token)).toThrow(
      'Invalid token type for access token',
    );
  });

  it('should reject an expired token', () => {
    const expiredToken = jwt.sign({ ...payload, tokenType: 'access' }, 'test-access-secret', {
      expiresIn: '-1s',
    });

    expect(() => jwtService.verifyAccessToken(expiredToken)).toThrow(/jwt expired/);
  });

  it('should decode a token without verifying', () => {
    const token = jwtService.generateAccessToken(payload);
    const decoded = jwtService.decodeToken(token);
    expect(decoded?.sessionId).toBe(payload.sessionId);
  });
});
