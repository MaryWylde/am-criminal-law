import { FILTER_CATS, useConsole } from '../console-context';
import type { Lang } from '../types';
import { GAUGE_MAX_YEARS, CATEGORY_DESC } from '../lib/articles';
import { t, CAT_KEY } from '../lib/i18n';
import { Txt } from './txt';

/** The filter deck: category / penalty / max-term / saved, live count and
 *  CLEAR ALL. Lives in the header right next to the search box so it is one
 *  click away from anywhere; the sidebar only lists results. */
export function FilterDeck({ className = '' }: { className?: string }) {
  const {
    filters, toggleCat, toggleFine, togglePrison, toggleLife, toggleSaved, setMaxYears,
    filtered, total, filtersActive, searching, resetFilters, lang, bookmarks,
  } = useConsole();

  return (
    <div
      className={`rounded-theme hard-shadow flex flex-wrap items-end gap-x-5 gap-y-2.5 border-2 border-side-line bg-side px-3 py-2 ${className}`}
    >
      <Group label={t('category', lang)}>
        {FILTER_CATS.map((c) => (
          <Chip
            key={c}
            label={t(CAT_KEY[c], lang)}
            active={filters.cats.has(c)}
            onClick={() => toggleCat(c)}
            tip={CATEGORY_DESC[c][lang] ?? ''}
          />
        ))}
      </Group>

      <Group label={t('penalty', lang)}>
        <Chip label={t('fine', lang)} active={filters.fine} onClick={toggleFine} />
        <Chip label={t('prison', lang)} active={filters.prison} onClick={togglePrison} />
        <Chip label={t('life', lang)} active={filters.life} onClick={toggleLife} tip={t('lifeTip', lang)} />
        <Chip
          label={`★ ${t('saved', lang)}${bookmarks.size ? ` ${bookmarks.size}` : ''}`}
          active={filters.saved}
          onClick={toggleSaved}
          tip={t('savedTip', lang)}
        />
      </Group>

      <Group label={t('maxTerm', lang)}>
        <MaxTerm value={filters.maxYears} onChange={setMaxYears} lang={lang} />
      </Group>

      <div className="ml-auto flex items-center gap-3 self-end pb-0.5">
        <span className="font-mono text-[11px] font-semibold text-side-text">
          <span className="font-bold">{filtered.length}</span> / {total}
          {' '}
          <Txt label className="tracking-[0.15em]">
            {searching ? t('results', lang) : t('records', lang)}
          </Txt>
        </span>
        {(filtersActive || searching) && (
          <button
            type="button"
            onClick={resetFilters}
            className="border border-side-mute px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest text-side-text hover:border-accent hover:text-accent"
          >
            <Txt label>{t('clearAll', lang)}</Txt>
          </button>
        )}
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Txt label className="brut-label mb-1 block text-[9px] font-semibold tracking-[0.25em] text-side-text opacity-80">
        {label}
      </Txt>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  label, active, onClick, tip,
}: { label: string; active: boolean; onClick: () => void; tip?: string }) {
  const button = (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border px-2 py-1 text-[10px] font-semibold tracking-[0.12em] transition-colors ${
        active
          ? 'border-accent bg-accent text-accent-ink'
          : 'border-side-mute bg-side-2 text-side-text hover:border-side-dim'
      }`}
    >
      <Txt label>{label}</Txt>
    </button>
  );
  if (!tip) return button;
  return (
    <span className="group/tip relative">
      {button}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-30 mt-1.5 hidden w-56 border border-side-dim bg-side px-2.5 py-2 shadow-lg group-hover/tip:block group-focus-within/tip:block"
      >
        <Txt className="block text-[11px] leading-snug text-side-text">{tip}</Txt>
      </span>
    </span>
  );
}

function MaxTerm({
  value, onChange, lang,
}: { value: number | null; onChange: (n: number | null) => void; lang: Lang }) {
  const isAny = value === null;
  return (
    <div className="flex flex-wrap items-center gap-2 pb-0.5">
      <div
        className="flex items-center gap-[2px]"
        role="group"
        aria-label="Maximum prison term filter"
      >
        {Array.from({ length: GAUGE_MAX_YEARS }, (_, i) => {
          const yr = i + 1;
          const filled = !isAny && value !== null && yr <= value;
          return (
            <button
              key={yr}
              type="button"
              onClick={() => onChange(yr)}
              title={`≤ ${yr}`}
              aria-label={`Max ${yr} years`}
              className={`h-4 w-[9px] border transition-colors ${
                filled
                  ? 'border-accent bg-accent'
                  : 'border-side-mute bg-side-2 hover:border-side-dim'
              }`}
            />
          );
        })}
        {/* ANY cap */}
        <button
          type="button"
          onClick={() => onChange(null)}
          title="Any term"
          aria-label="Any term"
          className={`ml-1 h-4 w-[13px] border transition-colors ${
            isAny ? 'border-side-text bg-side-text' : 'border-side-mute bg-side-2 hover:border-side-dim'
          }`}
        />
      </div>
      <span className={`font-mono text-[11px] font-semibold ${isAny ? 'text-side-text' : 'text-accent'}`}>
        {isAny ? (
          <Txt label>{t('any', lang)}</Txt>
        ) : (
          <>
            ≤{value} <Txt label>{t('years', lang)}</Txt>
          </>
        )}
      </span>
    </div>
  );
}
