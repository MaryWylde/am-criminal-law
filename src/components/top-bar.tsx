import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useConsole } from '../console-context';
import { hasArmenian } from '../lib/articles';
import { t } from '../lib/i18n';
import { LanguageSwitcher } from './language-switcher';
import { ThemeSwitcher } from './theme-switcher';
import { FilterDeck } from './filter-deck';
import { countActiveFilters } from '../lib/filters';
import { Txt } from './txt';

/** The title-screen header: wordmark over the skyline, the search box and the
 *  filter deck side by side under it, switches top-right. On phones the deck
 *  folds behind a FILTERS toggle beside the search box. */
export function TopBar({
  navOpen = false,
  onToggleNav,
}: {
  navOpen?: boolean;
  onToggleNav?: () => void;
}) {
  const { query, setQuery, filtered, total, lang, filters, searching, filtersActive } = useConsole();
  const { articleNumber } = useParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [deckOpen, setDeckOpen] = useState(false);
  const activeFilters = countActiveFilters(filters);

  // Idle title screen: nothing open, nothing searched. The landing's own hero
  // search takes over, so the header search row steps aside.
  const idle = !articleNumber && !searching && !filtersActive;

  // "/" focuses whichever search prompt is on screen (header or hero);
  // Esc clears it.
  useEffect(() => {
    const visibleInput = () =>
      Array.from(document.querySelectorAll<HTMLInputElement>('[data-search-input]'))
        .find((el) => el.offsetParent !== null);
    const onKey = (e: KeyboardEvent) => {
      const target = visibleInput();
      if (e.key === '/' && document.activeElement !== target) {
        e.preventDefault();
        target?.focus();
      }
      if (e.key === 'Escape' && target && document.activeElement === target) {
        setQuery('');
        target.blur();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setQuery]);

  // The query (and the hy placeholder) may be Armenian, so route the input to
  // the Armenian face whenever it carries Armenian — never tofu (§4).
  const armInput = hasArmenian(query) || (query === '' && lang === 'hy');

  return (
    <header className="shrink-0 px-3 pt-3 lg:px-5 lg:pt-5">
      <div className="flex items-start gap-3 lg:gap-6">
        {/* mobile contents toggle */}
        <button
          type="button"
          onClick={onToggleNav}
          aria-label={navOpen ? t('closeMenu', lang) : t('openMenu', lang)}
          aria-expanded={navOpen}
          className="rounded-theme hard-shadow grid h-10 w-10 shrink-0 place-items-center border-2 border-side-line bg-side text-xl leading-none text-side-text lg:hidden"
        >
          {navOpen ? '✕' : '☰'}
        </button>

        {/* wordmark */}
        <div className="min-w-0 flex-1 lg:flex-none">
          <h1 className="m-0 flex flex-col leading-none">
            <span className="gta-wordmark font-display text-[26px] uppercase sm:text-[34px] lg:text-[46px]">
              Criminal
              <br className="hidden lg:block" />
              <span className="lg:hidden"> </span>
              Code
            </span>
            <span className="gta-subtitle font-black-letter mt-1 whitespace-nowrap text-[15px] sm:text-[24px] lg:mt-2 lg:text-[34px]">
              Republic of Armenia
            </span>
          </h1>
        </div>

        {/* switches + count */}
        <div className="flex shrink-0 flex-col items-end gap-2 lg:ml-auto lg:flex-row lg:items-center lg:gap-3">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <div className="hidden text-right leading-tight lg:block lg:pl-2">
            <div className="font-mono text-[13px] font-bold text-stage-text drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
              {filtered.length}
              <span className="opacity-60"> / {total}</span>
            </div>
            <Txt label className="text-[9px] tracking-[0.25em] text-stage-text opacity-70 drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
              {t('records', lang)}
            </Txt>
          </div>
        </div>
      </div>

      {/* search box + filter deck (hidden on the idle title screen) */}
      <div className={`mt-3 flex-col gap-3 lg:mt-4 lg:flex-row lg:items-start ${idle ? 'hidden' : 'flex'}`}>
        <div className="flex gap-2 lg:w-[440px] lg:shrink-0">
          <label className="rounded-theme hard-shadow flex h-11 min-w-0 flex-1 items-center gap-2 border-2 border-side-line bg-side px-3 focus-within:border-side-dim">
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden className="shrink-0 text-side-text">
              <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
              <path d="M13 13l5 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              data-search-input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder', lang)}
              spellCheck={false}
              autoComplete="off"
              aria-label="Search the criminal code"
              className={`min-w-0 flex-1 bg-transparent text-[13px] text-side-text caret-accent outline-none placeholder:text-side-dim ${
                armInput ? 'font-arm' : 'font-label'
              }`}
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="font-mono text-[10px] font-bold tracking-widest text-side-dim hover:text-side-text"
                aria-label="Clear search"
              >
                <Txt label>{`✕ ${t('clear', lang)}`}</Txt>
              </button>
            ) : (
              <span className="hidden border border-side-line px-1.5 py-0.5 font-mono text-[10px] text-side-mute lg:inline">
                /
              </span>
            )}
          </label>

          {/* mobile: fold the deck behind a toggle */}
          <button
            type="button"
            onClick={() => setDeckOpen((v) => !v)}
            aria-expanded={deckOpen}
            aria-controls="filter-deck"
            className={`rounded-theme hard-shadow flex h-11 shrink-0 items-center gap-1.5 border-2 px-3 font-mono text-[10px] font-bold tracking-[0.15em] lg:hidden ${
              deckOpen || activeFilters > 0
                ? 'border-accent bg-accent text-accent-ink'
                : 'border-side-line bg-side text-side-text'
            }`}
          >
            <Txt label>{t('filters', lang)}</Txt>
            {activeFilters > 0 && <span>{activeFilters}</span>}
          </button>
        </div>

        <FilterDeck className={`${deckOpen ? 'flex' : 'hidden'} lg:flex lg:min-w-0 lg:flex-1`} />
      </div>
    </header>
  );
}
