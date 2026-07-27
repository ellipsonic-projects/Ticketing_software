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

interface FetchOptions extends RequestInit {
  token?: string | null;
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers, ...customConfig } = options;

  const config: RequestInit = {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  const response = await fetch(`/api/v1${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.message || 'An error occurred', data.meta?.errorCode);
  }

  return data as T;
}
