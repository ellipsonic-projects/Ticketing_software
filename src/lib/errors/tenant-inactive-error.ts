import { ErrorCodes } from '@/constants/error-codes';
import { HttpStatus } from '@/constants/http-status';

import { AppError } from './app-error';

export class TenantInactiveError extends AppError {
  constructor(message: string = 'Tenant is inactive or suspended', options?: ErrorOptions) {
    super(message, HttpStatus.FORBIDDEN, ErrorCodes.TENANT_INACTIVE, undefined, true, options);
  }
}
