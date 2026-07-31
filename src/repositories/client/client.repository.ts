import { Client, ClientStatus, Prisma } from '@prisma/client';
import { ClientQuery } from '@/lib/client/client.schema';
import { ClientQueryBuilder } from '@/lib/db/client-query-builder';

import prisma from '@/lib/prisma';
import { DbClient } from '@/services/base/transaction';

export class ClientRepository {
  async create(data: Prisma.ClientUncheckedCreateInput, tx?: DbClient): Promise<Client> {
    const db = tx || prisma;
    return db.client.create({ data });
  }

  async update(id: string, data: Prisma.ClientUncheckedUpdateInput, tx?: DbClient): Promise<Client> {
    const db = tx || prisma;
    return db.client.update({
      where: { id },
      data,
    });
  }

  async findById(id: string, tx?: DbClient): Promise<Client | null> {
    const db = tx || prisma;
    return db.client.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findByName(tenantId: string, name: string, tx?: DbClient): Promise<Client | null> {
    const db = tx || prisma;
    return db.client.findFirst({
      where: { 
        tenantId, 
        name: { equals: name, mode: 'insensitive' }, 
        deletedAt: null 
      },
    });
  }

  async findMany(params: {
    tenantId: string;
    query: ClientQuery;
  }, tx?: DbClient) {
    const db = tx || prisma;
    const queryParams = ClientQueryBuilder.build(params.tenantId, params.query);

    const [clients, total] = await Promise.all([
      db.client.findMany(queryParams),
      db.client.count({ where: queryParams.where }),
    ]);

    return { clients, total };
  }

  async count(where?: Prisma.ClientWhereInput, tx?: DbClient): Promise<number> {
    const db = tx || prisma;
    return db.client.count({ where });
  }

  async archive(id: string, archivedById: string, tx?: DbClient): Promise<Client> {
    const db = tx || prisma;
    
    // We append a timestamp to the name to free up the unique constraint
    // allowing the tenant to recreate a client with the same name later.
    const client = await db.client.findUnique({ where: { id } });
    if (!client) throw new Error('Client not found');

    return db.client.update({
      where: { id },
      data: {
        name: `${client.name}_archived_${Date.now()}`,
        status: ClientStatus.INACTIVE,
        deletedAt: new Date(),
        updatedById: archivedById,
      },
    });
  }
}

export const clientRepository = new ClientRepository();
