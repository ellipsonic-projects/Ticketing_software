import { NextRequest } from 'next/server';

import { RouteContext } from '@/middleware/authenticate';
import { Prisma } from '@prisma/client';

import { ErrorCodes } from '@/constants/error-codes';
import { HttpStatus } from '@/constants/http-status';
import { Messages } from '@/constants/messages';

import { logger } from '../logger';
import { getRequestContext, RequestContext, requestContextStore } from '../request-context';
import { errorResponse } from '../response';
import { AppError } from './app-error';
import { DatabaseError } from './database-error';

export function withErrorHandler(
  handler: (req: NextRequest, ctx?: RouteContext) => Promise<Response>,
) {
  return async (req: NextRequest, ctx?: RouteContext): Promise<Response> => {
    const context = new RequestContext();

    return requestContextStore.run(context, async () => {
      try {
        return await handler(req, ctx);
      } catch (error) {
        const requestId = getRequestContext()?.requestId;

        // 1. Exception caught
        // 2. Logger records the raw error natively
        logger.error('Unhandled exception caught in API route', error, {
          url: req.url,
          method: req.method,
          requestId,
        });

        // 3. Serialize and Response
        if (error instanceof AppError) {
          return errorResponse(error.message, error.errors, error.statusCode, {
            errorCode: error.errorCode,
            requestId,
          });
        }

        // Handle known Prisma errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          const dbError = new DatabaseError(`Database error: ${error.code}`, true, {
            cause: error,
          });
          return errorResponse(dbError.message, [], dbError.statusCode, {
            errorCode: dbError.errorCode,
            requestId,
          });
        }

        // Generic fallback
        return errorResponse(Messages.INTERNAL_ERROR, [], HttpStatus.INTERNAL_SERVER_ERROR, {
          errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
          requestId,
        });
      }
    });
  };
}
