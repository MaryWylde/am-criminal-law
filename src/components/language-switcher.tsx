import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { Lang } from '../types';
import { Segmented } from './segmented';

/** Global hy/en switch. Reflected in the URL (/hy/141 <-> /en/141) so deep
 *  links carry language. Preserves the current article/path. */
export function LanguageSwitcher() {
  const { lang: langParam } = useParams();
  const lang: Lang = langParam === 'hy' ? 'hy' : 'en';
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const swap = (next: Lang) => {
    if (next === lang) return;
    const rest = pathname.replace(/^\/(hy|en)/, '');
    navigate(`/${next}${rest}`);
  };

  return (
    <Segmented
      ariaLabel="Language"
      value={lang}
      onChange={swap}
      options={[
        { value: 'en', label: 'EN' },
        { value: 'hy', label: 'HY' },
      ]}
    />
  );
}
