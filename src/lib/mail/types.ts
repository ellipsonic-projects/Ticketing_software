export interface MailOptions {
  to: string | string[];
  subject: string;
  body: string;
  html?: string;
  from?: string;
}

export interface IMailProvider {
  sendMail(options: MailOptions): Promise<boolean>;
}
