/**
 * Base fetch client wrapper
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,
  ) {
    super(message);
  }
}

let globalToken: string | null = null;

export const setGlobalToken = (token: string | null) => {
  globalToken = token;
};

interface FetchOptions extends RequestInit {
  token?: string | null;
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers, ...customConfig } = options;

  const config: RequestInit = {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...(token || globalToken ? { Authorization: `Bearer ${token || globalToken}` } : {}),
      ...headers,
    },
  };

  const response = await fetch(`/api/v1${endpoint}`, config);
  let data: unknown;
  try {
    data = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw new ApiError(
        response.status,
        `HTTP Error ${response.status}: Failed to parse server response.`,
      );
    }
    throw new ApiError(500, 'Invalid JSON response from server');
  }

  if (!response.ok) {
    if (response.status === 401 && endpoint !== '/auth/login' && typeof window !== 'undefined') {
      // Global DRY/KISS handling for unauthorized requests
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    }

    const errorMessage =
      data?.message ||
      data?.error ||
      (data?.errors ? JSON.stringify(data.errors) : 'An error occurred');
    throw new ApiError(response.status, errorMessage, data?.meta?.errorCode);
  }

  return data as T;
}
