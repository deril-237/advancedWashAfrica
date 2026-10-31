"server-only";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { OptionMotivationUncheckedCreateInput } from "@/lib/generated/prisma/models";

export async function addQuestions(prisma: PrismaClient) {
  const itemsOptions: OptionMotivationUncheckedCreateInput[] = [
    {
      label: `comprendre les mecanisme de l'action
humanitaire`,
      order: 1,
    },
    {
      label: `Pour ma culture`,
      order: 2,
    },
    {
      label: `acquèrir des compétences`,
      order: 3,
    },
    {
      label: `Faire carrière`,
      order: 4,
    },
  ];

  await prisma.$transaction(
    itemsOptions.map((item) =>
      prisma.optionMotivation.upsert({
        create: item,
        where: { order: item.order },
        update: {},
      }),
    ),
  );
}
