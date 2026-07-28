export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: React.ReactNode;
}

export interface EmailProvider {
  send(options: SendEmailOptions): Promise<void>;
}
