import { NextResponse } from 'next/server';

import { ApiErrorDetail, ApiResponse } from '@/types/api';

export class ApiResponder {
  static success<T>(
    data: T,
    message: string = 'Success',
    status: number = 200,
    meta: Record<string, unknown> = {},
  ): NextResponse<ApiResponse<T>> {
    const payload: ApiResponse<T> = {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
    return NextResponse.json(payload, { status });
  }

  static error(
    message: string,
    errors: ApiErrorDetail[] = [],
    status: number = 500,
    meta: Record<string, unknown> = {},
  ): NextResponse<ApiResponse<null>> {
    const payload: ApiResponse<null> = {
      success: false,
      message,
      errors,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
    return NextResponse.json(payload, { status });
  }
}
