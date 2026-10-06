import type { Lang } from '../types';
import type { SevClass } from '../lib/articles';
import { SEV_LABEL } from '../lib/articles';
import { Txt } from './txt';

/** Severity stamp (display-only). EG is the solid red stamp, GR a red outline,
 *  the lesser tiers step down through ink → mute. `small` = code-only square
 *  for list rows; `onDark` flips the palette for the sidebar. */

const PAPER: Record<SevClass, string> = {
  EG: 'border-accent bg-accent text-accent-ink',
  GR: 'border-accent text-accent',
  MD: 'border-ink text-ink',
  MN: 'border-ink-mute text-ink-2',
  FINE: 'border-dashed border-ink-mute text-ink-mute',
  NONE: 'border-line text-ink-mute',
};

const DARK: Record<SevClass, string> = {
  EG: 'border-accent bg-accent text-accent-ink',
  GR: 'border-accent text-accent',
  MD: 'border-side-dim text-side-text',
  MN: 'border-side-mute text-side-dim',
  FINE: 'border-dashed border-side-mute text-side-dim',
  NONE: 'border-side-line text-side-mute',
};

export function SevTag({
  sc, lang, small = false, onDark = false,
}: { sc: SevClass; lang: Lang; small?: boolean; onDark?: boolean }) {
  if (sc === 'NONE' && small) return null;
  const label = SEV_LABEL[sc][lang] ?? '';
  const tone = onDark ? DARK[sc] : PAPER[sc];

  if (small) {
    return (
      <span
        title={label}
        className={`shrink-0 border px-1 font-mono text-[9px] font-bold leading-[1.5] tracking-wider ${tone}`}
      >
        {sc}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 border-2 px-2 py-0.5 ${tone}`}>
      <span className="font-mono text-[10px] font-bold tracking-[0.2em]">{sc}</span>
      <Txt label className="text-[10px] font-bold tracking-wider">{label}</Txt>
    </span>
  );
}
