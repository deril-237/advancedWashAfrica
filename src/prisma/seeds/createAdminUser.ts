import { auth } from "@/lib/betterAuth/auth";
import { PrismaClient } from "@/lib/generated/prisma/client";

export async function createAdminUser(prisma: PrismaClient) {
  try {
    const email = process.env.ADMIN_EMAIL!;
    const password = process.env.ADMIN_PASSWORD!;
    const name = process.env.ADMIN_NAME ?? "Admin";

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log("Le compte de l'administrateur a déja été crée");
      return;
    }

    await auth.api.signUpEmail({
      body: { email, name, password },
    });
  } catch (error) {
    console.log(
      "Une erreure c'est produite lors de la création du compte administrateurs",
    );
  }
}
