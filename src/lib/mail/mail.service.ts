import { mailConfig } from '@/config/mail';
import nodemailer from 'nodemailer';

import { logger } from '@/lib/logger';

class MailService {
  private transporter: nodemailer.Transporter | null = null;

  private async getTransporter() {
    if (this.transporter) return this.transporter;

    if (mailConfig.provider === 'smtp' && mailConfig.smtp.host) {
      this.transporter = nodemailer.createTransport({
        host: mailConfig.smtp.host,
        port: mailConfig.smtp.port,
        secure: mailConfig.smtp.port === 465,
        auth: {
          user: mailConfig.smtp.user,
          pass: mailConfig.smtp.pass,
        },
      });
    } else {
      // Ethereal / Console fallback for development
      logger.info('Creating Ethereal email test account...');
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    return this.transporter;
  }

  async sendPasswordResetEmail(to: string, resetLink: string) {
    const transporter = await this.getTransporter();

    const info = await transporter.sendMail({
      from: '"Multi-Tenant System" <noreply@example.com>',
      to,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the following link to reset your password: ${resetLink}`,
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the button below to reset your password.</p>
        <a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#000;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    logger.info('Password reset email sent', { messageId: info.messageId, email: to });

    if (mailConfig.provider !== 'smtp') {
      logger.info('Preview Password Reset Email', {
        previewUrl: nodemailer.getTestMessageUrl(info),
      });
    }
  }
}

export const mailService = new MailService();
