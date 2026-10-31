import {
    type CarrerOpportunity
} from "@/lib/generated/prisma/client";

export type CreateCarrerOpportunityDto = Pick<CarrerOpportunity, "label" | "trainingProgramId">;

export type UpdateCarrerOpportunityDto = Pick<CarrerOpportunity, "label">;