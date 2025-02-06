import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export function SearchPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Hello, {user?.name}
      </Typography>
      <Button variant="contained" onClick={handleLogout}>
        Log Out
      </Button>
    </Box>
  );
}
