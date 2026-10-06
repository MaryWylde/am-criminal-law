import { useConsole } from '../console-context';
import { t } from '../lib/i18n';

/** Bookmark toggle. Stops propagation so it can sit inside a row link. */
export function BookmarkButton({
  n, onDark = false, className = '',
}: { n: number; onDark?: boolean; className?: string }) {
  const { isBookmarked, toggleBookmark, lang } = useConsole();
  const on = isBookmarked(n);
  const label = on ? t('bookmarked', lang) : t('bookmark', lang);
  const idle = onDark ? 'text-side-mute hover:text-side-text' : 'text-ink-mute hover:text-ink';
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(n);
      }}
      className={`grid h-6 w-6 shrink-0 place-items-center transition-colors ${
        on ? 'text-accent' : idle
      } ${className}`}
    >
      <svg width="12" height="15" viewBox="0 0 12 15" aria-hidden>
        <path
          d="M1 1h10v13l-5-3.5L1 14z"
          fill={on ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
