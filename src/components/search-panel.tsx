import { Link, useParams } from 'react-router-dom';
import { useConsole } from '../console-context';
import type { Article, Lang } from '../types';
import { pick, sevClass, aggTermLabel } from '../lib/articles';
import { t } from '../lib/i18n';
import { Txt } from './txt';
import { SevTag } from './sev-tag';
import { BookmarkButton } from './bookmark-button';

/** SEARCH tab: the flat, relevance-ranked hit list for the current query +
 *  filters. The filters themselves sit in the header (FilterDeck). */
export function SearchPanel() {
  const { filtered, total, searching, lang, query } = useConsole();
  const { articleNumber } = useParams();
  const selected = articleNumber ? Number(articleNumber) : null;

  if (filtered.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="font-mono text-2xl font-bold text-side-mute">0 / {total}</p>
        <Txt label className="mt-1 block text-[10px] tracking-[0.25em] text-side-dim">
          {t('noMatch', lang)}
        </Txt>
        {searching && (
          <p className="mt-2 truncate font-mono text-[11px] text-side-mute">
            “<Txt>{query}</Txt>”
          </p>
        )}
      </div>
    );
  }

  return (
    <ul className="py-1">
      {filtered.map((a) => (
        <HitRow key={a.number} article={a} lang={lang} active={selected === a.number} />
      ))}
    </ul>
  );
}

function HitRow({
  article, lang, active,
}: { article: Article; lang: Lang; active: boolean }) {
  const sc = sevClass(article.penaltyAggregate);
  return (
    <li>
      <Link
        viewTransition
        to={`/${lang}/${article.number}`}
        aria-current={active ? 'page' : undefined}
        className={`flex items-center gap-2 border-l-[3px] py-1.5 pl-3 pr-2 ${
          active
            ? 'border-accent bg-side-2 text-side-text'
            : 'border-transparent text-side-dim hover:bg-side-2 hover:text-side-text'
        }`}
      >
        <span className={`w-[64px] shrink-0 font-mono text-[11px] font-bold ${active ? 'text-accent' : ''}`}>
          <Txt label>{`${t('art', lang)} ${article.number}`}</Txt>
        </span>
        <Txt className="min-w-0 flex-1 truncate text-[11px] leading-tight">
          {pick(article.title, lang)}
        </Txt>
        <span className="hidden w-12 shrink-0 text-right font-mono text-[10px] text-side-mute sm:inline">
          {aggTermLabel(article.penaltyAggregate)}
        </span>
        <SevTag sc={sc} lang={lang} small onDark />
        <BookmarkButton n={article.number} onDark />
      </Link>
    </li>
  );
}
