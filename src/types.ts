export type Lang = 'hy' | 'en';

export type Category = 'person' | 'property' | 'state' | 'order' | 'other';

export type PenaltyType = 'prison' | 'fine' | 'other';

export interface Bilingual {
  hy: string | null;
  en: string | null;
}

export interface Provision {
  marker: string;
  text: Bilingual;
}

export interface ClausePenalty {
  clause: string;
  type: PenaltyType;
  minYears: number | null;
  maxYears: number | null;
  minMonths: number | null;
  maxMonths: number | null;
  life: boolean;
  fineAvailable: boolean;
}

export interface PenaltyAggregate {
  type: PenaltyType;
  minYears: number | null;
  maxYears: number | null;
  life: boolean;
  fineAvailable: boolean;
}

export interface Article {
  number: number;
  part: Bilingual;
  section: Bilingual;
  chapter: Bilingual;
  category: Category;
  title: Bilingual;
  provisions: Provision[];
  penalties: ClausePenalty[];
  penaltyAggregate: PenaltyAggregate;
  refs: string[];
  comparison2003: string | null;
}

/** Derived hierarchy tree (numbered by document order). */
export interface TreeChapter {
  num: number;
  label: Bilingual;
  articles: Article[];
}

export interface TreeSection {
  num: number;
  label: Bilingual;
  chapters: TreeChapter[];
}

export interface TreePart {
  num: number;
  label: Bilingual;
  sections: TreeSection[];
}
