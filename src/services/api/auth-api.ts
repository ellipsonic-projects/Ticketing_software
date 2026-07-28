import { Role } from '@/lib/auth';

import { apiClient } from './api-client';

// ---------------------------------------------------------------------------
// Request / Response types
// ---------------------------------------------------------------------------

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    tenantId: string;
    mustChangePassword: boolean;
  };
  accessToken: string;
}

// ---------------------------------------------------------------------------
// Auth API methods
// ---------------------------------------------------------------------------

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return apiClient<LoginResponse>('/auth/login', {
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
    // HttpOnly cookie sent automatically — no token payload needed
    return apiClient<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
    });
  },

  me: async (token: string) => {
    return apiClient<{ user: LoginResponse['user'] }>('/auth/me', {
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

  resetPassword: async (data: ResetPasswordPayload) => {
    return apiClient<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  changePassword: async (data: ChangePasswordPayload, token: string) => {
    return apiClient<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  },
};
