import { mailConfig } from '@/config';

import { ConsoleMailProvider } from './console-mail';
import { IMailProvider } from './types';

let mailer: IMailProvider;

switch (mailConfig.provider) {
  case 'console':
  default:
    mailer = new ConsoleMailProvider();
    break;
}

export { mailer };
