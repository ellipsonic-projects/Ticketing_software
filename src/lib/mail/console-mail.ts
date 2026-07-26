import { logger } from '../logger';
import { IMailProvider, MailOptions } from './types';

export class ConsoleMailProvider implements IMailProvider {
  async sendMail(options: MailOptions): Promise<boolean> {
    logger.info('📧 Mock Email Sent', {
      to: options.to,
      subject: options.subject,
      bodyPreview: options.body.substring(0, 50),
    });
    return true;
  }
}
