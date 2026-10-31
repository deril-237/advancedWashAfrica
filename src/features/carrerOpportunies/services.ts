import { prisma } from "@/lib/prisma";
import { CreateCarrerOpportunityDto, UpdateCarrerOpportunityDto } from "./types";
import { Identifier } from "@/interfaces/entities";
import { handlePrismaError } from "@/lib/errors/handlesError";

export async function createCarrerOpportunity(data: CreateCarrerOpportunityDto) {
    try {
        const result = await prisma.carrerOpportunity.create({
            data
        });

        return result;
    } catch (error) {
        handlePrismaError(error, {
            unique: { global: "la carriere existe deja dans ce programme de formation" }
        });
    }
}

export async function updateCarrerOpportunity(id: Identifier, data: UpdateCarrerOpportunityDto) {
    try {
        const result = await prisma.carrerOpportunity.update({
            where: {
                id
            },
            data
        });

        return result;
    } catch (error) {
        handlePrismaError(error, {
            unique: { global: "la carriere existe deja dans ce programme de formation" }
        });
    }
}

export async function deleteCarrerOpportunity(id: Identifier) {
    try {
        const result = await prisma.carrerOpportunity.delete({
            where: {
                id
            }
        });

        return result;
    } catch (error) {
        handlePrismaError(error, {
            notExist: "la carriere n'existe pas dans ce programme de formation"
        });
    }
}

export async function getCarrerOpportunity(id: Identifier) {
    try {
        const result = await prisma.carrerOpportunity.findUnique({
            where: {
                id
            }
        });

        return result;
    } catch (error) {
        handlePrismaError(error, {
            notExist: "la carriere n'existe pas dans ce programme de formation"
        });
    }
}

export async function getCarrerOpportunities(trainingProgramId?: Identifier) {
    try {

        const where = trainingProgramId ? { trainingProgramId } : {};
        const result = await prisma.carrerOpportunity.findMany({ where });
        return result;
    } catch (error) {
        handlePrismaError(error, {
            notExist: "la carriere n'existe pas dans ce programme de formation"
        });
    }
}