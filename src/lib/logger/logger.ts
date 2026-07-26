import { appConfig } from '@/config';

import { clock } from '../time';
import { injectContext } from './serializers';
import { Logger } from './types';

/**
 * Structured logger abstraction.
 * This can seamlessly be replaced with Pino or Winston later.
 */
export const logger: Logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    console.log(
      JSON.stringify({
        level: 'info',
        message,
        timestamp: clock.iso(),
        ...injectContext(meta),
      }),
    );
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    console.warn(
      JSON.stringify({
        level: 'warn',
        message,
        timestamp: clock.iso(),
        ...injectContext(meta),
      }),
    );
  },
  error: (message: string, error?: unknown, meta?: Record<string, unknown>) => {
    console.error(
      JSON.stringify({
        level: 'error',
        message,
        err: error,
        timestamp: clock.iso(),
        ...injectContext(meta),
      }),
    );
  },
  debug: (message: string, meta?: Record<string, unknown>) => {
    if (!appConfig.isProduction) {
      console.debug(
        JSON.stringify({
          level: 'debug',
          message,
          timestamp: clock.iso(),
          ...injectContext(meta),
        }),
      );
    }
  },
};
