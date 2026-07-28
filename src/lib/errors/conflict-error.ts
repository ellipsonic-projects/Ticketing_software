import { HttpStatus } from '@/constants/http-status';

import { AppError } from './app-error';

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists', options?: { cause?: unknown }) {
    super(message, HttpStatus.CONFLICT, 'CONFLICT', undefined, true, options);
  }
}
