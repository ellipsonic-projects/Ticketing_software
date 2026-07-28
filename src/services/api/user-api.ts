import { User, UserStatus } from '@prisma/client';

import { CreateUserInput, ListUsersInput, UpdateUserInput } from '@/lib/user/user.schema';

import { apiClient } from './api-client';

export const userApi = {
  getUsers: async (query?: ListUsersInput, token?: string) => {
    const cleanParams = Object.fromEntries(
      Object.entries(query || {}).filter(([_, v]) => v !== undefined),
    );
    const qs = new URLSearchParams(cleanParams as Record<string, string>).toString();
    const endpoint = qs ? `/users?${qs}` : '/users';

    return apiClient<{
      data: User[];
      meta: { total: number; page: number; pageSize: number; totalPages: number };
    }>(endpoint, { token });
  },

  getUser: async (id: string, token?: string) => {
    return apiClient<{ data: User }>(`/users/${id}`, { token });
  },

  createUser: async (data: CreateUserInput, token?: string) => {
    return apiClient<{ message: string; data: User }>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  },

  updateUser: async (id: string, data: UpdateUserInput, token?: string) => {
    return apiClient<{ message: string; data: User }>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    });
  },

  updateUserStatus: async (id: string, status: UserStatus, token?: string) => {
    return apiClient<{ message: string; data: User }>(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      token,
    });
  },

  deleteUser: async (id: string, token?: string) => {
    return apiClient<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
      token,
    });
  },
};
