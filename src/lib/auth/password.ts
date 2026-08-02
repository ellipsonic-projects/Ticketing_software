import * as argon2 from 'argon2';

const ARGON2_OPTIONS = {
  type: 2 as const,
  memoryCost: 2 ** 16, // 64 MB
  timeCost: 3,
  parallelism: 1,
};

export async function hash(password: string): Promise<string> {
  return argon2.hash(password, ARGON2_OPTIONS);
}

export async function verify(password: string, hash: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch (error) {
    console.error('Argon2 verify error:', error);
    return false;
  }
}
