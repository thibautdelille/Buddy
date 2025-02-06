import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
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

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // A nice blue color
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
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
                    <SearchPage />
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
