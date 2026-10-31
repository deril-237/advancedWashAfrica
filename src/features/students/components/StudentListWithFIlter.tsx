"use client";

import { SelectTraining, SelectTrainingProgram } from "@/features/trainings";
import { useState } from "react";
import { SelectWave } from "@/features/waves";
import { StudentListComponent } from "./StudentList";
import { Button } from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { SearchIcon, Filter } from "lucide-react";
import { SelectOption } from "@/components/atoms/Select";
import { useDebounce } from "@/hooks/useDebounce";

const SEARCH_DEBOUNCE_MS = 400;

export const StudentListWithFilter = () => {
  const [training, setTraining] = useState<SelectOption | null>(null);
  const [trainingProgram, setTrainingProgram] = useState<SelectOption | null>();
  const [wave, setWave] = useState<SelectOption | null>(null);

  const handleChangeTraining = (value: SelectOption | null) => {
    if (!value) {
      setTraining(null);
      setTrainingProgram(null);
      setWave(null);
      return;
    }

    setTraining(value);
  };

  const handleChangeTrainingProgram = (value: SelectOption | null) => {
    if (!value) {
      setTrainingProgram(null);
      setWave(null);
      return;
    }

    setTrainingProgram(value);
  };

  const [searchValue, setSearchValue] = useState("");

  const debouncedOnSearch = useDebounce(searchValue, SEARCH_DEBOUNCE_MS);

  return (
    <div className="flex flex-col gap-4">
      {/* Filtres */}
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="font-heading text-2xl font-semibold text-base-content">
          {!wave
            ? "Liste des etudiants tous vagues cofondues"
            : `Formation: ${training?.label} de ${trainingProgram?.label}. ${wave?.label} `}
        </h2>
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
          <Button
            className="btn btn-square"
            popoverTarget="popover-filter-student"
            style={{ anchorName: "--anchor-filter-student" }}
          >
            <Filter className="" />
          </Button>

          <div
            className="dropdown  py-4 px-2 menu w-80 rounded-box bg-base-100 shadow-sm"
            popover="auto"
            id="popover-filter-student"
            style={{
              positionAnchor: "--anchor-filter-student",
            }}
          >
            <h2 className="text-xl font-bold mb-4">Choissir une vague</h2>
            <div className="flex flex-col items-center gap-6">
              <div className="w-72">
                <SelectTraining
                  onChange={handleChangeTraining}
                  value={training?.value ?? null}
                />
              </div>
              <div className="w-72">
                <SelectTrainingProgram
                  value={trainingProgram?.value}
                  label="Parcours de la formation choisie"
                  trainingId={training?.value ?? ""}
                  onChange={handleChangeTrainingProgram}
                />
              </div>
              <div className="w-72">
                <SelectWave
                  value={wave?.value}
                  label="Vagues du parcours selectionné"
                  trainingProgramId={trainingProgram?.value ?? ""}
                  onChange={setWave}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <StudentListComponent
        waveId={wave?.value ?? ""}
        search={debouncedOnSearch}
      />
    </div>
  );
};
