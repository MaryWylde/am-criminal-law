import type { Lang } from '../types';
import type { SevClass } from '../lib/articles';
import { SEV_LABEL, SEV_STARS } from '../lib/articles';
import { t } from '../lib/i18n';
import { Txt } from './txt';

/** Five-star severity meter for the selected article — a straight read of
 *  its severity class (see SEV_STARS). Display-only. Lit stars pop in; a full
 *  5/5 gets the "danger" treatment (slam + glow) — see index.css. */
export function SeverityStars({
  sc, lang, size = 16, showLabel = true, onDark = false, className = '',
}: {
  sc: SevClass;
  lang: Lang;
  size?: number;
  showLabel?: boolean;
  onDark?: boolean;
  className?: string;
}) {
  const n = SEV_STARS[sc];
  const danger = n === 5;
  const label = SEV_LABEL[sc][lang] ?? '';
  const empty = onDark ? 'text-side-mute' : 'text-ink-mute/70';
  const labelTone = danger
    ? 'text-accent'
    : onDark ? 'text-side-dim' : 'text-ink-2';
  return (
    <span
      role="img"
      aria-label={`${t('severity', lang)}: ${n}/5 — ${label}`}
      title={`${n}/5 — ${label}`}
      className={`inline-flex items-center gap-2 ${danger ? 'stars-danger' : ''} ${className}`}
    >
      <span className="inline-flex items-center gap-[3px]">
        {Array.from({ length: 5 }, (_, i) => {
          const lit = i < n;
          return (
            <svg
              key={i}
              width={size}
              height={size}
              viewBox="0 0 24 24"
              aria-hidden
              className={lit ? 'star-lit text-accent' : empty}
              style={lit ? { animationDelay: `${i * 70}ms, ${620 + i * 120}ms` } : undefined}
            >
              <path
                d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"
                fill={lit ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          );
        })}
      </span>
      {showLabel && (
        <Txt label className={`stars-label hidden text-[10px] font-bold tracking-[0.15em] sm:inline ${labelTone}`}>
          {sc === 'NONE' ? `0/5` : `${n}/5 · ${label}`}
        </Txt>
      )}
    </span>
  );
}
