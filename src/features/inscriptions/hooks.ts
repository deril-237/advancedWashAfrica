import { Identifier } from "@/interfaces/entities";
import { PaginationParams } from "@/lib/pagination";
import { unwrap } from "@/lib/safeAction";
import { storageService } from "@/lib/StorageService/cloudinary/cloudinary.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  firstStudentInscriptionByAdminAction,
  getInscriptionListAction,
  getInscriptionStatisticsAction,
  secondInscriptionStudentAction,
  firstStudentInscriptionByStudentAction,
  getSignedUploadAdminPayloadAction,
  getSignedUploadStudentPayloadAction,
} from "./actions";
import { inscriptionKeys } from "./queryKeys";
import {
  FilterInscription,
  StudentFirstInscriptionByStudentInput,
  StudentFirstInscriptionInput,
  StudentSecondInscriptionDTO,
  BaseFirstInscription,
  CreateStudentDTO,
} from "./types";

async function uploadFileInscription(
  files: Pick<
    StudentFirstInscriptionInput,
    "diploma" | "photo" | "cniPassport"
  >,
  author: "admin" | "student",
) {
  const fnGetSignature =
    author === "admin"
      ? getSignedUploadAdminPayloadAction
      : getSignedUploadStudentPayloadAction;
  const result = await fnGetSignature({
    diploma: {
      mimeType: files.diploma.type as any,
      size: files.diploma.size,
      filename: files.diploma.name,
    },
    photo: {
      mimeType: files.photo.type as any,
      size: files.photo.size,
      filename: files.photo.name,
    },
    cniPassport: {
      mimeType: files.cniPassport.type as any,
      size: files.cniPassport.size,
      filename: files.cniPassport.name,
    },
  });

  if (result.serverError || result.validationErrors || !result.data) {
    throw Error(`Une erreur est survenue pendant l'obtention des signatures`);
  }

  const [cniPassport, diploma, photo] = await Promise.all([
    storageService.upload(files.cniPassport, result.data.cniPassport),
    storageService.upload(files.diploma, result.data.diploma),
    storageService.upload(files.photo, result.data.studentPhoto),
  ]);

  return {
    cniPassport,
    diploma,
    photo,
  };
}

export function useMutationInscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cniPassport,
      diploma,
      photo,
      ...data
    }: StudentFirstInscriptionInput) => {
      const resultUpload = (await uploadFileInscription(
        { cniPassport, diploma, photo },
        "admin",
      )) as Pick<CreateStudentDTO, "photo" | "diploma" | "cniPassport">;

      const result = await firstStudentInscriptionByAdminAction({
        ...data,
        ...resultUpload,
      });

      return result;
    },
    onSuccess: (result) => {
      if (result.serverError || result.validationErrors) {
        queryClient.invalidateQueries({ queryKey: inscriptionKeys.all });
      }
    },
  });
}

export function useMutationInscriptionByStudent() {
  return useMutation({
    mutationFn: async ({
      cniPassport,
      diploma,
      photo,
      ...data
    }: StudentFirstInscriptionByStudentInput) => {
      const resultUpload = await uploadFileInscription(
        { cniPassport, diploma, photo },
        "student",
      );

      const result = await firstStudentInscriptionByStudentAction({
        ...data,
        diploma: {
          ...resultUpload.diploma,
          mimeType: resultUpload.diploma.mimeType as
            "application/pdf" | "image/jpeg" | "image/png",
        },
        cniPassport: {
          ...resultUpload.cniPassport,
          mimeType: resultUpload.cniPassport.mimeType as
            "application/pdf" | "image/jpeg" | "image/png",
        },
        photo: {
          ...resultUpload.photo,
          mimeType: resultUpload.photo.mimeType as
            "application/pdf" | "image/jpeg" | "image/png",
        },
      });

      return result;
    },
  });
}

export function useSecondInscription(studentId: Identifier) {
  return useMutation({
    mutationFn: (data: StudentSecondInscriptionDTO) => {
      return secondInscriptionStudentAction(studentId, data);
    },
  });
}

export function useGetInscriptionList(
  page: PaginationParams["page"],
  filter: FilterInscription,
) {
  return useQuery({
    queryKey: inscriptionKeys.list({ page }, filter),
    queryFn: () => unwrap(getInscriptionListAction({ page }, filter)),
  });
}

export function useGetInscriptionStatistics() {
  return useQuery({
    queryKey: inscriptionKeys.statistics,
    queryFn: () => unwrap(getInscriptionStatisticsAction()),
  });
}
