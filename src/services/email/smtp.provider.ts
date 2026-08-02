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
      console.warn('⚠️ SMTP configuration is missing or incomplete in environment variables.');
    }
  }

  async send(options: SendEmailOptions): Promise<void> {
    try {
      // Use render from @react-email/render to convert React element to HTML string
      const html = await render(options.react as React.ReactElement);

      const from = env.SMTP_FROM || 'noreply@example.com';
      const to = Array.isArray(options.to) ? options.to.join(', ') : options.to;

      if (!this.transporter) {
        console.log(`\n📧 [DEV MODE] Simulated Email to: ${to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`From: ${from}`);
        console.log(`[Content Omitted] Setup SMTP env vars to send real emails.\n`);
        return;
      }

      await this.transporter.sendMail({
        from,
        to,
        subject: options.subject,
        html,
      });
    } catch (error) {
      console.error('❌ Error sending email via SMTP:', error);
      throw error;
    }
  }
}
