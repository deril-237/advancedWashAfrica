"use client";

import { useRef, useState } from "react";
import Input from "@/components/atoms/Input";
import { SearchIcon, Filter } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { SelectTraining, SelectTrainingProgram } from "@/features/trainings";
import { InscriptionListComponent } from "./InscriptionList";
import { InscriptionStatus } from "../types";
import { Button } from "@/components/atoms/Button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inscriptionFilterSchema } from "../schemas";
import { identifierSchema } from "@/lib/zodRules";
import { InscriptionStatusFilter } from "./InscriptionStatusFilter";
import { Identifier } from "@/interfaces/entities";

function FilterInscription({
  onChange,
}: {
  onChange?: (value?: Identifier) => void;
}) {
  const { control, handleSubmit, watch } = useForm({
    resolver: zodResolver(
      inscriptionFilterSchema.pick({ trainingProgramId: true }).extend({
        trainingId: identifierSchema.optional(),
      }),
    ),
  });

  const trainingId = watch("trainingId");

  const handleApplyFilter = handleSubmit((data) => {
    onChange && onChange(data.trainingProgramId);
  });

  return (
    <form>
      <h3 className="font-heading text-lg font-semibold text-base-content">
        Filtres: Choisir une formation et le parcours
      </h3>
      <div className="flex flex-col items-center gap-4">
        <div className="w-72">
          <Controller
            name="trainingId"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <SelectTraining
                  placeholder="Choissez une formation"
                  label="Formation"
                  onChangeValue={field.onChange}
                  value={field.value}
                  name={field.value}
                  error={fieldState.error?.message}
                />
              );
            }}
          />
        </div>
        <div className="w-72">
          <Controller
            name="trainingProgramId"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <SelectTrainingProgram
                  placeholder="Choissez un parcours"
                  label="Parcours"
                  disabled={!trainingId}
                  trainingId={trainingId ?? ""}
                  onChangeValue={field.onChange}
                  value={field.value}
                  name={field.value}
                  error={fieldState.error?.message}
                />
              );
            }}
          />
        </div>
        <Button
          className="w-full btn btn-primary btn-soft"
          onClick={handleApplyFilter}
        >
          <Filter size={16} />
          Filtrer
        </Button>
      </div>
    </form>
  );
}

export const InscriptionListWithFilter = () => {
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState<InscriptionStatus | undefined>();
  const [programId, setProgramId] = useState<Identifier>();
  const refDropdown = useRef<HTMLDivElement>(null);

  const handleSubmit = (value: Identifier | undefined) => {
    setProgramId(value);
    refDropdown.current?.hidePopover();
  };
  const search = useDebounce(searchValue, 400);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        {/* filter status */}
        <InscriptionStatusFilter onChange={setStatus} />

        {/* filter program */}
        <div className="flex gap-2">
          <div className="relative w-full sm:w-72">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40 pointer-events-none z-10"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={"retrouver un étudiant"}
              aria-label={"retrouver un étudiant"}
              className="pl-9"
            />
          </div>
          <div>
            <Button
              className="btn btn-square"
              popoverTarget="popover-filter-inscription"
              style={{
                anchorName: "--anchor-filter-inscription",
              }}
            >
              <Filter />
            </Button>
            <div
              ref={refDropdown}
              className="dropdown py-4 px-2 menu w-80 rounded-box bg-base-100 shadow-sm space-y-6 mr-4 md:mr-10"
              popover="auto"
              id="popover-filter-inscription"
              style={{
                positionAnchor: "--anchor-filter-inscription",
              }}
            >
              <FilterInscription onChange={handleSubmit} />
            </div>
          </div>
        </div>
      </div>

      <InscriptionListComponent
        search={search}
        status={status}
        trainingProgramId={programId}
      />
    </div>
  );
};
