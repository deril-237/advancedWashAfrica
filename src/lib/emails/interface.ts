import { ReactNode } from "react";

export interface SendMailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  react?: ReactNode;
}

export interface IEmailService {
  sendMail: (data: SendMailOptions) => Promise<void>;
}
