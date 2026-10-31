"server-only";

import { resend } from "./resend";
import { IEmailService, SendMailOptions } from "./interface";
import { sendMail } from "./nodemailer";
import { render } from "react-email";

const METHOD_SEND_MAIL = process.env.METHOD_SEND_MAIL;

export class EmailsService implements IEmailService {
  async sendMail(data: SendMailOptions) {
    await this.sendWithResend(data);
  }

  private async sendWithResend({
    to,
    subject,
    html,
    text,
    react,
  }: SendMailOptions) {
    try {
      if (METHOD_SEND_MAIL === "NODEMAILER") {
        let body: string;
        if (react) {
          body = await render(react);
        } else {
          body = html ?? text ?? "";
        }

        await this.sendWithNodemailer({ to, body, subject });
      } else {
        const { data, error } = await resend.emails.send({
          from: process.env.EMAIL_FROM as string,
          to,
          subject,
          html: html,
          text: text,
          react: react,
        });

        if (error) {
          console.error("Error sending email:", error);
          throw error;
        }
      }
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  private async sendWithNodemailer({
    to,
    subject,
    body,
  }: Pick<SendMailOptions, "subject" | "to"> & { body: string }) {
    await sendMail(to, subject, body);
  }
}

export const emailsService = new EmailsService();
// export default emailsService;
