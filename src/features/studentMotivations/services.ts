"server-only";

import { prisma } from "@/lib/prisma";

// motivations
export async function getMotivationList() {
  const motivationOptions = await prisma.optionMotivation.findMany({
    orderBy: { order: "asc" },
  });

  return motivationOptions;
}
