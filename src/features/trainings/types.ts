export {
  type Training,
  type TrainingProgram,
} from "@/lib/generated/prisma/client";
import {
  Prisma,
  TrainingProgram,
  type Training,
} from "@/lib/generated/prisma/client";
import { CreateFileAssetDTO, MinimalFileAsset } from "../fileAssets/types";
import { PaginatedResult } from "@/lib/pagination";

type BaseTraining = Pick<Training, "name" | "description" | "objective"> & {
  image: CreateFileAssetDTO;
};

export type CreateTrainingDTO = BaseTraining & {
  // programs: Identifier[];
};

export type CreateTrainingInput = Omit<CreateTrainingDTO, "image"> & {
  image: File;
} & {
  // programs: Identifier[];
};

export type UpdateTrainingDTO = Partial<BaseTraining>;

export type AddProgramInTrainingDTO = Pick<
  TrainingProgram,
  "programId" | "price"
>;

export type UpdateTrainingProgramDTO = Partial<Pick<TrainingProgram, "price">>;

export type UpdateTrainingInput = Partial<
  Omit<CreateTrainingDTO, "image"> & {
    image: File;
  }
>;

export type TrainingListItem = Pick<
  Training,
  "id" | "description" | "objective" | "name"
> & {
  _count: { trainingPrograms: number };
  image: (MinimalFileAsset & { url: string }) | null;
};

export type TrainingList = PaginatedResult<TrainingListItem>;

export type AddTrainingInProgram = { price: number };

type BaseTrainingProgramItem = Prisma.TrainingProgramGetPayload<{
  select: {
    id: true;

    training: {
      select: {
        id: true;
        name: true;
        description: true;
        objective: true;
        image: {
          select: {
            id: true;
            key: true;
            mimeType: true;
          };
        };
      };
    };
    price: true;
    program: {
      select: { id: true; duration: true };
    };
  };
}>;

export type TrainingProgramItem = Omit<BaseTrainingProgramItem, "training"> & {
  training: Omit<BaseTrainingProgramItem["training"], "image"> & {
    image:
      | (BaseTrainingProgramItem["training"]["image"] & {
          url: string;
        })
      | null;
  };
};
