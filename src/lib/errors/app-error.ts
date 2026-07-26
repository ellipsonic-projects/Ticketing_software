import { ErrorCode } from '@/constants/error-codes';
import { HttpStatusCode } from '@/constants/http-status';
import { ApiErrorDetail } from '@/types/api';

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly errorCode: ErrorCode;
  public readonly errors?: ApiErrorDetail[];
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: HttpStatusCode,
    errorCode: ErrorCode,
    errors?: ApiErrorDetail[],
    isOperational: boolean = true,
    options?: ErrorOptions,
  ) {
    super(message, options);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}
