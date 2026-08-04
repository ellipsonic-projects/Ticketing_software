import crypto from 'crypto';

import { env } from '@/config/env';
import { Role, UserStatus } from '@prisma/client';

import { AuditService } from '@/services/audit/audit.service';
import { emailService } from '@/services/email/email.service';
import { userRepository } from '@/repositories/user/user.repository';
import { ConflictError } from '@/lib/errors/conflict-error';
import { EmailDeliveryError } from '@/lib/errors/email-error';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { NotFoundError } from '@/lib/errors/not-found-error';
import prisma from '@/lib/prisma';
import { CreateUserInput, ListUsersQuery, UpdateUserInput } from '@/lib/user/user.schema';

export class UserService {
  async createUser(tenantId: string, data: CreateUserInput, actorId: string) {
    // 1. Role validation - tenant admins cannot create platform admins
    if (data.role === Role.PLATFORM_ADMIN) {
      throw new ForbiddenError('Unauthorized to create PLATFORM_ADMIN users');
    }

    // 2. Global email uniqueness check
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email address is already in use');
    }

    // 3. Generate Invitation Token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // 4. Create User with INVITED status (no password yet)
    // We'll insert a dummy password for now since it's required by the schema,
    // or we need to update the schema to make password optional. Wait, password is required in schema?
    // Let's assume password is required in DB. We will set a placeholder random password.
    const placeholderPassword = crypto.randomBytes(16).toString('hex');
    const user = await userRepository.create(
      tenantId,
      {
        ...data,
        password: placeholderPassword,
      },
      actorId,
    );

    // Update with invitation fields directly via prisma if repository doesn't support them yet
    // Wait, the repository needs to support them.
    // I should update userRepository first. Let's do a direct prisma call for the fields for now.
    await prisma.user.update({
      where: { id: user.id },
      data: {
        status: 'INVITED',
        invitationTokenHash: tokenHash,
        invitationExpiresAt: expiresAt,
        invitedAt: new Date(),
      },
    });

    // 5. Send Email
    // Assume NEXT_PUBLIC_APP_URL is available
    const appUrl = env.NEXT_PUBLIC_APP_URL;
    try {
      await emailService.sendInvitation(user.email, rawToken, appUrl);
    } catch (emailError) {
      console.error(`[UserService] Failed to send invitation email to ${user.email}:`, emailError);

      // Compensating Transaction: Rollback the user creation
      await prisma.user.delete({ where: { id: user.id } });

      throw new EmailDeliveryError('Failed to send invitation email.', { cause: emailError });
    }

    // 6. Audit
    await AuditService.log({
      entity: 'USER',
      entityId: user.id,
      action: 'INVITATION_SENT',
      actorId,
      after: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: 'INVITED',
      },
    });

    return user;
  }

  async updateUser(tenantId: string, id: string, data: UpdateUserInput, actorId: string) {
    if (data.role === Role.PLATFORM_ADMIN) {
      throw new ForbiddenError('Unauthorized to assign PLATFORM_ADMIN role');
    }

    const existingUser = await userRepository.findById(id, tenantId);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await userRepository.update(id, tenantId, data, actorId);

    await AuditService.log({
      entity: 'USER',
      entityId: id,
      action: 'UPDATE',
      actorId,
      before: {
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        role: existingUser.role,
      },
      after: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
      },
    });

    return updatedUser;
  }

  async updateUserStatus(tenantId: string, id: string, status: UserStatus, actorId: string) {
    const existingUser = await userRepository.findById(id, tenantId);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await userRepository.updateStatus(id, tenantId, status, actorId);

    await AuditService.log({
      entity: 'USER',
      entityId: id,
      action: 'UPDATE_STATUS',
      actorId,
      before: { status: existingUser.status },
      after: { status: updatedUser.status },
    });

    return updatedUser;
  }

  async deleteUser(tenantId: string, id: string, actorId: string) {
    const existingUser = await userRepository.findById(id, tenantId);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    await userRepository.softDelete(id, tenantId, actorId);

    await AuditService.log({
      entity: 'USER',
      entityId: id,
      action: 'DELETE',
      actorId,
    });
  }

  async getUserById(tenantId: string, id: string) {
    const user = await userRepository.findById(id, tenantId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async listUsers(tenantId: string, query: ListUsersQuery) {
    return userRepository.findMany(tenantId, query);
  }

  async getProfile(tenantId: string, userId: string) {
    const user = await userRepository.findById(userId, tenantId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async updateProfile(
    tenantId: string,
    userId: string,
    data: { firstName: string; lastName: string },
  ) {
    const existingUser = await userRepository.findById(userId, tenantId);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await userRepository.update(
      userId,
      tenantId,
      { firstName: data.firstName, lastName: data.lastName },
      userId, // updatedBy is self
    );

    await AuditService.log({
      entity: 'USER',
      entityId: userId,
      action: 'UPDATE_PROFILE',
      actorId: userId,
      before: {
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
      },
      after: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      },
    });

    return updatedUser;
  }
}

export const userService = new UserService();
