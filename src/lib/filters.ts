import type { Filters } from '../console-context';

/** Number of filter controls currently engaged (badge on the mobile FILTERS
 *  toggle). Each category counts once; the term cap counts when set. */
export function countActiveFilters(f: Filters): number {
  return (
    f.cats.size +
    Number(f.fine) +
    Number(f.prison) +
    Number(f.life) +
    Number(f.saved) +
    Number(f.maxYears !== null)
  );
}
