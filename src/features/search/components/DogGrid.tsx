import { Box, Grid2 as Grid, Pagination, Typography } from '@mui/material';
import { Dog } from '../../../api/types';
import { DogCard } from './DogCard';
import { useQuery } from '@tanstack/react-query';
import { locationsApi } from '../../../api/locations';
import { getDogCity } from '../lib/utils';

interface DogGridProps {
  dogs: Dog[];
  isLoading: boolean;
  error: Error | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function DogGrid({
  dogs,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
}: DogGridProps) {
  const zipCodes = dogs.map((dog) => dog.zip_code);

  const { data: locations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ['locations', zipCodes],
    queryFn: () =>
      locationsApi.getLocations(zipCodes).then((response) => response),
  });

  if (isLoading || locationsLoading) {
    return <Typography>Loading dogs...</Typography>;
  }

  if (error) {
    return (
      <Typography color="error">Error loading dogs: {error.message}</Typography>
    );
  }

  if (dogs.length === 0) {
    return <Typography>No dogs found</Typography>;
  }

  return (
    <>
      {locations.length > 0 ? (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {dogs.map((dog) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={dog.id}>
              <DogCard dog={dog} city={getDogCity(dog, locations)} />
            </Grid>
          ))}
        </Grid>
      ) : null}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => onPageChange(newPage)}
            color="primary"
          />
        </Box>
      )}
    </>
  );
}
