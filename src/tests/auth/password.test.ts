import { passwordSchema } from '@/validations/password';
import { describe, expect, it } from 'vitest';

import * as passwordHash from '@/lib/auth/password';

describe('Password Security', () => {
  it('should hash and verify a password correctly', async () => {
    const pass = 'SecurePass123!';
    const hash = await passwordHash.hash(pass);

    expect(hash).not.toBe(pass);

    const isValid = await passwordHash.verify(pass, hash);
    expect(isValid).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const pass = 'SecurePass123!';
    const hash = await passwordHash.hash(pass);

    const isValid = await passwordHash.verify('WrongPass123!', hash);
    expect(isValid).toBe(false);
  });
});

describe('Password Policy Validation', () => {
  it('should accept a valid password', () => {
    const result = passwordSchema.safeParse('SecurePass123!');
    expect(result.success).toBe(true);
  });

  it('should reject passwords under 8 characters', () => {
    const result = passwordSchema.safeParse('Sec1!');
    expect(result.success).toBe(false);
  });

  it('should reject passwords without uppercase letters', () => {
    const result = passwordSchema.safeParse('securepass123!');
    expect(result.success).toBe(false);
  });

  it('should reject passwords without special characters', () => {
    const result = passwordSchema.safeParse('SecurePass123');
    expect(result.success).toBe(false);
  });
});
