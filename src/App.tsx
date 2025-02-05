import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoginPage />
    </ThemeProvider>
  );
}

export default App;
