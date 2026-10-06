import { hasArmenian } from '../lib/articles';

/** Routes a dynamic string to the correct font face: Armenian glyphs to the
 *  Armenian face, everything else to the theme's body (or display) face. This
 *  enforces DESIGN §4 — Armenian is NEVER rendered in a Latin-only font, which
 *  matters doubly now that the GTA display faces carry no Armenian glyphs. */
export function Txt({
  children,
  className = '',
  display = false,
  label = false,
}: {
  children: string;
  className?: string;
  /** headline face (Bowlby One / Noto Sans Armenian 800) */
  display?: boolean;
  /** structured-data face (mono) for Latin; Armenian still goes to Noto */
  label?: boolean;
}) {
  const arm = hasArmenian(children);
  const face = arm
    ? display ? 'font-arm-display' : 'font-arm'
    : display ? 'font-display' : label ? 'font-label' : 'font-body';
  return <span className={`${face} ${className}`}>{children}</span>;
}
