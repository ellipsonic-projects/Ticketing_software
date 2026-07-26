import { ErrorCodes } from '@/constants/error-codes';
import { HttpStatus } from '@/constants/http-status';

import { AppError } from './app-error';

export class TenantNotFoundError extends AppError {
  constructor(message: string = 'Tenant not found', options?: ErrorOptions) {
    super(message, HttpStatus.NOT_FOUND, ErrorCodes.TENANT_NOT_FOUND, undefined, true, options);
  }
}
