import { WaveStatus } from "./../types";

const waveStatusFilterLabel: Record<WaveStatus, string> = {
  [WaveStatus.OPEN]: "ouvert aux inscriptions",
  [WaveStatus.PENDING]: "En cours",
  [WaveStatus.FINISHED]: "Terminé",
};

export function WaveStatusFilter({
  onChange,
}: {
  onChange?: (value: WaveStatus | undefined) => void;
}) {
  const name = "filter-inscription-status";
  return (
    <div className="filter">
      <input
        className="btn filter-reset"
        type="radio"
        name={name}
        aria-label="Tout"
        onChange={(e) => {
          console.log(e.target.value);
          onChange && onChange(undefined);
        }}
        value={undefined}
      />
      {Object.entries(waveStatusFilterLabel).map(([key, value]) => {
        return (
          <input
            key={key}
            className="btn"
            type="radio"
            name={name}
            aria-label={value}
            value={key}
            onChange={(e) => {
              onChange && onChange(e.target.value as WaveStatus);
            }}
          />
        );
      })}
    </div>
  );
}
