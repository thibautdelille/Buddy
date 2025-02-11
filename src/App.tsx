import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from '@mui/material';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { FavoritesProvider } from './providers/FavoritesProvider';
import { LoginPage } from './features/auth/LoginPage';
import { SearchPage } from './features/search/SearchPage';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { AuthProvider } from './features/auth/AuthProvider';
import { useMemo, useState } from 'react';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>(
    prefersDarkMode ? 'dark' : 'light'
  );

  const theme = useMemo(
    () =>
      createTheme({
        shape: {
          borderRadius: 10,
        },
        typography: {
          fontFamily: "'Inter', sans-serif",
          h6: {
            fontFamily: "'Pacifico', cursive",
          },
          h5: {
            fontFamily: "'Pacifico', cursive",
          },
          h4: {
            fontFamily: "'Pacifico', cursive",
          },
        },
        palette: {
          mode,
          primary: {
            main: '#F2542d',
          },
          background: {
            default: mode === 'light' ? '#f5DFBB' : '#121212',
            paper: mode === 'light' ? '#FFEFDC' : '#1e1e1e',
          },
        },
      }),
    [mode]
  );

  return (
    <QueryProvider>
      <AuthProvider>
        <FavoritesProvider>
          <Router>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/search"
                  element={
                    <ProtectedRoute>
                      <SearchPage
                        onToggleTheme={() =>
                          setMode(mode === 'light' ? 'dark' : 'light')
                        }
                      />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/search" replace />} />
              </Routes>
            </ThemeProvider>
          </Router>
        </FavoritesProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
