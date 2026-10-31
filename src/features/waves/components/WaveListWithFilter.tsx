"use client";

import { SelectTraining, Training } from "@/features/trainings";
import { WaveListComponent } from "./WaveList";
import { FunctionComponent, useState, useRef } from "react";
import EmptyState from "@/components/atoms/EmptyState";
import { Filter, Folder } from "lucide-react";
import { FilterWave, WaveStatus } from "../types";
import { Button } from "@/components/atoms/Button";
import { Program, SelectProgram } from "@/features/programs";
import { WaveStatusFilter } from "./WaveStatus";
import { Identifier } from "@/interfaces/entities";
import { SelectOption } from "@/components/atoms/Select";

export type FilterWaveOption = {
  program: SelectOption | null;
  training: SelectOption | null;
};

const FilterWaveForm: FunctionComponent<{
  onChange?: (filter: FilterWaveOption) => void;
}> = ({ onChange }) => {
  const [program, setProgram] = useState<SelectOption | null>(null);
  const [training, setTraining] = useState<SelectOption | null>(null);
  const handleChange = () => {
    onChange &&
      onChange({
        program: program,
        training: training,
      });
  };

  return (
    <form action={handleChange}>
      <h3 className="font-heading text-lg font-semibold text-base-content">
        Filtres: Choisir une formation et le parcours
      </h3>
      <div className="flex flex-col items-center gap-4">
        <div className="w-72">
          <SelectTraining
            name="training"
            placeholder="Choissez une formation"
            label="Formation"
            onChange={setTraining}
            value={training?.value}
          />
        </div>
        <div className="w-72">
          <SelectProgram
            placeholder="Choissez un parcours"
            label="Parcours"
            name="program"
            onChange={setProgram}
            value={program?.value}
          />
        </div>
        <div className="w-full">
          <Button className="w-72 btn btn-primary btn-soft" type="submit">
            <Filter size={16} />
            Filtrer
          </Button>
        </div>
      </div>
    </form>
  );
};

export const WaveListWithFilter = () => {
  const [status, setStatus] = useState<WaveStatus | undefined>();
  const [program, setProgram] = useState<SelectOption | null>(null);
  const [training, setTraining] = useState<SelectOption | null>(null);
  const refDropdown = useRef<HTMLDivElement>(null);

  const handleChange = (data: FilterWaveOption) => {
    setProgram(data.program || program);
    setTraining(data.training || training);
    refDropdown.current?.hidePopover();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        {/* filter status */}
        <WaveStatusFilter onChange={setStatus} />

        {/* filter program */}
        <div className="flex gap-2">
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
              <FilterWaveForm onChange={handleChange} />
            </div>
          </div>
        </div>
      </div>

      <WaveListComponent
        status={status}
        programId={program?.value}
        trainingId={training?.value}
      />
    </div>
  );
};
