import { useConsole } from '../console-context';
import { t } from '../lib/i18n';
import { Txt } from './txt';

const ARLIS_URL = 'https://www.arlis.am';

/** Provenance / disclaimer strip under the panels. */
export function Footer() {
  const { lang } = useConsole();
  return (
    <footer className="stage-copy shrink-0 px-3 pb-2 pt-1 text-center text-[10px] leading-snug text-stage-text opacity-80 lg:px-5 lg:pb-3">
      <Txt>{t('footerDisclaimer', lang)}</Txt>{' '}
      <a
        href={ARLIS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold underline underline-offset-2 hover:text-accent"
      >
        ARLIS
      </a>
      .
    </footer>
  );
}
