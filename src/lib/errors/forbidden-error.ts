import { ErrorCode } from '@/constants/error-codes';
import { HttpStatus } from '@/constants/http-status';

import { AppError } from './app-error';

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden', options?: { cause?: unknown }) {
    super(message, HttpStatus.FORBIDDEN, 'FORBIDDEN' as ErrorCode, undefined, true, options);
  }
}
