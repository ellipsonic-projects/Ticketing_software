import * as React from 'react';

import { env } from '@/config/env';
import { render } from '@react-email/render';
import * as nodemailer from 'nodemailer';

import { EmailProvider, SendEmailOptions } from './email.provider';

export class SmtpProvider implements EmailProvider {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });
    } else {
      console.error('[SMTP] Configuration is missing or incomplete.', {
        hostConfigured: Boolean(env.SMTP_HOST),
        portConfigured: Boolean(env.SMTP_PORT),
        userConfigured: Boolean(env.SMTP_USER),
        passwordConfigured: Boolean(env.SMTP_PASS),
        fromConfigured: Boolean(env.SMTP_FROM),
      });
    }
  }

  async send(options: SendEmailOptions): Promise<void> {
    try {
      // Use render from @react-email/render to convert React element to HTML string
      const html = await render(options.react as React.ReactElement);

      const from = env.SMTP_FROM || 'noreply@example.com';
      const to = Array.isArray(options.to) ? options.to.join(', ') : options.to;

      if (!this.transporter) {
        if (env.NODE_ENV === 'production') {
          console.error('[SMTP] Email delivery unavailable because SMTP is not configured.');
          throw new Error('SMTP configuration is missing or incomplete');
        }

        console.log(`\n📧 [DEV MODE] Simulated Email to: ${to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`From: ${from}`);
        console.log(`[Content Omitted] Setup SMTP env vars to send real emails.\n`);
        return;
      }

      const result = await this.transporter.sendMail({
        from,
        to,
        subject: options.subject,
        html,
      });

      console.info('[SMTP] Email delivered successfully.', {
        messageId: result.messageId,
        acceptedCount: Array.isArray(result.accepted) ? result.accepted.length : 0,
        rejectedCount: Array.isArray(result.rejected) ? result.rejected.length : 0,
      });
    } catch (error) {
      const smtpError = error as {
        code?: string;
        command?: string;
        responseCode?: number;
        message?: string;
      };

      console.error('[SMTP] Email delivery failed.', {
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        code: smtpError.code,
        command: smtpError.command,
        responseCode: smtpError.responseCode,
        message: smtpError.message || 'Unknown SMTP error',
      });
      throw error;
    }
  }
}
