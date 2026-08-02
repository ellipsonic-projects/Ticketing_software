/* eslint-disable */
import { Client, Project } from '@prisma/client';

import {
  ClientQuery,
  CreateClientInput,
  OnboardClientInput,
  UpdateClientInput,
} from '@/lib/client/client.schema';

import { apiClient } from './api-client';

export const clientApi = {
  createClient: (data: CreateClientInput, token: string) =>
    apiClient<{ client: Client }>('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  onboardClient: (data: OnboardClientInput, token: string) =>
    apiClient<{ client: Client; project: Project }>('/client-onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  getClients: (query: ClientQuery, token: string) => {
    const searchParams = new URLSearchParams(
      Object.entries(query)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)]),
    );
    return apiClient<{ data: Client[]; total: number; pages: number }>(`/clients?${searchParams}`, {
      method: 'GET',
      token,
    });
  },

  getClient: (id: string, token: string) =>
    apiClient<{ client: Client }>(`/clients/${id}`, { method: 'GET', token }),

  updateClient: (id: string, data: UpdateClientInput, token: string) =>
    apiClient<{ client: Client }>(`/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    }),

  getClientStats: (id: string, token: string) =>
    apiClient<{
      totalProjects: number;
      totalTickets: number;
      engineersCount: number;
      slaHealthPercent: number;
      avgResolutionTimeMinutes: number;
      lastActivity: string;
    }>(`/clients/${id}/stats`, { method: 'GET', token }),

  deleteClient: (id: string, token: string) =>
    apiClient<{ message: string }>(`/clients/${id}`, { method: 'DELETE', token }),

  getClientActivity: (id: string, page: number, pageSize: number, token: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    return apiClient<{ data: any[]; total: number; pages: number }>(
      `/clients/${id}/activity?${params.toString()}`,
      {
        method: 'GET',
        token,
      },
    );
  },
};
