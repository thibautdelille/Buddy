import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { Logout, DarkMode, LightMode } from '@mui/icons-material';
import PetsIcon from '@mui/icons-material/Pets';

interface SearchHeaderProps {
  userName: string;
  onLogout: () => void;
  onToggleTheme: () => void;
}

export function SearchHeader({ userName, onLogout, onToggleTheme }: SearchHeaderProps) {
  const theme = useTheme();

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PetsIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            Buddy
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* User Actions */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {userName}
          </Typography>
          <IconButton
            onClick={onToggleTheme}
            size="small"
            color="inherit"
            aria-label="toggle theme"
          >
            {theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
          <IconButton
            onClick={onLogout}
            size="small"
            color="inherit"
            aria-label="logout"
          >
            <Logout />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
