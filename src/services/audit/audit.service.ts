import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

export class AuditService {
  static async log(
    data: {
      entity: string;
      entityId: string;
      action: string;
      actorId?: string;
      tenantId?: string;
      clientId?: string;
      sourceType?: string;
      sourceId?: string;
      before?: unknown;
      after?: unknown;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const db = tx || prisma;
    
    let tenantIdToSave = data.tenantId;
    if (!tenantIdToSave && data.actorId) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const user = await db.user.findUnique({
        where: { id: data.actorId },
        select: { tenantId: true },
      });
      if (user) {
        tenantIdToSave = user.tenantId;
      }
    }

    return db.auditLog.create({
      data: {
        entity: data.entity,
        entityId: data.entityId,
        action: data.action,
        actorId: data.actorId,
        tenantId: tenantIdToSave,
        clientId: data.clientId,
        sourceType: data.sourceType,
        sourceId: data.sourceId,
        before: data.before ? JSON.parse(JSON.stringify(data.before)) : null,
        after: data.after ? JSON.parse(JSON.stringify(data.after)) : null,
      },
    });
  }
}
