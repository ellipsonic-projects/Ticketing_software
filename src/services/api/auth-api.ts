import { apiClient } from './api-client';

export const authApi = {
  login: async (credentials: Record<string, unknown>) => {
    return apiClient<{ user: unknown; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: async (token: string) => {
    return apiClient<{ success: boolean }>('/auth/logout', {
      method: 'POST',
      token,
    });
  },

  refresh: async () => {
    // Requires no token in payload as HttpOnly cookie will be sent automatically
    return apiClient<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
    });
  },

  me: async (token: string) => {
    return apiClient<{ user: unknown }>('/auth/me', {
      method: 'GET',
      token,
    });
  },

  forgotPassword: async (email: string) => {
    return apiClient<{ success: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (data: Record<string, unknown>) => {
    return apiClient<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  changePassword: async (data: Record<string, unknown>, token: string) => {
    return apiClient<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  },
};
