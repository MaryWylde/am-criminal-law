import { useTheme, type Theme } from '../theme-context';
import { useConsole } from '../console-context';
import { t } from '../lib/i18n';
import { Segmented } from './segmented';

/** GTA ⇄ REGULAR skin toggle. Persisted in localStorage by ThemeProvider. */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { lang } = useConsole();
  return (
    <Segmented<Theme>
      ariaLabel="Theme"
      value={theme}
      onChange={setTheme}
      options={[
        { value: 'gta', label: t('themeGta', lang) },
        { value: 'regular', label: t('themeRegular', lang) },
      ]}
    />
  );
}
