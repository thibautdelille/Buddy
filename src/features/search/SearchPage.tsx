import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useQuery } from '@tanstack/react-query';
import { dogsApi } from '../../api/dogs';
import { useState } from 'react';

export function SearchPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedBreed, setSelectedBreed] = useState<string>('');

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const {
    data: breeds,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['breeds'],
    queryFn: dogsApi.getBreeds,
  });

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading dog breeds...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading dog breeds: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Welcome {user?.name}</Typography>
        <Button variant="contained" onClick={handleLogout}>
          Log Out
        </Button>
      </Box>

      <Typography variant="h5" sx={{ mb: 3 }}>Find Your Perfect Buddy</Typography>
      
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="breed-select-label">Select a Breed</InputLabel>
        <Select
          labelId="breed-select-label"
          id="breed-select"
          value={selectedBreed}
          label="Select a Breed"
          onChange={(e) => setSelectedBreed(e.target.value)}
        >
          <MenuItem value="">
            <em>All breeds</em>
          </MenuItem>
          {breeds?.map((breed) => (
            <MenuItem key={breed} value={breed}>
              {breed}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
