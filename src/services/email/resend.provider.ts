import React from 'react';
import { Resend } from 'resend';

import { logger } from '@/lib/logger';

import { EmailProvider, SendEmailOptions } from './email.provider';

export class ResendProvider implements EmailProvider {
  private resend: Resend | null = null;
  // Resend requires a verified domain to send emails.
  // By default in testing, we must use onboarding@resend.dev
  private readonly fromEmail =
    process.env.EMAIL_FROM_ADDRESS || 'Multi-Tenant System <onboarding@resend.dev>';

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      logger.warn('RESEND_API_KEY is not set. ResendProvider will run in mock mode.');
    }
  }

  async send(options: SendEmailOptions): Promise<void> {
    if (!this.resend) {
      // Mock mode for local development without an API key
      // Extract props safely using a type guard instead of 'any' to adhere to strict TS
      const props = React.isValidElement(options.react) ? (options.react.props as Record<string, unknown>) : {};
      logger.info('Mock Email Sent:', {
        to: options.to,
        subject: options.subject,
        ...props,
      });
      return;
    }

    try {
      const response = await this.resend.emails.send({
        from: this.fromEmail,
        to: options.to,
        subject: options.subject,
        react: options.react,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      logger.info('Email sent successfully via Resend', {
        id: response.data?.id,
        to: options.to,
      });
    } catch (error) {
      logger.error('Failed to send email via Resend', error);
      throw error;
    }
  }
}
