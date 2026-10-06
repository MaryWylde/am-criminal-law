import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useConsole } from '../console-context';
import type { Article, Lang, TreePart } from '../types';
import { chapCount, crumbFor, partCount, pick, secCount, sevClass } from '../lib/articles';
import { t } from '../lib/i18n';
import { Txt } from './txt';
import { SevTag } from './sev-tag';
import { BookmarkButton } from './bookmark-button';

export function SidebarTree() {
  const { tree, total, lang, searching, filtersActive } = useConsole();
  const { articleNumber } = useParams();
  const selected = articleNumber ? Number(articleNumber) : null;

  // When a subset is shown (search/filter), expand everything; otherwise let
  // the user drill down, but always reveal the path to the selected article.
  const expandAll = searching || filtersActive;
  const [open, setOpen] = useState<Set<string>>(new Set());
  const crumb = selected != null ? crumbFor(selected) : undefined;

  const isOpen = (key: string, autoKeys: string[]) =>
    expandAll || open.has(key) || autoKeys.includes(key);
  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const autoKeys = crumb
    ? [`p:${crumb.partNum}`, `s:${crumb.secNum}`, `c:${crumb.chapNum}`]
    : [];
  const activePart = crumb?.partNum ?? null;

  if (tree.length === 0) {
    return (
      <p className="px-4 py-8 text-center font-mono text-[11px] text-side-mute">
        0 / {total} — <Txt label>{t('noMatch', lang)}</Txt>
      </p>
    );
  }

  return (
    <nav>
      {tree.map((part) => (
        <PartNode
          key={part.num}
          part={part}
          lang={lang}
          selected={selected}
          activePart={activePart === part.num}
          isOpen={isOpen}
          toggle={toggle}
          autoKeys={autoKeys}
        />
      ))}
    </nav>
  );
}

function PartNode({
  part, lang, selected, activePart, isOpen, toggle, autoKeys,
}: {
  part: TreePart;
  lang: Lang;
  selected: number | null;
  activePart: boolean;
  isOpen: (k: string, a: string[]) => boolean;
  toggle: (k: string) => void;
  autoKeys: string[];
}) {
  const key = `p:${part.num}`;
  const expanded = isOpen(key, autoKeys);
  return (
    <div className="border-b border-side-line">
      <button
        type="button"
        onClick={() => toggle(key)}
        aria-expanded={expanded}
        className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
          activePart
            ? 'bg-accent text-accent-ink'
            : 'text-side-text hover:bg-side-2'
        }`}
      >
        <Chevron open={expanded} />
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block font-mono text-[12px] font-bold tracking-[0.15em]">
            <Txt label>{`${t('part', lang)} ${part.num}`}</Txt>
          </span>
          <Txt className={`block truncate text-[10px] tracking-wider ${activePart ? 'opacity-90' : 'text-side-dim'}`}>
            {pick(part.label, lang)}
          </Txt>
        </span>
        <span className={`shrink-0 font-mono text-[11px] ${activePart ? 'opacity-90' : 'text-side-dim'}`}>
          {partCount(part)}
        </span>
      </button>

      {expanded &&
        part.sections.map((sec) => {
          const sKey = `s:${sec.num}`;
          const sExp = isOpen(sKey, autoKeys);
          return (
            <div key={sec.num}>
              <button
                type="button"
                onClick={() => toggle(sKey)}
                aria-expanded={sExp}
                className="flex w-full items-center gap-3 border-t border-side-line bg-side-2/60 py-1.5 pl-4 pr-3 text-left hover:bg-side-2"
              >
                <Chevron open={sExp} dim />
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="mr-1.5 font-mono text-[9px] font-bold tracking-[0.15em] text-side-dim">
                    <Txt label>{`${t('section', lang)} ${sec.num}`}</Txt>
                  </span>
                  <Txt className="block truncate text-[10px] text-side-dim">
                    {pick(sec.label, lang)}
                  </Txt>
                </span>
                <span className="shrink-0 font-mono text-[10px] text-side-mute">
                  {secCount(sec)}
                </span>
              </button>

              {sExp &&
                sec.chapters.map((chap) => {
                  const cKey = `c:${chap.num}`;
                  const cExp = isOpen(cKey, autoKeys);
                  return (
                    <div key={chap.num}>
                      <button
                        type="button"
                        onClick={() => toggle(cKey)}
                        aria-expanded={cExp}
                        className="flex w-full items-center gap-3 border-t border-side-line py-2 pl-4 pr-3 text-left hover:bg-side-2"
                      >
                        <PlusMinus open={cExp} />
                        <span className="min-w-0 flex-1 leading-tight">
                          <span className="block font-mono text-[11px] font-bold tracking-[0.15em] text-accent">
                            <Txt label>{`${t('chapter', lang)} ${chap.num}`}</Txt>
                          </span>
                          <Txt className="block truncate text-[10px] text-side-dim">
                            {pick(chap.label, lang)}
                          </Txt>
                        </span>
                        <span className="shrink-0 font-mono text-[10px] text-side-dim">
                          {chapCount(chap)}
                        </span>
                      </button>
                      {cExp && (
                        <div className="border-t border-side-line py-1">
                          {chap.articles.map((a) => (
                            <ArticleRow
                              key={a.number}
                              article={a}
                              lang={lang}
                              active={selected === a.number}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          );
        })}
    </div>
  );
}

function Chevron({ open, dim = false }: { open: boolean; dim?: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" aria-hidden
      className={`shrink-0 transition-transform ${open ? 'rotate-90' : ''} ${dim ? 'opacity-60' : ''}`}
    >
      <path d="M3.5 1.5L8 6l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusMinus({ open }: { open: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className="shrink-0 text-side-text">
      <path d="M1.5 6h9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {!open && <path d="M6 1.5v9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />}
    </svg>
  );
}

function ArticleRow({
  article, lang, active,
}: { article: Article; lang: Lang; active: boolean }) {
  const sc = sevClass(article.penaltyAggregate);
  return (
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
      <span className={`w-3 shrink-0 font-mono text-[11px] font-bold ${active ? 'text-accent' : 'text-transparent'}`}>
        ›
      </span>
      <span className={`w-[64px] shrink-0 font-mono text-[11px] font-bold ${active ? 'text-side-text' : ''}`}>
        <Txt label>{`${t('art', lang)} ${article.number}`}</Txt>
      </span>
      <Txt className="min-w-0 flex-1 truncate text-[11px] leading-tight">
        {pick(article.title, lang)}
      </Txt>
      <SevTag sc={sc} lang={lang} small onDark />
      <BookmarkButton n={article.number} onDark />
    </Link>
  );
}
