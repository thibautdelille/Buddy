import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useQuery } from '@tanstack/react-query';
import { dogsApi } from '../../api/dogs';
import { useState } from 'react';
import { Dog, SortDirection, SortField } from '../../api/types';

const DOGS_PER_PAGE = 32;

const sortFields: { value: SortField; label: string }[] = [
  { value: 'breed', label: 'Breed' },
  { value: 'name', label: 'Name' },
  { value: 'age', label: 'Age' },
];

const sortDirections: { value: SortDirection; label: string }[] = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

export function SearchPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('breed');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Fetch breeds
  const {
    data: breeds,
    isLoading: isLoadingBreeds,
    error: breedsError,
  } = useQuery({
    queryKey: ['breeds'],
    queryFn: dogsApi.getBreeds,
  });

  // Fetch dogs with pagination and breed filter
  const {
    data: searchResults,
    isLoading: isLoadingDogs,
    error: dogsError,
  } = useQuery({
    queryKey: ['dogs', selectedBreed, page, sortField, sortDirection],
    queryFn: async () => {
      const searchResponse = await dogsApi.search({
        breeds: selectedBreed ? [selectedBreed] : undefined,
        size: DOGS_PER_PAGE,
        from: page > 1 ? ((page - 1) * DOGS_PER_PAGE).toString() : undefined,
        sort: `${sortField}:${sortDirection}`,
      });

      if (searchResponse.resultIds.length === 0) {
        return { dogs: [], total: 0 };
      }

      const dogs = await dogsApi.getDogs(searchResponse.resultIds);
      return { dogs, total: searchResponse.total };
    },
  });

  const totalPages = searchResults
    ? Math.ceil(searchResults.total / DOGS_PER_PAGE)
    : 0;

  if (isLoadingBreeds) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading dog breeds...</Typography>
      </Box>
    );
  }

  if (breedsError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error loading dog breeds: {breedsError.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4">Welcome {user?.name}</Typography>
        <Button variant="contained" onClick={handleLogout}>
          Log Out
        </Button>
      </Box>

      <Typography variant="h5" sx={{ mb: 3 }}>
        Find Your Perfect Buddy
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="breed-select-label">Select a Breed</InputLabel>
          <Select
            labelId="breed-select-label"
            id="breed-select"
            value={selectedBreed}
            label="Select a Breed"
            onChange={(e) => {
              setSelectedBreed(e.target.value);
              setPage(1); // Reset to first page when changing breed
            }}
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

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="sort-field-label">Sort By</InputLabel>
          <Select
            labelId="sort-field-label"
            id="sort-field"
            value={sortField}
            label="Sort By"
            onChange={(e) => {
              setSortField(e.target.value as SortField);
              setPage(1);
            }}
          >
            {sortFields.map((field) => (
              <MenuItem key={field.value} value={field.value}>
                {field.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="sort-direction-label">Sort Direction</InputLabel>
          <Select
            labelId="sort-direction-label"
            id="sort-direction"
            value={sortDirection}
            label="Sort Direction"
            onChange={(e) => {
              setSortDirection(e.target.value as SortDirection);
              setPage(1);
            }}
          >
            {sortDirections.map((direction) => (
              <MenuItem key={direction.value} value={direction.value}>
                {direction.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {isLoadingDogs ? (
        <Typography>Loading dogs...</Typography>
      ) : dogsError ? (
        <Typography color="error">
          Error loading dogs: {dogsError.message}
        </Typography>
      ) : searchResults?.dogs.length === 0 ? (
        <Typography>No dogs found</Typography>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {searchResults?.dogs.map((dog: Dog) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={dog.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={dog.img}
                    alt={dog.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {dog.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Breed: {dog.breed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Age: {dog.age} years
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Location: {dog.zip_code}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
