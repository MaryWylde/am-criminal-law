import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useConsole } from '../console-context';
import type { Article, Lang } from '../types';
import {
  byNumber, crumbFor, pick, sevClass, referencedBy,
  CATEGORY_TAG, CATEGORY_DESC, SEV_LABEL, aggTermLabel,
} from '../lib/articles';
import { t, CAT_KEY, type StringKey } from '../lib/i18n';
import { Txt } from '../components/txt';
import { SevTag } from '../components/sev-tag';
import { SeverityStars } from '../components/severity-stars';
import { SeverityGauge } from '../components/severity-gauge';
import { BookmarkButton } from '../components/bookmark-button';

type Tab = 'text' | 'general' | 'related' | 'amendments';

const TABS: { id: Tab; key: StringKey }[] = [
  { id: 'text', key: 'tabText' },
  { id: 'general', key: 'tabGeneral' },
  { id: 'related', key: 'tabRelated' },
  { id: 'amendments', key: 'tabAmendments' },
];

/** One article = one paper sheet in the selected language. */
export function ArticlePanel() {
  const { lang } = useConsole();
  const { articleNumber } = useParams();
  const [tab, setTab] = useState<Tab>('text');

  const num = articleNumber ? Number(articleNumber) : NaN;
  const article = Number.isFinite(num) ? byNumber.get(num) : undefined;

  if (!article) {
    return (
      <Sheet>
        <div className="flex flex-1 items-center justify-center p-10">
          <div className="border-2 border-ink bg-paper-2 px-8 py-6 text-center">
            <p className="gta-outline font-display text-[64px] leading-none">404</p>
            <Txt label className="mt-2 block text-[11px] font-bold tracking-[0.25em] text-accent">
              {t('notFound', lang)}
            </Txt>
            <p className="mt-1 font-mono text-[11px] text-ink-mute">
              {t('art', lang)} {articleNumber}
            </p>
            <Link viewTransition to={`/${lang}`} className="mt-4 inline-block border-2 border-ink px-3 py-1 text-[11px] font-bold tracking-widest hover:bg-ink hover:text-paper">
              <Txt label>{`← ${t('backToContents', lang)}`}</Txt>
            </Link>
          </div>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet key={article.number}>
      <ArticleSheet article={article} lang={lang} tab={tab} setTab={setTab} />
    </Sheet>
  );
}

function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <article className="sheet-vt sheet-enter paper-grain panel-frame panel-shadow flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-paper text-ink">
      {children}
    </article>
  );
}

function ArticleSheet({
  article, lang, tab, setTab,
}: {
  article: Article;
  lang: Lang;
  tab: Tab;
  setTab: (t: Tab) => void;
}) {
  const crumb = crumbFor(article.number);
  const agg = article.penaltyAggregate;
  const sc = sevClass(agg);

  return (
    <>
      {/* breadcrumb + actions */}
      <div className="flex shrink-0 items-center gap-2 px-4 pt-4 sm:px-6">
        {crumb && (
          <nav className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] font-bold tracking-[0.12em] text-ink-2">
            <Crumb label={`${t('part', lang)} ${crumb.partNum}`} title={pick(crumb.partLabel, lang)} />
            <Sep />
            <Crumb label={`${t('section', lang)} ${crumb.secNum}`} title={pick(crumb.secLabel, lang)} />
            <Sep />
            <Crumb label={`${t('chapter', lang)} ${crumb.chapNum}`} title={pick(crumb.chapLabel, lang)} />
            <Sep />
            <span className="text-accent"><Txt label>{`${t('article', lang)} ${article.number}`}</Txt></span>
          </nav>
        )}
        <BookmarkButton n={article.number} />
      </div>

      {/* hero */}
      <div className="relative shrink-0 overflow-hidden border-b-2 border-ink">
        <div className="hero-art absolute right-0 top-0 h-[120px] w-[58%] sm:inset-y-0 sm:h-auto sm:w-[60%]" aria-hidden />
        <div className="relative px-4 pb-5 pt-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-block -skew-x-6 bg-ink px-2.5 py-1">
              <Txt display className="block skew-x-6 text-[13px] uppercase leading-none tracking-wider text-paper">
                {t('article', lang)}
              </Txt>
            </span>
            <SeverityStars sc={sc} lang={lang} />
          </div>
          <div className="gta-outline font-display mt-1 text-[72px] leading-[0.95] sm:text-[96px]">
            {article.number}
          </div>
          <Txt display className="mt-3 block text-[22px] leading-[1.08] sm:max-w-[62%] sm:text-[27px]">
            {pick(article.title, lang)}
          </Txt>
        </div>
      </div>

      {/* tabs */}
      <div role="tablist" className="mx-4 mt-4 flex shrink-0 flex-wrap border-2 border-ink sm:mx-6">
        {TABS.map((tb) => {
          const active = tb.id === tab;
          return (
            <button
              key={tb.id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setTab(tb.id)}
              className={`border-r-2 border-ink px-3 py-2 text-[10px] font-bold tracking-[0.15em] transition-colors last:border-r-0 sm:px-4 sm:text-[11px] ${
                active ? 'bg-accent text-accent-ink' : 'bg-paper-2 text-ink hover:bg-paper-3'
              }`}
            >
              <Txt label>{t(tb.key, lang)}</Txt>
            </button>
          );
        })}
      </div>

      <div className="flex-1 px-4 pb-6 pt-5 sm:px-6">
        {tab === 'text' && <TextTab article={article} lang={lang} />}
        {tab === 'general' && <GeneralTab article={article} lang={lang} />}
        {tab === 'related' && <RelatedTab article={article} lang={lang} />}
        {tab === 'amendments' && <AmendmentsTab article={article} lang={lang} />}
      </div>

      {/* readout strip */}
      <div className="mt-auto grid shrink-0 grid-cols-3 border-t-2 border-ink sm:grid-cols-5">
        <Stat k={t('type', lang)} v={typeLabel(agg.type, lang)} />
        <Stat k={t('term', lang)} v={aggTermLabel(agg)} />
        <Stat k={t('life', lang)} v={agg.life ? t('yes', lang) : t('no', lang)} accent={agg.life} />
        <Stat k={t('fine', lang)} v={agg.fineAvailable ? t('avail', lang) : t('no', lang)} accent={agg.fineAvailable} />
        <Stat k={t('severity', lang)} v={sc === 'NONE' ? '—' : `${sc} · ${SEV_LABEL[sc][lang] ?? ''}`} accent={sc === 'EG'} />
      </div>
    </>
  );
}

function typeLabel(type: Article['penaltyAggregate']['type'], lang: Lang): string {
  return t(type === 'prison' ? 'typePrison' : type === 'fine' ? 'typeFine' : 'typeOther', lang);
}

function Crumb({ label, title }: { label: string; title: string }) {
  return (
    <span title={title} className="cursor-help">
      <Txt label>{label}</Txt>
    </span>
  );
}

function Sep() {
  return <span className="text-ink-mute">›</span>;
}

function Section({
  index, label, children,
}: { index?: number; label: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h3 className="brut-label mb-3 flex items-baseline gap-2 border-b-2 border-ink/80 pb-1.5 font-mono text-[12px] font-bold tracking-[0.15em] text-ink">
        {index != null && <span>§ {index}.</span>}
        <Txt label>{label}</Txt>
      </h3>
      {children}
    </section>
  );
}

function Stat({ k, v, accent = false }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="border-r-2 border-ink/70 px-3 py-2.5 last:border-r-0 sm:px-4 [&:nth-child(3)]:border-r-0 sm:[&:nth-child(3)]:border-r-2 [&:nth-child(n+4)]:border-t-2 sm:[&:nth-child(n+4)]:border-t-0">
      <Txt label className="brut-label block text-[9px] font-bold tracking-[0.2em] text-ink-mute">{k}</Txt>
      <Txt label className={`mt-0.5 block truncate text-[13px] font-bold ${accent ? 'text-accent' : 'text-ink'}`}>{v}</Txt>
    </div>
  );
}

/* ----------------------------------------------------------------- tabs -- */

function TextTab({ article, lang }: { article: Article; lang: Lang }) {
  return (
    <>
      <Section index={1} label={t('penaltyByClause', lang)}>
        {article.penalties.length === 0 ? (
          <Txt className="block pl-1 text-[12px] text-ink-mute">{t('noSanction', lang)}</Txt>
        ) : (
          <div className="flex flex-col gap-2.5">
            {article.penalties.map((p) => (
              <SeverityGauge key={p.clause} penalty={p} lang={lang} />
            ))}
          </div>
        )}
      </Section>

      <Section index={2} label={t('provisions', lang)}>
        <ol className="flex flex-col gap-5">
          {article.provisions.map((p, i) => (
            <li key={p.marker} className="flex gap-4">
              <span className="font-display grid h-8 w-8 shrink-0 place-items-center bg-ink text-[15px] leading-none text-paper">
                {p.marker.replace(/\.$/, '') || i + 1}
              </span>
              <Txt className="block flex-1 pt-0.5 text-[13.5px] leading-[1.75] text-ink-2">
                {pick(p.text, lang)}
              </Txt>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}

function GeneralTab({ article, lang }: { article: Article; lang: Lang }) {
  const crumb = crumbFor(article.number);
  const agg = article.penaltyAggregate;
  const sc = sevClass(agg);
  return (
    <>
      <Section index={1} label={t('classification', lang)}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="border-2 border-ink px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.2em]">
              {CATEGORY_TAG[article.category]}
            </span>
            <Txt label className="text-[11px] font-bold tracking-wider text-ink-2">
              {t(CAT_KEY[article.category], lang)}
            </Txt>
          </div>
          <Txt className="block text-[13px] leading-relaxed text-ink-2">
            {CATEGORY_DESC[article.category][lang] ?? ''}
          </Txt>
          <div className="flex flex-wrap items-center gap-4">
            <SevTag sc={sc} lang={lang} />
            <SeverityStars sc={sc} lang={lang} size={18} />
          </div>
        </div>
      </Section>

      {crumb && (
        <Section index={2} label={t('hierarchy', lang)}>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[13px]">
            <Row k={`${t('part', lang)} ${crumb.partNum}`} v={pick(crumb.partLabel, lang)} />
            <Row k={`${t('section', lang)} ${crumb.secNum}`} v={pick(crumb.secLabel, lang)} />
            <Row k={`${t('chapter', lang)} ${crumb.chapNum}`} v={pick(crumb.chapLabel, lang)} />
          </dl>
        </Section>
      )}

      <Section index={3} label={t('envelope', lang)}>
        <Txt className="mb-3 block text-[12px] leading-relaxed text-ink-mute">{t('envelopeNote', lang)}</Txt>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[13px]">
          <Row k={t('type', lang)} v={typeLabel(agg.type, lang)} />
          <Row k={t('term', lang)} v={aggTermLabel(agg)} mono />
          <Row k={t('life', lang)} v={agg.life ? t('yes', lang) : t('no', lang)} accent={agg.life} />
          <Row k={t('fine', lang)} v={agg.fineAvailable ? t('avail', lang) : t('no', lang)} accent={agg.fineAvailable} />
        </dl>
      </Section>
    </>
  );
}

function Row({
  k, v, mono = false, accent = false,
}: { k: string; v: string; mono?: boolean; accent?: boolean }) {
  return (
    <>
      <dt className="font-mono text-[10px] font-bold tracking-[0.15em] text-ink-mute">
        <Txt label>{k}</Txt>
      </dt>
      <dd className={`m-0 ${accent ? 'font-bold text-accent' : 'text-ink'}`}>
        <Txt label={mono}>{v}</Txt>
      </dd>
    </>
  );
}

function RelatedTab({ article, lang }: { article: Article; lang: Lang }) {
  const outgoing = article.refs
    .map((r) => Number(r.match(/(\d+)/)?.[1]))
    .filter((n) => Number.isFinite(n) && byNumber.has(n) && n !== article.number);
  const incoming = referencedBy(article.number);
  return (
    <>
      <Section index={1} label={t('crossRefs', lang)}>
        {outgoing.length === 0 ? (
          <Txt className="block text-[12px] text-ink-mute">{t('noRefs', lang)}</Txt>
        ) : (
          <RefGrid nums={outgoing} lang={lang} />
        )}
      </Section>
      <Section index={2} label={t('referencedBy', lang)}>
        {incoming.length === 0 ? (
          <Txt className="block text-[12px] text-ink-mute">{t('noBackRefs', lang)}</Txt>
        ) : (
          <RefGrid nums={incoming} lang={lang} />
        )}
      </Section>
    </>
  );
}

function RefGrid({ nums, lang }: { nums: number[]; lang: Lang }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {nums.map((n) => {
        const a = byNumber.get(n);
        if (!a) return null;
        return (
          <li key={n}>
            <Link
              viewTransition
              to={`/${lang}/${n}`}
              className="group flex items-center gap-3 border border-ink/60 bg-paper-2 px-3 py-2 hover:border-accent hover:bg-paper"
            >
              <span className="font-display text-[16px] leading-none text-ink group-hover:text-accent">
                {n}
              </span>
              <Txt className="min-w-0 flex-1 truncate text-[12px] text-ink-2">{pick(a.title, lang)}</Txt>
              <SevTag sc={sevClass(a.penaltyAggregate)} lang={lang} small />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function AmendmentsTab({ article, lang }: { article: Article; lang: Lang }) {
  return (
    <Section index={1} label={t('compare2003', lang)}>
      {article.comparison2003 ? (
        <Txt className="block border-l-4 border-accent pl-4 text-[13.5px] leading-[1.75] text-ink-2">
          {article.comparison2003}
        </Txt>
      ) : (
        <div className="border-2 border-dashed border-ink/40 px-4 py-5">
          <Txt className="block text-[12px] font-bold text-ink-2">{t('noAmendments', lang)}</Txt>
          <Txt className="mt-1.5 block text-[12px] leading-relaxed text-ink-mute">{t('amendmentsHint', lang)}</Txt>
        </div>
      )}
    </Section>
  );
}
