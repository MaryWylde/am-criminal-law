import raw from '../data/articles.json';
import type {
  Article, Bilingual, Lang, PenaltyAggregate, ClausePenalty,
  TreePart, TreeSection, TreeChapter,
} from '../types';

export const articles = raw as unknown as Article[];

export const byNumber = new Map<number, Article>(
  articles.map((a) => [a.number, a]),
);

/** Read a bilingual field for the active language, falling back to hy when the
 *  en variant is null (hierarchy labels are hy-only in the dataset). */
export function pick(field: Bilingual, lang: Lang): string {
  const v = lang === 'en' ? field.en : field.hy;
  return (v ?? field.hy ?? field.en ?? '') as string;
}

/** Is a string Armenian script (route Armenian to the Armenian font face). */
export function hasArmenian(s: string): boolean {
  return /[Ա-֏]/.test(s);
}

/** The dataset carries hierarchy labels in Armenian only. The two Parts are
 *  the one tier the sidebar leans on in English, so they get a translation. */
const PART_EN: Record<string, string> = {
  'ԸՆԴՀԱՆՈՒՐ ՄԱՍ': 'GENERAL PART',
  'ՀԱՏՈՒԿ ՄԱՍ': 'SPECIAL PART',
};

/** Build the Part -> Section -> Chapter -> Article tree, numbering each tier by
 *  first-appearance order in the (article-number-sorted) dataset. */
export function buildTree(items: Article[]): TreePart[] {
  const parts: TreePart[] = [];
  let partN = 0;
  let secN = 0;
  let chapN = 0;
  const partIdx = new Map<string, TreePart>();
  const secIdx = new Map<string, TreeSection>();
  const chapIdx = new Map<string, TreeChapter>();

  for (const a of items) {
    const pKey = a.part.hy ?? '';
    let part = partIdx.get(pKey);
    if (!part) {
      part = {
        num: ++partN,
        label: { hy: a.part.hy, en: a.part.en ?? PART_EN[a.part.hy ?? ''] ?? null },
        sections: [],
      };
      partIdx.set(pKey, part);
      parts.push(part);
    }
    const sKey = `${pKey}|${a.section.hy}`;
    let sec = secIdx.get(sKey);
    if (!sec) {
      sec = { num: ++secN, label: a.section, chapters: [] };
      secIdx.set(sKey, sec);
      part.sections.push(sec);
    }
    const cKey = `${sKey}|${a.chapter.hy}`;
    let chap = chapIdx.get(cKey);
    if (!chap) {
      chap = { num: ++chapN, label: a.chapter, articles: [] };
      chapIdx.set(cKey, chap);
      sec.chapters.push(chap);
    }
    chap.articles.push(a);
  }
  return parts;
}

/** Article counts per tier (used for sidebar badges and match ranking). */
export const chapCount = (c: TreeChapter) => c.articles.length;
export const secCount = (s: TreeSection) =>
  s.chapters.reduce((n, c) => n + chapCount(c), 0);
export const partCount = (p: TreePart) =>
  p.sections.reduce((n, s) => n + secCount(s), 0);

/** Locate an article's tier numbers for the breadcrumb. Computed against the
 *  full tree so numbers are stable regardless of active filters. */
export const fullTree = buildTree(articles);

export interface Crumb {
  partNum: number;
  partLabel: Bilingual;
  secNum: number;
  secLabel: Bilingual;
  chapNum: number;
  chapLabel: Bilingual;
}

const crumbIndex = new Map<number, Crumb>();
for (const part of fullTree) {
  for (const sec of part.sections) {
    for (const chap of sec.chapters) {
      for (const a of chap.articles) {
        crumbIndex.set(a.number, {
          partNum: part.num, partLabel: part.label,
          secNum: sec.num, secLabel: sec.label,
          chapNum: chap.num, chapLabel: chap.label,
        });
      }
    }
  }
}
export function crumbFor(n: number): Crumb | undefined {
  return crumbIndex.get(n);
}

/** Reverse index of `refs`: which articles point at article N. */
const backRefIndex = new Map<number, number[]>();
for (const a of articles) {
  for (const r of a.refs) {
    const m = r.match(/(\d+)/);
    if (!m) continue;
    const target = Number(m[1]);
    if (target === a.number || !byNumber.has(target)) continue;
    const list = backRefIndex.get(target) ?? [];
    if (!list.includes(a.number)) list.push(a.number);
    backRefIndex.set(target, list);
  }
}
export function referencedBy(n: number): number[] {
  return backRefIndex.get(n) ?? [];
}

/** Headline numbers for the landing panel. */
export const STATS = {
  articles: articles.length,
  chapters: fullTree.reduce(
    (n, p) => n + p.sections.reduce((m, s) => m + s.chapters.length, 0),
    0,
  ),
  life: articles.filter((a) => a.penaltyAggregate.life).length,
  fine: articles.filter(
    (a) => a.penaltyAggregate.fineAvailable || a.penalties.some((p) => p.fineAvailable),
  ).length,
};

// ---------------------------------------------------------------------------
// Severity helpers (display-only intensity derived from the penalty envelope)
// ---------------------------------------------------------------------------
export type SevClass = 'EG' | 'GR' | 'MD' | 'MN' | 'FINE' | 'NONE';

export const SEV_LABEL: Record<SevClass, Bilingual> = {
  EG: { hy: 'ԱՌԱՆՁՆԱՊԵՍ ԾԱՆՐ', en: 'ESPECIALLY GRAVE' },
  GR: { hy: 'ԾԱՆՐ', en: 'GRAVE' },
  MD: { hy: 'ՄԻՋԻՆ', en: 'MEDIUM' },
  MN: { hy: 'ՈՉ ՄԵԾ', en: 'MINOR' },
  FINE: { hy: 'ՏՈՒԳԱՆՔ', en: 'FINE' },
  NONE: { hy: '—', en: '—' },
};

/** Severity class → five-star meter. No sanction 0 · fine 1 · minor 2 ·
 *  medium 3 · grave 4 · especially grave / life 5. */
export const SEV_STARS: Record<SevClass, number> = {
  NONE: 0,
  FINE: 1,
  MN: 2,
  MD: 3,
  GR: 4,
  EG: 5,
};

export function sevClass(agg: PenaltyAggregate): SevClass {
  if (agg.life) return 'EG';
  if (agg.type === 'prison' && agg.maxYears != null) {
    if (agg.maxYears > 10) return 'EG';
    if (agg.maxYears > 5) return 'GR';
    if (agg.maxYears > 2) return 'MD';
    return 'MN';
  }
  if (agg.type === 'prison') return 'MN'; // months-only / short term
  if (agg.type === 'fine') return 'FINE';
  return 'NONE';
}

/** Category -> compact type tag (crime "ANTI-X", General Part "GENERAL"). */
export const CATEGORY_TAG: Record<Article['category'], string> = {
  person: 'ANTI-PERSON',
  property: 'ANTI-PROPERTY',
  state: 'ANTI-STATE',
  order: 'ANTI-ORDER',
  other: 'GENERAL',
};

/** Plain-language description of what each category covers (tooltip copy). */
export const CATEGORY_DESC: Record<Article['category'], Bilingual> = {
  person: {
    hy: 'Անձի դեմ ուղղված հանցագործություններ — կյանք, առողջություն, ազատություն, արժանապատվություն։',
    en: 'Offences against the person — life, health, liberty and dignity.',
  },
  property: {
    hy: 'Սեփականության և տնտեսական գործունեության դեմ ուղղված հանցագործություններ։',
    en: 'Offences against property and economic activity.',
  },
  state: {
    hy: 'Պետության և սահմանադրական կարգի հիմունքների դեմ ուղղված հանցագործություններ։',
    en: 'Offences against the state and the constitutional order.',
  },
  order: {
    hy: 'Հասարակական կարգի, անվտանգության և կառավարման կարգի դեմ ուղղված հանցագործություններ։',
    en: 'Offences against public order, safety and administration.',
  },
  other: {
    hy: 'Ընդհանուր մաս — սահմանումներ և ընդհանուր դրույթներ, ոչ թե առանձին հանցատեսակ։',
    en: 'General Part — definitions and general provisions, not an offence class.',
  },
};

/** The gauge scale: 0..20 discrete year segments, then a LIFE cap segment. */
export const GAUGE_MAX_YEARS = 20;

export interface ClauseScale {
  kind: 'years' | 'months' | 'life' | 'fine' | 'none';
  /** filled fraction 0..1 across the year scale (years/life only) */
  fillFrom: number;
  fillTo: number;
  /** life reachable in this clause (lights the LIFE cap even on a year range) */
  life: boolean;
  label: string; // mono-rendered numeric label, e.g. "10–15", "LIFE", "≤2 MO"
}

export function clauseScale(p: ClausePenalty): ClauseScale {
  // A custodial term range takes precedence over the life flag so a clause like
  // "5–8 years or life" still renders its bar (DESIGN §6 — Art 141), with the
  // LIFE cap lit alongside.
  if (p.minYears != null || p.maxYears != null) {
    // An explicit minimum dims the 0..min "reach"; an open ≤N fills from zero.
    const lo = p.minYears ?? 0;
    const hi = p.maxYears ?? p.minYears ?? 0;
    return {
      kind: 'years',
      fillFrom: lo / GAUGE_MAX_YEARS,
      fillTo: Math.min(hi / GAUGE_MAX_YEARS, 1),
      life: p.life,
      label: rangeLabel(p.minYears, p.maxYears),
    };
  }
  if (p.minMonths != null || p.maxMonths != null) {
    return {
      kind: 'months',
      fillFrom: 0,
      fillTo: 0.04,
      life: p.life,
      label: rangeLabel(p.minMonths, p.maxMonths),
    };
  }
  if (p.life) {
    return { kind: 'life', fillFrom: 0, fillTo: 1, life: true, label: 'LIFE' };
  }
  if (p.type === 'fine') {
    return { kind: 'fine', fillFrom: 0, fillTo: 0, life: false, label: 'FINE' };
  }
  return { kind: 'none', fillFrom: 0, fillTo: 0, life: false, label: '—' };
}

function rangeLabel(lo: number | null, hi: number | null, suffix = ''): string {
  if (lo != null && hi != null) {
    return lo === hi ? `${lo}${suffix}` : `${lo}–${hi}${suffix}`;
  }
  if (hi != null) return `≤${hi}${suffix}`;
  if (lo != null) return `≥${lo}${suffix}`;
  return '—';
}

/** Aggregate term label for compact rows (sidebar/list). */
export function aggTermLabel(agg: PenaltyAggregate): string {
  if (agg.life) return 'LIFE';
  if (agg.type === 'fine') return 'FINE';
  if (agg.maxYears != null || agg.minYears != null) {
    return rangeLabel(agg.minYears, agg.maxYears);
  }
  if (agg.type === 'prison') return 'MO';
  return '—';
}
