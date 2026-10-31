import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { addTrainingAndProgramSeed } from "./seeds/addTrainingsAndPrograms";
import { addQuestions } from "./seeds/addQuestions";
import { createAdminUser } from "./seeds/createAdminUser";
import { Seed } from "./type";

console.log(process.env.APP_URL);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const seeds: Record<typeof process.env.NODE_ENV | "common", Seed[]> = {
    common: [addTrainingAndProgramSeed, createAdminUser, addQuestions],
    development: [],
    test: [],
    production: [],
  };

  const environnement = process.env.NODE_ENV ?? "development";

  for (const seed of [...seeds["common"], ...seeds[environnement]]) {
    await seed(prisma);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
