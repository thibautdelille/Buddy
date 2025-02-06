import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { LoginPage } from './features/auth/LoginPage';
import { SearchPage } from './features/search/SearchPage';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { AuthProvider } from './features/auth/AuthProvider';
import { useMemo, useState } from 'react';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#2196f3',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#fff' : '#1e1e1e',
          },
        },
      }),
    [mode]
  );

  return (
    <QueryProvider>
      <AuthProvider>
        <Router>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <SearchPage onToggleTheme={() => setMode(mode === 'light' ? 'dark' : 'light')} />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/search" replace />} />
            </Routes>
          </ThemeProvider>
        </Router>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
