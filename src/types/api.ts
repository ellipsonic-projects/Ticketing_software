export interface ApiMeta {
  timestamp: string;
  [key: string]: unknown;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ApiErrorDetail[];
  meta: ApiMeta;
}
