import nodemailer from "nodemailer";

const EMAIL_SENDER = process.env.EMAIL_SENDER;
const EMAIL_SENDER_PASSWORD = process.env.EMAIL_SENDER_PASSWORD;
const HOST_MAIL = process.env.HOST_MAIL;

const transport = nodemailer.createTransport({
  host: HOST_MAIL,
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_SENDER,
    pass: EMAIL_SENDER_PASSWORD,
  },
  debug: true,
  logger: true,
});

export async function sendMail(
  destinationEmail: string,
  subject: string,
  body: string,
) {
  try {
    const info = await transport.sendMail({
      from: EMAIL_SENDER,
      to: destinationEmail,
      html: body,
      subject,
    });

    return info;
  } catch (error) {
    throw error;
  }
}
