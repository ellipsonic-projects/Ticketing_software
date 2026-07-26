import { ErrorCodes } from '@/constants/error-codes';
import { HttpStatus } from '@/constants/http-status';
import { Messages } from '@/constants/messages';
import { ApiErrorDetail } from '@/types/api';

import { AppError } from './app-error';

export class ValidationError extends AppError {
  constructor(errors: ApiErrorDetail[], message: string = Messages.VALIDATION_FAILED) {
    super(message, HttpStatus.BAD_REQUEST, ErrorCodes.VALIDATION_ERROR, errors);
  }
}
