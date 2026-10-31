import Input from "@/components/atoms/Input";
import { UserRound } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { useFormContext } from "react-hook-form";
import { type StudentFirstInscriptionInput } from "../../types";
import { AlertResponse } from "@/components/atoms/AlertResponse";

export const Step1PersonalInformation = () => {
  const {
    formState: { errors },
    register,
  } = useFormContext<StudentFirstInscriptionInput>();
  return (
    <div className="flex flex-col gap-6">
      <Input
        label="Numéro de CNI/Passeport"
        placeholder="123456789"
        required
        {...register("numCNIPassport")}
        error={errors.numCNIPassport?.message}
      />

      <div className="flex flex-col gap-6 md:flex-row">
        <Input
          label="Nom"
          type="text"
          placeholder="Jean"
          required
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          label="Prénom"
          type="text"
          placeholder="Dupont"
          required
          {...register("secondName")}
          error={errors.secondName?.message}
        />
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <Input
          label="Date de naissance"
          type="date"
          required
          {...register("birthDate")}
          error={errors.birthDate?.message}
        />
        <Input
          label="Lieu de naissance"
          type="text"
          placeholder="Ngaoundéré"
          required
          error={errors.birthPlace?.message}
          {...register("birthPlace")}
        />
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <Input
          label="Email"
          type="email"
          placeholder="jean@example.com"
          required
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Téléphone"
          type="tel"
          placeholder="6 99 99 99 99"
          required
          {...register("phone")}
          error={errors.phone?.message}
        />
      </div>

      <div className="w-full md:w-1/2">
        <Input
          label="Résidence"
          type="text"
          placeholder="Yaoundé"
          {...register("residence")}
          error={errors.residence?.message}
        />
      </div>
    </div>
  );
};
