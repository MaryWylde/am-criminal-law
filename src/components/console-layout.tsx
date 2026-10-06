import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './top-bar';
import { Sidebar } from './sidebar';
import { Footer } from './footer';

/** Title screen + two floating panels over the skyline. Fixed-height stage;
 *  the sidebar and the paper sheets scroll independently. */
export function ConsoleLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();

  // Selecting an article (or otherwise navigating) closes the mobile drawer.
  useEffect(() => setNavOpen(false), [pathname]);

  return (
    <div className="stage-art flex h-[100dvh] flex-col overflow-hidden text-stage-text">
      <TopBar navOpen={navOpen} onToggleNav={() => setNavOpen((v) => !v)} />
      <div className="relative mt-3 flex min-h-0 flex-1 gap-4 px-3 pb-2 lg:mt-5 lg:px-5 lg:pb-3">
        <Sidebar drawerOpen={navOpen} />
        {navOpen && (
          <button
            type="button"
            aria-label="Close contents"
            onClick={() => setNavOpen(false)}
            className="absolute inset-0 z-30 bg-black/60 lg:hidden"
          />
        )}
        <main className="flex min-h-0 min-w-0 flex-1 gap-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
