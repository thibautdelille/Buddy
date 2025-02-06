import { Box, Button, Typography } from '@mui/material';

interface SearchHeaderProps {
  userName: string | undefined;
  onLogout: () => void;
}

export function SearchHeader({ userName, onLogout }: SearchHeaderProps) {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4">Welcome {userName}</Typography>
        <Button variant="contained" onClick={onLogout}>
          Log Out
        </Button>
      </Box>

      <Typography variant="h5" sx={{ mb: 3 }}>
        Find Your Perfect Buddy
      </Typography>
    </>
  );
}
