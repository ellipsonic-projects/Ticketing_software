import { authConfig } from '@/config';
import jwt from 'jsonwebtoken';

import { InvalidTokenError, TokenExpiredError } from '../errors/auth-errors';
import { JwtPayload } from './token-types';

export class JwtService {
  /**
   * Generates a new access token.
   */
  generateAccessToken(payload: Omit<JwtPayload, 'tokenType'>): string {
    return jwt.sign({ ...payload, tokenType: 'access' }, authConfig.jwt.accessSecret as string, {
      expiresIn: authConfig.jwt.accessExpires as unknown as number,
    });
  }

  /**
   * Generates a new refresh token.
   */
  generateRefreshToken(payload: Omit<JwtPayload, 'tokenType'>): string {
    return jwt.sign({ ...payload, tokenType: 'refresh' }, authConfig.jwt.refreshSecret as string, {
      expiresIn: authConfig.jwt.refreshExpires as unknown as number,
    });
  }

  /**
   * Verifies an access token and returns the typed payload.
   * Throws an error if invalid or expired.
   */
  verifyAccessToken(token: string): JwtPayload {
    try {
      const payload = jwt.verify(token, authConfig.jwt.accessSecret as string) as JwtPayload;
      if (payload.tokenType !== 'access') {
        throw new InvalidTokenError('Invalid token type for access token');
      }
      return payload;
    } catch (error: unknown) {
      if (error instanceof InvalidTokenError) throw error;
      if ((error as Error).name === 'TokenExpiredError') {
        throw new TokenExpiredError();
      }
      throw new InvalidTokenError('Invalid token');
    }
  }

  /**
   * Verifies a refresh token and returns the typed payload.
   * Throws an error if invalid or expired.
   */
  verifyRefreshToken(token: string): JwtPayload {
    try {
      const payload = jwt.verify(token, authConfig.jwt.refreshSecret as string) as JwtPayload;
      if (payload.tokenType !== 'refresh') {
        throw new InvalidTokenError('Invalid token type for refresh token');
      }
      return payload;
    } catch (error: unknown) {
      if (error instanceof InvalidTokenError) throw error;
      if ((error as Error).name === 'TokenExpiredError') {
        throw new TokenExpiredError();
      }
      throw new InvalidTokenError('Invalid refresh token');
    }
  }

  /**
   * Decodes a token without verifying the signature.
   * Useful for extracting the sessionId to revoke it before throwing signature errors.
   */
  decodeToken(token: string): JwtPayload | null {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === 'string') return null;
    return decoded as JwtPayload;
  }
}

export const jwtService = new JwtService();
