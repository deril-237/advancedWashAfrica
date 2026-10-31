"server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../prisma";
import { nextCookies } from "better-auth/next-js";
import { MIN_LENGTH_PASSWORD, MAX_LENGTH_PASSWORD } from "@/constants";
import { emailsService } from "../emails";
import { ResetPasswordEmail } from "@/emails/templates/ResetPasswordEmail";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  rateLimit: {
    enabled: true,
    max: 10,
    window: 60,
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ newEmail, user, url, token }) => {
        emailsService.sendMail({
          to: user.email,
          subject: "Confirmation du changement d'email",
          html: "",
        });
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: MIN_LENGTH_PASSWORD,
    maxPasswordLength: MAX_LENGTH_PASSWORD,
    sendResetPassword: async ({ user, url }) => {
      await emailsService.sendMail({
        to: user.email,
        subject: "Reset your password",
        // html: `Hello ${user.name}, <p>Click the link below to reset your password:</p><a href="${url}">${url}</a>`,
        react: ResetPasswordEmail({
          link: url,
          expiresInMinutes: 60,
          name: user.name,
        }),
      });
    },
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
  },

  plugins: [nextCookies()],
});
