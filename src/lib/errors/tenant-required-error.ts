import { ErrorCodes } from '@/constants/error-codes';
import { HttpStatus } from '@/constants/http-status';

import { AppError } from './app-error';

export class TenantRequiredError extends AppError {
  constructor(
    message: string = 'Tenant context is required for this operation',
    options?: ErrorOptions,
  ) {
    super(message, HttpStatus.BAD_REQUEST, ErrorCodes.TENANT_REQUIRED, undefined, true, options);
  }
}
