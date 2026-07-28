import { HttpStatus } from '@/constants/http-status';

import { AppError } from './app-error';

// Add new error codes to error-codes.ts later

export class InvalidCredentialsError extends AppError {
  constructor(message: string = 'Invalid credentials provided', options?: { cause?: unknown }) {
    super(message, HttpStatus.UNAUTHORIZED, 'INVALID_CREDENTIALS', undefined, true, options);
  }
}

export class SessionExpiredError extends AppError {
  constructor(message: string = 'Session has expired', options?: { cause?: unknown }) {
    super(message, HttpStatus.UNAUTHORIZED, 'SESSION_EXPIRED', undefined, true, options);
  }
}

export class SessionRevokedError extends AppError {
  constructor(message: string = 'Session has been revoked', options?: { cause?: unknown }) {
    super(message, HttpStatus.UNAUTHORIZED, 'SESSION_REVOKED', undefined, true, options);
  }
}

export class InvalidTokenError extends AppError {
  constructor(message: string = 'Invalid token provided', options?: { cause?: unknown }) {
    super(message, HttpStatus.UNAUTHORIZED, 'INVALID_TOKEN', undefined, true, options);
  }
}

export class TokenExpiredError extends AppError {
  constructor(message: string = 'Token has expired', options?: { cause?: unknown }) {
    super(message, HttpStatus.UNAUTHORIZED, 'TOKEN_EXPIRED', undefined, true, options);
  }
}

export class AccountDisabledError extends AppError {
  constructor(message: string = 'Account is disabled or suspended', options?: { cause?: unknown }) {
    super(message, HttpStatus.FORBIDDEN, 'ACCOUNT_DISABLED', undefined, true, options);
  }
}

export class InactiveAccountError extends AppError {
  constructor(message: string = 'Account is inactive', options?: { cause?: unknown }) {
    super(message, HttpStatus.FORBIDDEN, 'ACCOUNT_INACTIVE', undefined, true, options);
  }
}

export class PasswordPolicyViolationError extends AppError {
  constructor(
    message: string = 'Password does not meet the security policy requirements',
    options?: { cause?: unknown },
  ) {
    super(message, HttpStatus.BAD_REQUEST, 'PASSWORD_POLICY_VIOLATION', undefined, true, options);
  }
}

export class MissingTokenError extends AppError {
  constructor(message: string = 'Authentication token is required', options?: { cause?: unknown }) {
    super(message, HttpStatus.UNAUTHORIZED, 'MISSING_TOKEN', undefined, true, options);
  }
}

export class InvalidRefreshTokenError extends AppError {
  constructor(message: string = 'Invalid or expired refresh token', options?: { cause?: unknown }) {
    super(message, HttpStatus.UNAUTHORIZED, 'INVALID_REFRESH_TOKEN', undefined, true, options);
  }
}

export class InactiveTenantError extends AppError {
  constructor(message: string = 'Tenant is inactive', options?: { cause?: unknown }) {
    super(message, HttpStatus.FORBIDDEN, 'TENANT_INACTIVE', undefined, true, options);
  }
}

export class InvalidTenantContextError extends AppError {
  constructor(message: string = 'Tenant context mismatch', options?: { cause?: unknown }) {
    super(message, HttpStatus.FORBIDDEN, 'INVALID_TENANT_CONTEXT', undefined, true, options);
  }
}

export class MustChangePasswordError extends AppError {
  constructor(
    message: string = 'You must change your password before proceeding',
    options?: { cause?: unknown },
  ) {
    super(message, HttpStatus.FORBIDDEN, 'MUST_CHANGE_PASSWORD', undefined, true, options);
  }
}
