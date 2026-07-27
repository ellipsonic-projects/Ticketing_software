/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@/lib/prisma';

export class AuditService {
  static async log(data: {
    entity: string;
    entityId: string;
    action: string;
    actorId?: string;
    before?: any;
    after?: any;
  }) {
    return prisma.auditLog.create({
      data: {
        entity: data.entity,
        entityId: data.entityId,
        action: data.action,
        actorId: data.actorId,
        before: data.before ? JSON.parse(JSON.stringify(data.before)) : null,
        after: data.after ? JSON.parse(JSON.stringify(data.after)) : null,
      },
    });
  }
}
