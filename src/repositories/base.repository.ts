import { PrismaClient } from '@prisma/client';

import { prisma } from '@/lib/db';

export type DbClient =
  | PrismaClient
  | Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export interface PrismaDelegate<T, CreateInput, UpdateInput> {
  findUnique(args: { where: { id: string } }): Promise<T | null>;
  create(args: { data: CreateInput }): Promise<T>;
  update(args: { where: { id: string }; data: UpdateInput }): Promise<T>;
  delete(args: { where: { id: string } }): Promise<T>;
  findMany(args?: {
    skip?: number;
    take?: number;
    where?: unknown;
    orderBy?: unknown;
  }): Promise<T[]>;
}

export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  protected abstract getDelegate(db: DbClient): PrismaDelegate<T, CreateInput, UpdateInput>;

  async findById(id: string, db?: DbClient): Promise<T | null> {
    return this.getDelegate(db ?? prisma).findUnique({ where: { id } });
  }

  async create(data: CreateInput, db?: DbClient): Promise<T> {
    return this.getDelegate(db ?? prisma).create({ data });
  }

  async update(id: string, data: UpdateInput, db?: DbClient): Promise<T> {
    return this.getDelegate(db ?? prisma).update({
      where: { id },
      data,
    });
  }

  async delete(id: string, db?: DbClient): Promise<T> {
    // Implement soft delete if needed, or hard delete
    return this.getDelegate(db ?? prisma).delete({ where: { id } });
  }

  async findMany(
    params: { skip?: number; take?: number; where?: unknown; orderBy?: unknown },
    db?: DbClient,
  ): Promise<T[]> {
    return this.getDelegate(db ?? prisma).findMany(params);
  }
}
