import { apiClient } from './api-client';

export interface ProfileUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
}

export const profileApi = {
  getProfile: async (token: string) => {
    return apiClient<{ data: ProfileUser }>('/profile', {
      method: 'GET',
      token,
    });
  },

  updateProfile: async (data: { firstName: string; lastName: string }, token: string) => {
    return apiClient<{ message: string; data: ProfileUser }>('/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    });
  },
};
