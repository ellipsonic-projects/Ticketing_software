import { appConfig } from '@/config';

export const AppInfo = {
  APP_NAME: 'Multi-Tenant Ticketing System',
  VERSION: '0.1.0', // Based on package.json
  NODE_ENV: appConfig.env,
} as const;
