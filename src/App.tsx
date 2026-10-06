import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './theme-context';
import { ConsoleProvider } from './console-context';
import { ConsoleLayout } from './components/console-layout';
import { BrowsePanel } from './pages/browse-panel';
import { ArticlePanel } from './pages/article-panel';

export function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/en" replace />} />
        <Route
          path="/:lang"
          element={
            <ConsoleProvider>
              <ConsoleLayout />
            </ConsoleProvider>
          }
        >
          <Route index element={<BrowsePanel />} />
          <Route path=":articleNumber" element={<ArticlePanel />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
