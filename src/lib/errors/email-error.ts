import { HttpStatus } from '@/constants/http-status';

import { AppError } from './app-error';

export class EmailDeliveryError extends AppError {
  constructor(message: string = 'Failed to deliver email', options?: { cause?: unknown }) {
    super(message, HttpStatus.BAD_REQUEST, 'EMAIL_DELIVERY_FAILED', undefined, true, options);
  }
}
