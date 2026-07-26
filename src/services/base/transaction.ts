import { DbClient } from '@/repositories/base.repository';
import { prisma } from '@/lib/db';

/**
 * Utility for running operations within a transaction.
 */
export async function runInTransaction<T>(
  callback: (tx: DbClient) => Promise<T>,
  existingTx?: DbClient,
): Promise<T> {
  if (existingTx) {
    return callback(existingTx);
  }

  return prisma.$transaction(async (tx) => {
    return callback(tx);
  });
}
