/* eslint-disable */
import { AuditLog } from '@prisma/client';

import { AuditService } from '@/services/audit/audit.service';
import { userRepository } from '@/repositories/user/user.repository';
import { TimelineEvent, TimelineIcon } from '@/lib/activity/activity.schema';
import prisma from '@/lib/prisma';

export class ActivityTimelineService {
  /**
   * Translates an internal AuditLog action string into a user-friendly title, description, and icon.
   */
  private formatAction(
    action: string,
    before: Record<string, unknown> | null,
    after: Record<string, unknown> | null,
  ): { title: string; description: string; icon: TimelineIcon } {
    switch (action) {
      // Common / General
      case 'CLIENT_CREATED':
        return {
          title: 'Client Created',
          description: 'The client profile was created.',
          icon: 'plus',
        };
      case 'CLIENT_UPDATED':
        return {
          title: 'Client Updated',
          description: 'Client details were modified.',
          icon: 'edit',
        };
      case 'CLIENT_ARCHIVED':
        return {
          title: 'Client Archived',
          description: 'The client was moved to the archive.',
          icon: 'trash',
        };
      case 'PROJECT_CREATED':
        return { title: 'Project Created', description: 'The project was created.', icon: 'plus' };
      case 'PROJECT_UPDATED':
        return {
          title: 'Project Updated',
          description: 'Project details were modified.',
          icon: 'edit',
        };
      case 'PROJECT_ARCHIVED':
        return {
          title: 'Project Archived',
          description: 'The project was moved to the archive.',
          icon: 'trash',
        };

      // SLA / Configuration
      case 'SLA_POLICY_CREATED':
      case 'SLA_POLICY_UPDATED':
        const oldRes = before?.resolutionTimeMinutes
          ? Math.round(Number(before.resolutionTimeMinutes) / 60)
          : null;
        const newRes = after?.resolutionTimeMinutes
          ? Math.round(Number(after.resolutionTimeMinutes) / 60)
          : null;
        const oldResp = before?.responseTimeMinutes;
        const newResp = after?.responseTimeMinutes;

        let desc = 'SLA configuration was updated.';
        if (oldRes !== newRes && oldRes && newRes) {
          desc = `Resolution SLA changed from ${oldRes}h to ${newRes}h.`;
        } else if (oldResp !== newResp && oldResp && newResp) {
          desc = `Response SLA changed from ${oldResp}m to ${newResp}m.`;
        }

        return { title: 'SLA Updated', description: desc, icon: 'clock' };

      case 'BUSINESS_HOURS_UPDATED':
        return {
          title: 'Business Hours Updated',
          description: 'The weekly business hours schedule was modified.',
          icon: 'calendar',
        };

      case 'HOLIDAY_CREATED':
        return {
          title: 'Holiday Added',
          description: `Added holiday: ${after?.name || 'Unknown'}.`,
          icon: 'calendar',
        };
      case 'HOLIDAY_UPDATED':
        return {
          title: 'Holiday Updated',
          description: `Modified holiday: ${after?.name || 'Unknown'}.`,
          icon: 'edit',
        };
      case 'HOLIDAY_DELETED':
        return {
          title: 'Holiday Removed',
          description: `Removed holiday: ${before?.name || 'Unknown'}.`,
          icon: 'trash',
        };

      // Support Status
      case 'SUPPORT_ENABLED':
        return {
          title: 'Support Enabled',
          description: 'Support services were resumed.',
          icon: 'play',
        };
      case 'SUPPORT_PAUSED':
        return {
          title: 'Support Paused',
          description: 'Support services were temporarily paused.',
          icon: 'pause',
        };

      default:
        // Fallback for unknown events
        const titleCase = action
          .replace(/_/g, ' ')
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return { title: titleCase, description: 'An action was performed.', icon: 'check' };
    }
  }

  async getTimelineForEntity(
    tenantId: string,
    entity: string,
    entityId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: TimelineEvent[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: { entity, entityId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({
        where: { entity, entityId },
      }),
    ]);

    // Fetch user details for all unique actorIds
    const actorIds = [...new Set(logs.map((log) => log.actorId).filter(Boolean))] as string[];
    const actors = await prisma.user.findMany({
      where: { id: { in: actorIds }, tenantId },
      select: { id: true, firstName: true, lastName: true },
    });

    const actorMap = new Map(actors.map((a) => [a.id, `${a.firstName} ${a.lastName}`.trim()]));

    const events: TimelineEvent[] = logs.map((log) => {
      const { title, description, icon } = this.formatAction(
        log.action,
        log.before ? JSON.parse(log.before as string) : null,
        log.after ? JSON.parse(log.after as string) : null,
      );

      return {
        id: log.id,
        title,
        description,
        actor: log.actorId ? actorMap.get(log.actorId) || 'Unknown User' : 'System / Unknown',
        occurredAt: log.createdAt,
        icon,
      };
    });

    return {
      data: events,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async getTimelineForEngineer(
    tenantId: string,
    engineerId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: TimelineEvent[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;

    // 1. Get all ticket IDs assigned to this engineer
    const assignedTickets = await prisma.ticket.findMany({
      where: { tenantId, assignedToId: engineerId },
      select: { id: true },
    });
    const ticketIds = assignedTickets.map((t) => t.id);

    if (ticketIds.length === 0) {
      return { data: [], total: 0, pages: 0 };
    }

    // 2. Query AuditLog for these tickets
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: { entity: 'Ticket', entityId: { in: ticketIds } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({
        where: { entity: 'Ticket', entityId: { in: ticketIds } },
      }),
    ]);

    // 3. Fetch actors and format
    const actorIds = [...new Set(logs.map((log) => log.actorId).filter(Boolean))] as string[];
    const actors = await prisma.user.findMany({
      where: { id: { in: actorIds }, tenantId },
      select: { id: true, firstName: true, lastName: true },
    });

    const actorMap = new Map(actors.map((a) => [a.id, `${a.firstName} ${a.lastName}`.trim()]));

    const events: TimelineEvent[] = logs.map((log) => {
      let { title, description, icon } = this.formatAction(
        log.action,
        log.before as Record<string, unknown> | null,
        log.after as Record<string, unknown> | null,
      );

      return {
        id: log.id,
        title,
        description,
        actor: log.actorId ? actorMap.get(log.actorId) || 'Unknown User' : 'System / Unknown',
        occurredAt: log.createdAt,
        icon,
      };
    });

    return {
      data: events,
      total,
      pages: Math.ceil(total / limit),
    };
  }
}

export const activityTimelineService = new ActivityTimelineService();
