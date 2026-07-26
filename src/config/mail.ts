import { env } from './env';

export const mailConfig = {
  provider: env.MAIL_PROVIDER,
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
} as const;
