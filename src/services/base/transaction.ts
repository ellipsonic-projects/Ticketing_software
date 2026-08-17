import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

/** Type alias for a Prisma transaction client or the standard client. */
export type DbClient = Prisma.TransactionClient | typeof prisma;

/**
 * Utility for running operations within a Prisma transaction.
 * If an existing transaction is provided, operations run within it;
 * otherwise a new transaction is started.
 */
export async function runInTransaction<T>(
  callback: (tx: DbClient) => Promise<T>,
  existingTx?: DbClient,
): Promise<T> {
  if (existingTx) {
    return callback(existingTx);
  }

  return prisma.$transaction(async (tx) => callback(tx), {
    maxWait: 10_000,
    timeout: 30_000,
  });
}
