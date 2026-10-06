import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';
import { useParams } from 'react-router-dom';
import type { Article, Category, Lang, TreePart } from './types';
import { articles, buildTree, chapCount, partCount, secCount } from './lib/articles';
import { search } from './lib/search';

export interface Filters {
  cats: Set<Category>;
  fine: boolean;
  prison: boolean;
  life: boolean;
  saved: boolean;
  maxYears: number | null; // null = ANY (finite years only; life is its own toggle)
}

export type SidebarTab = 'contents' | 'search';

interface ConsoleState {
  lang: Lang;
  query: string;
  setQuery: (q: string) => void;
  filters: Filters;
  toggleCat: (c: Category) => void;
  toggleFine: () => void;
  togglePrison: () => void;
  toggleLife: () => void;
  toggleSaved: () => void;
  setMaxYears: (n: number | null) => void;
  resetFilters: () => void;
  filtered: Article[];
  tree: TreePart[];
  total: number;
  filtersActive: boolean;
  searching: boolean;
  bookmarks: Set<number>;
  isBookmarked: (n: number) => boolean;
  toggleBookmark: (n: number) => void;
  sidebarTab: SidebarTab;
  setSidebarTab: (t: SidebarTab) => void;
}

const Ctx = createContext<ConsoleState | null>(null);

const FILTER_CATS: Category[] = ['person', 'property', 'state', 'order'];
const BOOKMARKS_KEY = 'cc-bookmarks';

function readBookmarks(): Set<number> {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    const arr: unknown = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr.filter((n): n is number => typeof n === 'number') : []);
  } catch {
    return new Set();
  }
}

export function ConsoleProvider({ children }: { children: ReactNode }) {
  const { lang: langParam } = useParams();
  const lang: Lang = langParam === 'hy' ? 'hy' : 'en';

  const [query, setQueryState] = useState('');
  const [cats, setCats] = useState<Set<Category>>(new Set());
  const [fine, setFine] = useState(false);
  const [prison, setPrison] = useState(false);
  const [life, setLife] = useState(false);
  const [saved, setSaved] = useState(false);
  const [maxYears, setMaxYears] = useState<number | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<number>>(readBookmarks);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('contents');

  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...bookmarks]));
    } catch {
      /* storage unavailable — bookmarks live for the session only */
    }
  }, [bookmarks]);

  // Typing a query is a search gesture, so the sidebar follows the user there.
  const setQuery = useCallback((q: string) => {
    setQueryState(q);
    if (q.trim()) setSidebarTab('search');
  }, []);

  const toggleCat = (c: Category) =>
    setCats((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  const toggleBookmark = useCallback((n: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }, []);
  const resetFilters = () => {
    setCats(new Set());
    setFine(false);
    setPrison(false);
    setLife(false);
    setSaved(false);
    setMaxYears(null);
    setQueryState('');
  };

  const searching = query.trim().length > 0;
  const filtersActive =
    cats.size > 0 || fine || prison || life || saved || maxYears !== null;

  const filtered = useMemo(() => {
    let list: Article[] = searching ? search(query) : articles;
    if (cats.size > 0) list = list.filter((a) => cats.has(a.category));
    if (fine) list = list.filter((a) => hasFine(a));
    if (prison) list = list.filter((a) => isPrison(a));
    if (saved) list = list.filter((a) => bookmarks.has(a.number));
    if (maxYears !== null) {
      list = list.filter((a) => withinMaxTerm(a, maxYears, life));
    }
    return list;
  }, [query, searching, cats, fine, prison, life, saved, maxYears, bookmarks]);

  // The tree must stay in document order; searching reorders by relevance, so
  // when searching we keep tree ordering stable by re-sorting for the tree only.
  // While a search or filter is active, rank branches by match count so the
  // densest matches surface at the top instead of being buried in the
  // hierarchy — each branch keeps its real (document-order) number.
  const tree = useMemo(() => {
    const forTree = searching
      ? [...filtered].sort((a, b) => a.number - b.number)
      : filtered;
    const built = buildTree(forTree);
    return searching || filtersActive ? rankTreeByMatches(built) : built;
  }, [filtered, searching, filtersActive]);

  const value: ConsoleState = {
    lang,
    query,
    setQuery,
    filters: { cats, fine, prison, life, saved, maxYears },
    toggleCat,
    toggleFine: () => setFine((v) => !v),
    togglePrison: () => setPrison((v) => !v),
    toggleLife: () => setLife((v) => !v),
    toggleSaved: () => setSaved((v) => !v),
    setMaxYears,
    resetFilters,
    filtered,
    tree,
    total: articles.length,
    filtersActive,
    searching,
    bookmarks,
    isBookmarked: (n) => bookmarks.has(n),
    toggleBookmark,
    sidebarTab,
    setSidebarTab,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useConsole(): ConsoleState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useConsole must be used within ConsoleProvider');
  return ctx;
}

export { FILTER_CATS };

// Reorder tree branches so those holding the most matches come first; ties keep
// document order (ascending num). Articles within a chapter are left untouched.
function rankTreeByMatches(parts: TreePart[]): TreePart[] {
  return parts
    .map((p) => ({
      ...p,
      sections: p.sections
        .map((s) => ({
          ...s,
          chapters: [...s.chapters].sort(
            (a, b) => chapCount(b) - chapCount(a) || a.num - b.num,
          ),
        }))
        .sort((a, b) => secCount(b) - secCount(a) || a.num - b.num),
    }))
    .sort((a, b) => partCount(b) - partCount(a) || a.num - b.num);
}

function hasFine(a: Article): boolean {
  return a.penaltyAggregate.fineAvailable || a.penalties.some((p) => p.fineAvailable);
}
function isPrison(a: Article): boolean {
  return a.penaltyAggregate.type === 'prison' || a.penalties.some((p) => p.type === 'prison');
}
function withinMaxTerm(a: Article, cap: number, includeLife: boolean): boolean {
  const agg = a.penaltyAggregate;
  // The slider covers finite years only. Life articles are off the numeric
  // scale, so they enter results solely through the LIFE toggle.
  if (agg.life) return includeLife;
  if (agg.maxYears != null && agg.maxYears > cap) return false;
  return true; // months-only / fine / no-term all sit below the cap
}
