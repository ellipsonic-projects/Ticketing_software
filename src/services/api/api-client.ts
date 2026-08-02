/**
 * Base fetch client wrapper for API communication.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Shape of error JSON responses from the API. */
interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: { message: string }[];
  meta?: { errorCode?: string };
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
      ...(customConfig.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token || globalToken ? { Authorization: `Bearer ${token || globalToken}` } : {}),
      ...headers,
    },
  };

  const response = await fetch(`/api/v1${endpoint}`, config);
  let data: ApiErrorResponse | T;
  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw new ApiError(
        response.status,
        `HTTP Error ${response.status}: Failed to parse server response.`,
      );
    }
    throw new ApiError(500, 'Invalid JSON response from server');
  }

  if (!response.ok) {
    if (
      response.status === 401 &&
      !['/auth/login', '/auth/refresh'].includes(endpoint) &&
      typeof window !== 'undefined'
    ) {
      if (!window.location.pathname.startsWith('/auth/')) {
        window.location.href = '/auth/login';
      }
    }

    const errData = data as ApiErrorResponse;
    const errorMessage =
      errData.message ??
      errData.error ??
      (errData.errors ? JSON.stringify(errData.errors) : 'An error occurred');
    throw new ApiError(response.status, errorMessage, errData.meta?.errorCode);
  }

  return data as T;
}
