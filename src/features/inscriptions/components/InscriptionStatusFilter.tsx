import { InscriptionStatus } from "./../types";
import { STATUS_CONFIG } from "./../utils";

export function InscriptionStatusFilter({
  onChange,
}: {
  onChange?: (value: InscriptionStatus | undefined) => void;
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
      {Object.entries(STATUS_CONFIG).map(([key, value]) => {
        return (
          <input
            key={key}
            className="btn"
            type="radio"
            name={name}
            aria-label={value.label}
            value={key}
            onChange={(e) => {
              onChange && onChange(e.target.value as InscriptionStatus);
            }}
          />
        );
      })}
    </div>
  );
}
