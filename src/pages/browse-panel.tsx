import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Link } from 'react-router-dom';
import { useConsole } from '../console-context';
import type { Article, Lang } from '../types';
import { pick, sevClass, aggTermLabel, hasArmenian, STATS } from '../lib/articles';
import { t, CAT_KEY } from '../lib/i18n';
import { Txt } from '../components/txt';
import { SevTag } from '../components/sev-tag';
import { BookmarkButton } from '../components/bookmark-button';

/** No article selected. Idle = the open title screen (no paper sheet, the
 *  skyline shows through); a live search/filter or a zero result brings the
 *  paper sheet in. */
export function BrowsePanel() {
  const { lang, filtered, total, searching, filtersActive, query } = useConsole();

  if (!searching && !filtersActive) {
    return <Landing lang={lang} />;
  }

  return (
    <section className="sheet-vt sheet-enter paper-grain panel-frame panel-shadow flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-paper text-ink">
      {filtered.length === 0 ? (
        <Empty lang={lang} total={total} query={searching ? query : null} />
      ) : (
        <Results lang={lang} list={filtered} total={total} query={searching ? query : null} />
      )}
    </section>
  );
}

/* ------------------------------------------------------------- landing -- */

function Landing({ lang }: { lang: Lang }) {
  const { setQuery, setSidebarTab } = useConsole();
  const inputRef = useRef<HTMLInputElement>(null);
  // The hero search holds a local draft: typing never changes the page. The
  // arrow (or Enter) commits it, inside a view transition so the results
  // sheet fades in instead of snapping.
  const [draft, setDraft] = useState('');
  const ready = draft.trim().length > 0;
  const armInput = hasArmenian(draft) || (draft === '' && lang === 'hy');

  const commit = () => {
    if (!ready) {
      inputRef.current?.focus();
      return;
    }
    const apply = () => {
      flushSync(() => {
        setQuery(draft);
        setSidebarTab('search');
      });
    };
    if (typeof document.startViewTransition === 'function') {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  };

  const stats: { v: number; k: string; icon: IconName }[] = [
    { v: STATS.articles, k: t('statArticles', lang), icon: 'book' },
    { v: STATS.chapters, k: t('statChapters', lang), icon: 'doc' },
    { v: STATS.life, k: t('statLife', lang), icon: 'scales' },
    { v: STATS.fine, k: t('statFine', lang), icon: 'gavel' },
  ];

  return (
    <section className="sheet-vt landing-stage flex min-h-0 min-w-0 flex-1 flex-col justify-end overflow-y-auto px-2 pb-2 text-stage-text sm:px-6 sm:pb-6">
      <div className="flex flex-col gap-5 sm:gap-7">
        {/* title */}
        <div>
          <Txt display className="gta-wordmark block max-w-[18ch] text-[34px] uppercase leading-[0.95] sm:text-[52px] lg:text-[64px]">
            {t('landingTitle', lang)}
          </Txt>
          <Txt className="stage-copy mt-4 block max-w-[52ch] text-[13px] leading-relaxed sm:text-[14px]">
            {t('landingLead', lang)}
          </Txt>
        </div>

        {/* hero search */}
        <form
          className="hero-search flex h-14 max-w-[760px] items-stretch overflow-hidden"
          onSubmit={(e) => {
            e.preventDefault();
            commit();
          }}
        >
          <label className="flex min-w-0 flex-1 items-center gap-3 px-4">
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden className="shrink-0 text-ink">
              <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
              <path d="M13 13l5 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              data-search-input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t('searchPlaceholder', lang)}
              spellCheck={false}
              autoComplete="off"
              aria-label="Search the criminal code"
              className={`min-w-0 flex-1 bg-transparent text-[14px] text-ink caret-accent outline-none placeholder:text-ink-mute ${
                armInput ? 'font-arm' : 'font-label'
              }`}
            />
          </label>
          <button
            type="submit"
            aria-label={t('searchGo', lang)}
            title={t('searchGo', lang)}
            className={`grid w-16 shrink-0 place-items-center bg-accent text-accent-ink transition-colors hover:bg-accent-dark ${
              ready ? 'arrow-nudge' : ''
            }`}
          >
            <svg width="26" height="20" viewBox="0 0 26 20" aria-hidden className="arrow-icon">
              <path d="M2 10h20M15 3l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>

        {/* stat tiles */}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.k} className="tile flex items-center gap-4 px-4 py-4 sm:px-5">
              <Icon name={s.icon} />
              <div className="min-w-0 leading-none">
                <div className="font-display text-[30px] leading-none text-side-text sm:text-[36px]">{s.v}</div>
                <Txt label className="brut-label mt-1.5 block truncate text-[9px] font-bold tracking-[0.25em] text-side-dim sm:text-[10px]">
                  {s.k}
                </Txt>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type IconName = 'book' | 'doc' | 'scales' | 'gavel';

function Icon({ name }: { name: IconName }) {
  const common = {
    width: 40, height: 40, viewBox: '0 0 40 40', fill: 'none',
    stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
    'aria-hidden': true, className: 'shrink-0 text-side-text',
  };
  switch (name) {
    case 'book':
      return (
        <svg {...common}>
          <path d="M20 11c-3-3-8-3-13-2v21c5-1 10-1 13 2 3-3 8-3 13-2V9c-5-1-10-1-13 2z" />
          <path d="M20 11v21" />
        </svg>
      );
    case 'doc':
      return (
        <svg {...common}>
          <path d="M11 6h12l7 7v21H11z" />
          <path d="M23 6v7h7M16 20h10M16 26h10" />
        </svg>
      );
    case 'scales':
      return (
        <svg {...common}>
          <path d="M20 7v26M12 33h16M8 13h24" />
          <path d="M12 13l-5 11h10zM28 13l-5 11h10z" />
        </svg>
      );
    case 'gavel':
      return (
        <svg {...common}>
          <path d="M14 12l8-8 10 10-8 8z" />
          <path d="M18 16L6 28M8 34h18" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------- results -- */

function Results({
  lang, list, total, query,
}: { lang: Lang; list: Article[]; total: number; query: string | null }) {
  return (
    <>
      <div className="flex shrink-0 flex-wrap items-baseline gap-x-3 gap-y-1 border-b-2 border-ink px-5 py-4 sm:px-8">
        <span className="gta-outline font-display text-[36px] leading-none">{list.length}</span>
        <span className="font-mono text-[11px] text-ink-mute">/ {total}</span>
        <Txt label className="text-[11px] font-bold tracking-[0.2em] text-ink">
          {query ? t('results', lang) : t('records', lang)}
        </Txt>
        {query && (
          <span className="flex min-w-0 items-baseline gap-1 font-mono text-[11px] text-ink-mute">
            <Txt>{t('matchesFor', lang)}</Txt>
            <span className="truncate font-bold text-accent">“<Txt>{query}</Txt>”</span>
          </span>
        )}
      </div>
      <ul className="px-5 pb-6 sm:px-8">
        {list.map((a) => (
          <ResultRow key={a.number} article={a} lang={lang} />
        ))}
      </ul>
    </>
  );
}

function ResultRow({ article, lang }: { article: Article; lang: Lang }) {
  const sc = sevClass(article.penaltyAggregate);
  return (
    <li>
      <Link
        viewTransition
        to={`/${lang}/${article.number}`}
        className="group flex items-center gap-3 border-b border-ink/30 py-2.5 hover:bg-paper-2"
      >
        <span className="font-display w-14 shrink-0 text-[20px] leading-none text-ink group-hover:text-accent">
          {article.number}
        </span>
        <Txt className="min-w-0 flex-1 truncate text-[13px] text-ink">
          {pick(article.title, lang)}
        </Txt>
        <span className="hidden shrink-0 border border-ink/50 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wider text-ink-2 md:inline">
          <Txt label>{t(CAT_KEY[article.category], lang)}</Txt>
        </span>
        <span className="hidden w-14 shrink-0 text-right font-mono text-[11px] text-ink-mute sm:inline">
          {aggTermLabel(article.penaltyAggregate)}
        </span>
        <SevTag sc={sc} lang={lang} small />
        <BookmarkButton n={article.number} />
      </Link>
    </li>
  );
}

function Empty({ lang, total, query }: { lang: Lang; total: number; query: string | null }) {
  return (
    <div className="flex flex-1 items-center justify-center p-10">
      <div className="max-w-md text-center">
        <p className="gta-outline font-display text-[88px] leading-none">0</p>
        <p className="font-mono text-[12px] text-ink-mute">/ {total}</p>
        <Txt label className="mt-3 block text-[12px] font-bold tracking-[0.25em] text-accent">
          {t('noMatch', lang)}
        </Txt>
        {query && (
          <p className="mt-2 truncate font-mono text-[12px] text-ink-2">“<Txt>{query}</Txt>”</p>
        )}
        <Txt className="mt-3 block text-[12px] leading-relaxed text-ink-mute">{t('noMatchLead', lang)}</Txt>
      </div>
    </div>
  );
}
