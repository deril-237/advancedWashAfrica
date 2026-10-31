// "use client";

// import { FunctionComponent } from "react";
// import { Program } from "../types";
// import Input from "@/components/atoms/Input";
// import { Button, ButtonLoading } from "@/components/atoms/Button";
// import { List, SaveIcon, Trash2Icon } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { createProgramSchema, updateProgramSchema } from "../schemas";
// import { CreateProgramDTO, UpdateProgramDTO } from "../types";
// import { zodResolver } from "@hookform/resolvers/zod";
// // import { useMutationProgram } from "../hooks";
// import { AlertResponse } from "@/components/atoms/AlertResponse";
// import { applyActionErrors } from "@/lib/forms/applyActionError";

// export type ProgramFormProps = { data: Program | null | undefined };

// export const ProgramForm: FunctionComponent<ProgramFormProps> = ({
//   data: program,
// }) => {
//   // const { mutateAsync } = useMutationProgram(program ? program.id : undefined);

//   const {
//     register,
//     handleSubmit,
//     setError,
//     reset,
//     formState: { isSubmitting, errors, isSubmitSuccessful },
//   } = useForm<CreateProgramDTO | UpdateProgramDTO>({
//     defaultValues: program
//       ? { duration: program.duration }
//       : { duration: undefined },
//     mode: "onSubmit",
//     reValidateMode: "onChange",
//     resolver: zodResolver(
//       program === null ? createProgramSchema : updateProgramSchema,
//     ),
//   });

//   const submit = handleSubmit(async (data) => {
//     try {
//       const result = await mutateAsync(data);

//       if (result.serverError) {
//         applyActionErrors(result.serverError, setError);
//       }
//     } catch (error) {
//       setError("root", {
//         message: "Erreur est survenue par  la création du parcours",
//       });
//     }
//   });

//   return (
//     <div className="space-y-4">
//       <div className="flex gap-2 items-center">
//         <div className="w-8 h-8 md:w-8 md:h-8 flex items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
//           <List />
//         </div>
//         <h3 className="text-xl md:text-2xl first-letter:capitalize font-bold text-gray-900 font-sans">
//           {program ? "Modifier la durée du parcours" : "Ajouter un parcours"}
//         </h3>
//       </div>

//       {isSubmitSuccessful && (
//         <AlertResponse
//           type="success"
//           message={
//             program
//               ? "Durée du parcours mise à jour avec succès!"
//               : "Parcours créé avec succès!"
//           }
//         />
//       )}

//       {errors.root?.message && (
//         <AlertResponse type="error" message={errors.root.message} />
//       )}

//       <form className="flex flex-col gap-4" onSubmit={submit}>
//         <div className="flex items-center gap-4">
//           <Input
//             label="Nombre de mois"
//             type="number"
//             {...register("duration", { valueAsNumber: true })}
//             error={errors.duration?.message}
//           />
//           <p className="text-xl self-baseline-last pb-2">Mois</p>
//         </div>
//         <div className="mt-5 flex flex-row gap-4 self-baseline-last">
//           <ButtonLoading
//             loadingComponent={<span className="loading"></span>}
//             type="submit"
//             disabled={isSubmitting}
//             className="btn btn-success text-white disabled:cursor-not-allowed"
//           >
//             <SaveIcon size={18} />
//             {isSubmitting ? "Traitement..." : program ? "Modifier" : "Ajouter"}
//           </ButtonLoading>
//           <Button
//             type="button"
//             onClick={() => {
//               reset();
//             }}
//             className="btn btn-error text-white"
//           >
//             <Trash2Icon size={18} />
//             Annuler
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// declare module "@/store/useModalStore" {
//   interface ModalRegistry {
//     program: null | Program;
//   }
// }
