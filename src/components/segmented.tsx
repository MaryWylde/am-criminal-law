import { Txt } from './txt';

/** Two-or-more-way toggle in the header style: cream active cell on a black
 *  bar (GTA) / accent on light (regular). Generic over the value type. */
export function Segmented<T extends string>({
  value, onChange, options, ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="rounded-theme flex select-none items-stretch hard-shadow overflow-hidden border-2 border-side-line bg-side"
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={`px-3 py-1.5 text-[11px] font-bold tracking-[0.18em] transition-colors ${
              active
                ? 'bg-side-text text-side'
                : 'text-side-dim hover:text-side-text'
            }`}
          >
            <Txt label>{o.label}</Txt>
          </button>
        );
      })}
    </div>
  );
}
