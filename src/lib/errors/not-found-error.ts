import { ErrorCode } from '@/constants/error-codes';
import { HttpStatus } from '@/constants/http-status';

import { AppError } from './app-error';

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', options?: { cause?: unknown }) {
    super(message, HttpStatus.NOT_FOUND, 'NOT_FOUND' as ErrorCode, undefined, true, options);
  }
}
