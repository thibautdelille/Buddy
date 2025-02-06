import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { LoginPage } from './features/auth/LoginPage';

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
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LoginPage />
        </ThemeProvider>
      </Router>
    </QueryProvider>
  );
}

export default App;
