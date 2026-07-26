import { ErrorCodes } from '@/constants/error-codes';
import { HttpStatus } from '@/constants/http-status';

import { AppError } from './app-error';

export class DatabaseError extends AppError {
  constructor(
    message: string = 'Database operation failed',
    isOperational: boolean = true,
    options?: ErrorOptions,
  ) {
    super(
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.DATABASE_ERROR,
      undefined,
      isOperational,
      options,
    );
  }
}
