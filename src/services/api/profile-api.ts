import { apiClient } from './api-client';

export const profileApi = {
  getProfile: async (token: string) => {
    return apiClient<{ data: unknown }>('/profile', {
      method: 'GET',
      token,
    });
  },

  updateProfile: async (data: { firstName: string; lastName: string }, token: string) => {
    return apiClient<{ message: string; data: unknown }>('/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    });
  },
};
