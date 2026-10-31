import { PrismaClient } from "@prisma/client/extension";

export type Seed = (prisma: PrismaClient) => Promise<void>;
