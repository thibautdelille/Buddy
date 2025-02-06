import { AppBar, Box, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import { Logout, Brightness4, Brightness7 } from '@mui/icons-material';

interface SearchHeaderProps {
  userName: string;
  onLogout: () => void;
  onToggleTheme: () => void;
}

export const SearchHeader = ({ userName, onLogout, onToggleTheme }: SearchHeaderProps) => {
  const theme = useTheme();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Welcome, {userName}!
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={onToggleTheme} color="inherit" sx={{ mr: 1 }}>
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <IconButton onClick={onLogout} color="inherit">
            <Logout />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
