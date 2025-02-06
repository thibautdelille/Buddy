import { Box, Grid, Pagination, Typography } from '@mui/material';
import { Dog } from '../../../api/types';
import { DogCard } from './DogCard';

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
  if (isLoading) {
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
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {dogs.map((dog) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={dog.id}>
            <DogCard dog={dog} />
          </Grid>
        ))}
      </Grid>

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
