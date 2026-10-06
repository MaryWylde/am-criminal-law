import { useConsole, type SidebarTab } from '../console-context';
import { t } from '../lib/i18n';
import { Txt } from './txt';
import { SidebarTree } from './sidebar-tree';
import { SearchPanel } from './search-panel';

/** The dark directory panel. Two tabs: CONTENTS (the Part → Chapter → Article
 *  tree) and SEARCH (the flat, relevance-ranked result list; the filters
 *  themselves live in the header). Slides in as a drawer below lg. */
export function Sidebar({ drawerOpen = false }: { drawerOpen?: boolean }) {
  const { lang, sidebarTab, setSidebarTab, filtered, total } = useConsole();

  const tabs: { id: SidebarTab; label: string }[] = [
    { id: 'contents', label: t('tabContents', lang) },
    { id: 'search', label: t('tabSearch', lang) },
  ];

  return (
    <aside
      className={`panel-frame panel-shadow absolute inset-y-0 left-0 z-40 flex w-[88%] max-w-[340px] flex-col bg-side text-side-text transition-transform duration-200 lg:static lg:z-auto lg:w-[360px] lg:max-w-none lg:shrink-0 lg:translate-x-0 ${
        drawerOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* tabs */}
      <div role="tablist" className="flex shrink-0 border-b-2 border-side-line">
        {tabs.map((tab) => {
          const active = tab.id === sidebarTab;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setSidebarTab(tab.id)}
              className={`flex-1 px-3 py-3 text-[12px] font-bold tracking-[0.2em] transition-colors ${
                active
                  ? 'bg-side-text text-side'
                  : 'bg-side text-side-dim hover:text-side-text'
              }`}
            >
              <Txt label className="block truncate">{tab.label}</Txt>
            </button>
          );
        })}
      </div>

      <div className="side-scroll min-h-0 flex-1 overflow-y-auto">
        {sidebarTab === 'contents' ? <SidebarTree /> : <SearchPanel />}
      </div>

      <div className="flex shrink-0 items-center justify-between border-t-2 border-side-line px-3 py-1.5 font-mono text-[10px] text-side-dim">
        <Txt label className="tracking-[0.2em]">{t('records', lang)}</Txt>
        <span>
          <span className="font-bold text-side-text">{filtered.length}</span> / {total}
        </span>
      </div>
    </aside>
  );
}
