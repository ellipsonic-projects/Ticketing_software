import crypto from 'crypto';

import { env } from '@/config/env';
import { Role, TenantStatus } from '@prisma/client';

import { emailService } from '@/services/email/email.service';
import { slaService } from '@/services/project/sla.service';
import { tenantRepository } from '@/repositories/tenant/tenant.repository';
import { userRepository } from '@/repositories/user/user.repository';
import { ConflictError } from '@/lib/errors/conflict-error';
import { EmailDeliveryError } from '@/lib/errors/email-error';
import { TenantNotFoundError } from '@/lib/errors/tenant-not-found-error';
import prisma from '@/lib/prisma';
import { CreateTenantInput, UpdateTenantInput } from '@/lib/tenant/tenant.schema';

import { AuditService } from '../audit/audit.service';

/** SHA-256 hash of a raw token string (deterministic, suitable for DB lookup). */
function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/** Resolved application base URL. */
const APP_URL = env.NEXT_PUBLIC_APP_URL;

/** Invitation token TTL in milliseconds (24 hours). */
const INVITATION_TTL_MS = 24 * 60 * 60 * 1000;

/** Narrowing guard for Prisma unique constraint errors. */
interface PrismaConstraintError {
  code: string;
  meta?: { target?: string[] };
}

function isPrismaUniqueConstraintError(err: unknown): err is PrismaConstraintError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as PrismaConstraintError).code === 'P2002'
  );
}

export class TenantService {
  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = this.generateSlug(name);
    let slug = baseSlug;
    let counter = 1;

    while (await tenantRepository.findBySlug(slug)) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    return slug;
  }

  static async validateDomain(domain: string, excludeTenantId?: string): Promise<boolean> {
    const existing = await tenantRepository.findMany({ where: { domain } });
    const tenants = existing[0];
    if (tenants.length === 0) return true;
    if (excludeTenantId && tenants.length === 1 && tenants[0].id === excludeTenantId) return true;
    return false;
  }

  static async createTenant(input: CreateTenantInput, actorId?: string) {
    const slug = await this.generateUniqueSlug(input.name);

    if (input.domain) {
      const isDomainValid = await this.validateDomain(input.domain);
      if (!isDomainValid) throw new ConflictError('Domain is already in use');
    }

    // Pre-check email for better UX
    if (input.admin?.email) {
      const existingUser = await userRepository.findByEmail(input.admin.email);
      if (existingUser) {
        throw new ConflictError('Email address is already in use');
      }
    }

    let emailPayload: { userId: string; tenantId: string; email: string; rawToken: string } | null =
      null;

    const createdTenant = await prisma.$transaction(
      async (tx) => {
        // 1. Create the tenant
        const tenant = await tenantRepository.create(
          {
            name: input.name,
            slug,
            domain: input.domain,
            status: 'PENDING_ACTIVATION',
            contactEmail: input.contactEmail,
            contactPhone: input.contactPhone,
            timezone: input.timezone,
            currency: input.currency,
            createdBy: actorId,
            updatedBy: actorId,
          },
          tx,
        );

        // 2. Audit log for tenant creation
        await AuditService.log(
          {
            entity: 'Tenant',
            entityId: tenant.id,
            action: 'TENANT_ONBOARDING_STARTED',
            actorId,
            tenantId: tenant.id,
            after: tenant,
          },
          tx,
        );

        // 3. Create the first TENANT_ADMIN user
        if (input.admin) {
          // Generate invitation token
          const rawToken = crypto.randomBytes(32).toString('hex');
          const tokenHash = hashToken(rawToken);
          const expiresAt = new Date(Date.now() + INVITATION_TTL_MS);
          const placeholderPassword = crypto.randomBytes(16).toString('hex');

          try {
            const user = await userRepository.create(
              tenant.id,
              {
                firstName: input.admin.firstName,
                lastName: input.admin.lastName,
                email: input.admin.email,
                password: placeholderPassword,
                role: Role.TENANT_ADMIN,
                mustChangePassword: false,
              },
              actorId,
              tx,
            );

            // Manually update status and token fields since repository might not have them yet
            await tx.user.update({
              where: { id: user.id },
              data: {
                status: 'INVITED',
                invitationTokenHash: tokenHash,
                invitationExpiresAt: expiresAt,
                invitedAt: new Date(),
              },
            });

            // Store email details to send AFTER transaction completes
            emailPayload = { userId: user.id, tenantId: tenant.id, email: user.email, rawToken };

            // 4. Record the invitation as pending until email delivery succeeds.
            await AuditService.log(
              {
                entity: 'User',
                entityId: user.id,
                action: 'ADMIN_INVITATION_PENDING',
                actorId,
                tenantId: tenant.id,
                after: {
                  id: user.id,
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  role: Role.TENANT_ADMIN,
                  status: 'INVITED',
                  invitationExpiresAt: expiresAt,
                },
              },
              tx,
            );
          } catch (error: unknown) {
            // Catch Prisma unique constraint violation (P2002) on race conditions
            if (isPrismaUniqueConstraintError(error) && error.meta?.target?.includes('email')) {
              throw new ConflictError('Email address is already in use');
            }
            throw error;
          }
        }

        // 5. Provision Default SLA Policy for the Tenant
        await slaService.provisionDefaultPolicy(tenant.id, actorId || 'SYSTEM', tx);

        return tenant;
      },
      {
        maxWait: 10_000,
        timeout: 30_000,
      },
    );

    // Send email safely outside the transaction to prevent timeout
    if (emailPayload !== null) {
      const { userId, tenantId, email: recipientEmail, rawToken: inviteToken } = emailPayload;
      try {
        await emailService.sendInvitation(recipientEmail, inviteToken, APP_URL);
      } catch (emailError) {
        console.error(
          `[TenantService] Failed to send invitation email to ${recipientEmail}:`,
          emailError,
        );

        // Compensating transaction: delete the tenant (cascades to user) since email failed
        await prisma.tenant.delete({ where: { id: createdTenant.id } });

        throw new EmailDeliveryError('Failed to send invitation email.', { cause: emailError });
      }

      await AuditService.log({
        entity: 'User',
        entityId: userId,
        action: 'ADMIN_INVITATION_SENT',
        actorId,
        tenantId,
        after: { email: recipientEmail, status: 'INVITED' },
      });
    }

    return createdTenant;
  }

  static async updateTenant(id: string, input: UpdateTenantInput, actorId?: string) {
    const existing = await tenantRepository.findById(id);
    if (!existing) throw new TenantNotFoundError();

    if (input.domain && input.domain !== existing.domain) {
      const isDomainValid = await this.validateDomain(input.domain, id);
      if (!isDomainValid) throw new ConflictError('Domain is already in use');
    }

    const tenant = await tenantRepository.update(id, {
      ...input,
      updatedBy: actorId,
    });

    await AuditService.log({
      entity: 'Tenant',
      entityId: tenant.id,
      action: 'TENANT_UPDATED',
      actorId,
      tenantId: tenant.id,
      before: existing,
      after: tenant,
    });

    return tenant;
  }

  static async updateStatus(id: string, status: TenantStatus, actorId?: string) {
    const existing = await tenantRepository.findById(id);
    if (!existing) throw new TenantNotFoundError();

    const tenant = await tenantRepository.updateStatus(id, status, actorId);

    const actionMap: Record<TenantStatus, string> = {
      ACTIVE: 'TENANT_ACTIVATED',
      SUSPENDED: 'TENANT_SUSPENDED',
      INACTIVE: 'TENANT_DEACTIVATED',
      PENDING_ACTIVATION: 'TENANT_PENDING_ACTIVATION',
    };

    await AuditService.log({
      entity: 'Tenant',
      entityId: tenant.id,
      action: actionMap[status],
      actorId,
      tenantId: tenant.id,
      before: existing,
      after: tenant,
    });

    return tenant;
  }

  static async softDeleteTenant(id: string, actorId?: string) {
    const existing = await tenantRepository.findById(id);
    if (!existing) throw new TenantNotFoundError();

    const tenant = await tenantRepository.softDelete(id, actorId);

    await AuditService.log({
      entity: 'Tenant',
      entityId: tenant.id,
      action: 'TENANT_DELETED',
      actorId,
      tenantId: tenant.id,
      before: existing,
      after: tenant,
    });

    return tenant;
  }

  static async getTenants(
    page: number,
    pageSize: number,
    search?: string,
    status?: TenantStatus,
    sort?: string,
    sortOrder?: 'asc' | 'desc',
  ) {
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { domain: { contains: search, mode: 'insensitive' } },
      ];
    }
    where.deletedAt = null;

    const [data, total] = await tenantRepository.findMany({
      skip,
      take: pageSize,
      where: where as Record<string, unknown>,
      orderBy: sort ? { [sort]: sortOrder } : { createdAt: 'desc' },
    });

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  static async getTenantStats() {
    return tenantRepository.getStats();
  }

  static async getTenantById(id: string) {
    const tenant = await tenantRepository.findById(id);
    if (!tenant || tenant.deletedAt) throw new TenantNotFoundError();
    return tenant;
  }
}
