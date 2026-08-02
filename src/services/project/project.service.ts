import { Prisma, Project } from '@prisma/client';

import { AuditService } from '@/services/audit/audit.service';
import { DbClient, runInTransaction } from '@/services/base/transaction';
import { clientRepository } from '@/repositories/client/client.repository';
import { ProjectRepository } from '@/repositories/project/project.repository';
import { AppError } from '@/lib/errors/app-error';
import { ConflictError } from '@/lib/errors/conflict-error';
import { NotFoundError } from '@/lib/errors/not-found-error';
import { CreateProjectInput, ProjectQuery, UpdateProjectInput } from '@/lib/project/project.schema';

export class ProjectService {
  /**
   * Create a new project
   */
  async createProject(
    tenantId: string,
    data: CreateProjectInput,
    actorId: string,
    tx?: DbClient,
  ): Promise<Project> {
    return runInTransaction(async (db) => {
      // 1. Validate Client
      const client = await clientRepository.findById(data.clientId, db);
      if (!client || client.tenantId !== tenantId) {
        throw new NotFoundError('Client not found');
      }

      if (client.status !== 'ACTIVE') {
        throw new AppError(
          'Cannot create project for an inactive or pending client',
          400,
          'VALIDATION_ERROR',
        );
      }

      if (client.deletedAt) {
        throw new AppError('Cannot create project for an archived client', 400, 'VALIDATION_ERROR');
      }

      // 2. Prevent Duplicate Project Name under the same client
      const exists = await ProjectRepository.existsByName(tenantId, data.clientId, data.name);
      if (exists) {
        throw new ConflictError('A project with this name already exists for the client.');
      }

      // 3. Create Project
      const project = await ProjectRepository.create({
        tenantId,
        clientId: data.clientId,
        name: data.name,
        code: data.code || null,
        description: data.description || null,
        createdById: actorId,
        updatedById: actorId,
      });

      // 4. Audit Log
      await AuditService.log(
        {
          entity: 'Project',
          entityId: project.id,
          action: 'PROJECT_CREATED',
          actorId,
          after: project,
        },
        db as Prisma.TransactionClient,
      );

      return project;
    }, tx);
  }

  /**
   * Get project details
   */
  async getProjectById(
    tenantId: string,
    id: string,
    actorId: string,
    tx?: DbClient,
  ): Promise<Project> {
    return runInTransaction(async (db) => {
      const project = await ProjectRepository.findById(tenantId, id, true);

      if (!project) {
        throw new NotFoundError('Project not found');
      }

      // 4. Audit Log (Optional but requested)
      await AuditService.log(
        {
          entity: 'Project',
          entityId: project.id,
          action: 'PROJECT_VIEWED',
          actorId,
        },
        db as Prisma.TransactionClient,
      );

      return project;
    }, tx);
  }

  /**
   * Get all projects for a tenant
   */
  async getProjects(tenantId: string, query: ProjectQuery) {
    const result = await ProjectRepository.findMany({
      tenantId,
      query,
    });

    const pages = Math.ceil(result.total / query.limit);
    return { data: result.projects, total: result.total, pages };
  }

  /**
   * Get Dashboard Stats
   */
  async getStats(tenantId: string) {
    return ProjectRepository.getStats(tenantId);
  }

  /**
   * Update a project
   */
  async updateProject(
    tenantId: string,
    id: string,
    data: UpdateProjectInput,
    actorId: string,
    tx?: DbClient,
  ): Promise<Project> {
    return runInTransaction(async (db) => {
      const project = await ProjectRepository.findById(tenantId, id);

      if (!project) {
        throw new NotFoundError('Project not found');
      }

      if (project.archivedAt) {
        throw new AppError('Cannot edit an archived project', 400, 'VALIDATION_ERROR');
      }

      // Check Client Change
      if (data.clientId && data.clientId !== project.clientId) {
        // TODO: In Phase 3, check if project has tickets before allowing client change.
        // For now, we will strictly reject changing client to preserve future integrity.
        throw new AppError(
          'Cannot change the client association of an existing project',
          400,
          'VALIDATION_ERROR',
        );
      }

      // Check Duplicate Name
      if (data.name && data.name !== project.name) {
        const existingProject = await ProjectRepository.findByName(
          tenantId,
          project.clientId,
          data.name,
        );
        if (existingProject && existingProject.id !== id) {
          throw new ConflictError('A project with this name already exists for the client.');
        }
      }

      const updatedProject = await ProjectRepository.update(tenantId, id, {
        name: data.name ?? project.name,
        code: data.code !== undefined ? data.code || null : project.code,
        description:
          data.description !== undefined ? data.description || null : project.description,
        status: data.status ?? project.status,
        supportStatus: data.supportStatus ?? project.supportStatus,
        defaultPriority: data.defaultPriority ?? project.defaultPriority,
        supportEmail:
          data.supportEmail !== undefined ? data.supportEmail || null : project.supportEmail,
        supportPhone:
          data.supportPhone !== undefined ? data.supportPhone || null : project.supportPhone,
        supportNotes:
          data.supportNotes !== undefined ? data.supportNotes || null : project.supportNotes,
        supportStartDate:
          data.supportStartDate !== undefined
            ? data.supportStartDate
              ? new Date(data.supportStartDate)
              : null
            : project.supportStartDate,
        supportEndDate:
          data.supportEndDate !== undefined
            ? data.supportEndDate
              ? new Date(data.supportEndDate)
              : null
            : project.supportEndDate,
        updatedById: actorId,
      });

      await AuditService.log(
        {
          entity: 'Project',
          entityId: project.id,
          action: 'PROJECT_UPDATED',
          actorId,
          before: project,
          after: updatedProject,
        },
        db as Prisma.TransactionClient,
      );

      return updatedProject;
    }, tx);
  }

  /**
   * Archive a project (Soft Delete)
   */
  async archiveProject(
    tenantId: string,
    id: string,
    actorId: string,
    tx?: DbClient,
  ): Promise<Project> {
    return runInTransaction(async (db) => {
      const project = await ProjectRepository.findById(tenantId, id);

      if (!project) {
        throw new NotFoundError('Project not found');
      }

      if (project.archivedAt) {
        throw new AppError('Project is already archived', 400, 'VALIDATION_ERROR');
      }

      const archivedProject = await ProjectRepository.archive(tenantId, id, actorId);

      await AuditService.log(
        {
          entity: 'Project',
          entityId: project.id,
          action: 'PROJECT_ARCHIVED',
          actorId,
          before: project,
          after: archivedProject,
        },
        db as Prisma.TransactionClient,
      );

      return archivedProject;
    }, tx);
  }
}

export const projectService = new ProjectService();
