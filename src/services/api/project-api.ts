/* eslint-disable */
import { Project } from '@prisma/client';
import { ProjectQuery, CreateProjectInput, UpdateProjectInput } from '@/lib/project/project.schema';
import { ProjectWithClient, ProjectStats } from '@/lib/project/project.types';
import { apiClient } from './api-client';

export const projectApi = {
  getProjects: async (params?: ProjectQuery & { withStats?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.clientId) searchParams.set('clientId', params.clientId);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.order) searchParams.set('order', params.order);
    if (params?.withStats) searchParams.set('withStats', 'true');

    const queryString = searchParams.toString();
    const url = `/projects${queryString ? `?${queryString}` : ''}`;
    
    return apiClient<{ data: ProjectWithClient[]; total: number; pages: number }>(url, {
      method: 'GET',
    });
  },

  getStats: async () => {
    const data = await apiClient<{ stats: ProjectStats }>('/projects/stats', {
      method: 'GET',
    });
    return data.stats;
  },

  getProject: async (id: string) => {
    const data = await apiClient<{ project: ProjectWithClient }>(`/projects/${id}`, {
      method: 'GET',
    });
    return data.project;
  },

  createProject: async (data: CreateProjectInput) => {
    const result = await apiClient<{ project: Project }>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result.project;
  },

  updateProject: async ({ id, data }: { id: string; data: UpdateProjectInput }) => {
    const result = await apiClient<{ project: Project }>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return result.project;
  },

  archiveProject: async (id: string) => {
    const result = await apiClient<{ project: Project }>(`/projects/${id}`, {
      method: 'DELETE',
    });
    return result.project;
  },

  getProjectActivity: async (id: string, page: number, pageSize: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    return apiClient<unknown>(`/projects/${id}/activity?${params.toString()}`, {
      method: 'GET',
    });
  },
};
