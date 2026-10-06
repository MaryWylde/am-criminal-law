import type { ClausePenalty, Lang } from '../types';
import { clauseScale, GAUGE_MAX_YEARS } from '../lib/articles';
import { t } from '../lib/i18n';
import { Txt } from './txt';

/** Per-clause severity gauge (DESIGN §6). One bar PER clause — never the merged
 *  aggregate. 0..20 discrete year segments + a LIFE cap segment. Red fills the
 *  clause's term range; a pale tint shows the reachable-but-unfilled tail.
 *  Months-only clauses fill the very low end; fine-only clauses read as a dim
 *  non-custodial marker. */

const SEG = GAUGE_MAX_YEARS; // 20 year cells

export function SeverityGauge({ penalty, lang }: { penalty: ClausePenalty; lang: Lang }) {
  const sc = clauseScale(penalty);

  const fromIdx = Math.round(sc.fillFrom * SEG);
  const toIdx = Math.round(sc.fillTo * SEG);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {/* clause marker */}
      <span className="grid h-6 w-8 shrink-0 place-items-center border-2 border-ink font-mono text-[11px] font-bold text-ink">
        §{penalty.clause.replace(/\.$/, '')}
      </span>

      {/* the segmented bar */}
      <div className="flex items-center gap-[2px]" aria-hidden>
        {Array.from({ length: SEG }, (_, i) => {
          const within = sc.kind === 'years' && i >= fromIdx && i < toIdx;
          const reach = sc.kind === 'years' && i < fromIdx;
          const monthsCell = sc.kind === 'months' && i === 0;
          const filled = within || monthsCell || sc.kind === 'life';
          return (
            <span
              key={i}
              className={`h-4 w-[7px] border ${
                filled
                  ? 'border-accent bg-accent'
                  : reach
                    ? 'border-accent/50 bg-accent/20'
                    : 'border-ink/30 bg-paper-2'
              }`}
            />
          );
        })}
        {/* LIFE cap segment — lit when life is reachable in this clause */}
        <span
          className={`ml-1 h-4 w-[11px] border ${
            sc.life ? 'border-ink bg-ink' : 'border-ink/30 bg-paper-2'
          }`}
        />
      </div>

      {/* numeric readout */}
      <div className="flex items-center gap-2">
        {sc.kind === 'life' ? (
          <Txt label className="text-[12px] font-bold text-accent">{t('life', lang)}</Txt>
        ) : sc.kind === 'fine' ? (
          <Txt label className="text-[12px] text-ink-2">{t('fine', lang)}</Txt>
        ) : sc.kind === 'none' ? (
          <span className="font-mono text-[12px] text-ink-mute">—</span>
        ) : (
          <span className="flex items-baseline gap-1">
            <span className="font-mono text-[12px] font-bold text-ink">{sc.label}</span>
            <Txt label className="text-[11px] text-ink-mute">
              {sc.kind === 'months' ? t('months', lang) : t('years', lang)}
            </Txt>
          </span>
        )}
        {/* life-as-option marker on a custodial clause */}
        {sc.kind !== 'life' && sc.life && (
          <Txt label className="text-[10px] font-bold text-accent">{`+ ${t('life', lang)}`}</Txt>
        )}
        {/* fine-as-option marker on a custodial clause */}
        {sc.kind !== 'fine' && penalty.fineAvailable && (
          <Txt label className="text-[10px] text-ink-mute">{`+ ${t('fine', lang)}`}</Txt>
        )}
      </div>
    </div>
  );
}
