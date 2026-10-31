import {
  StudentMotivation,
  OptionMotivation,
} from "@/lib/generated/prisma/browser";
export {
  type Student,
  type StudentMotivation,
} from "@/lib/generated/prisma/client";

export type StudentMotivations = (Pick<
  StudentMotivation,
  "id" | "textResponse"
> & {
  option: Pick<OptionMotivation, "label" | "id"> | null;
})[];
