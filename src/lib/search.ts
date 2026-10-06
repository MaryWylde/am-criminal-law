import Fuse from 'fuse.js';
import { articles } from './articles';
import type { Article } from '../types';

interface SearchDoc {
  number: number;
  numStr: string;
  titleHy: string;
  titleEn: string;
  body: string;
  article: Article;
}

const docs: SearchDoc[] = articles.map((a) => ({
  number: a.number,
  numStr: String(a.number),
  titleHy: a.title.hy ?? '',
  titleEn: a.title.en ?? '',
  body: a.provisions
    .map((p) => `${p.text.hy ?? ''} ${p.text.en ?? ''}`)
    .join(' '),
  article: a,
}));

const fuse = new Fuse(docs, {
  keys: [
    { name: 'numStr', weight: 3 },
    { name: 'titleHy', weight: 2 },
    { name: 'titleEn', weight: 2 },
    { name: 'body', weight: 0.5 },
  ],
  threshold: 0.34,
  ignoreLocation: true,
  minMatchCharLength: 2,
});

export function search(query: string): Article[] {
  const q = query.trim();
  if (!q) return articles;
  // Exact article-number jump takes priority.
  if (/^\d+$/.test(q)) {
    const exact = docs.find((d) => d.numStr === q);
    const rest = fuse.search(q).map((r) => r.item.article);
    const out = exact ? [exact.article, ...rest.filter((a) => a.number !== exact.number)] : rest;
    return out;
  }
  return fuse.search(q).map((r) => r.item.article);
}
