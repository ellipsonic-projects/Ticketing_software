import React from 'react';

import InvitationEmail from '@/emails/invitation';
import PasswordChangedEmail from '@/emails/password-changed';
import PasswordResetEmail from '@/emails/password-reset';
import WelcomeEmail from '@/emails/welcome';

import { EmailProvider } from './email.provider';
import { ResendProvider } from './resend.provider';

export class EmailService {
  private provider: EmailProvider;

  constructor(provider?: EmailProvider) {
    this.provider = provider || new ResendProvider();
  }

  async sendInvitation(email: string, token: string, appUrl: string) {
    const inviteLink = `${appUrl}/auth/accept-invitation?token=${token}`;
    await this.provider.send({
      to: email,
      subject: 'You have been invited to join the Multi-Tenant Platform',
      react: React.createElement(InvitationEmail, { inviteLink }),
    });
  }

  async sendPasswordReset(email: string, token: string, appUrl: string) {
    const resetLink = `${appUrl}/auth/reset-password?token=${token}`;
    await this.provider.send({
      to: email,
      subject: 'Reset your password',
      react: React.createElement(PasswordResetEmail, { resetLink }),
    });
  }

  async sendWelcome(email: string, appUrl: string) {
    await this.provider.send({
      to: email,
      subject: 'Welcome to the Platform!',
      react: React.createElement(WelcomeEmail, { loginUrl: `${appUrl}/auth/login` }),
    });
  }

  async sendPasswordChanged(email: string) {
    await this.provider.send({
      to: email,
      subject: 'Your password was changed successfully',
      react: React.createElement(PasswordChangedEmail, {}),
    });
  }
}

export const emailService = new EmailService();
