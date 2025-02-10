import { Box, Typography } from '@mui/material';
import { useFavorites } from './useFavorites';
import { DogGrid } from '../search/components/DogGrid';
import { SortControls } from '../search/components/SortControls';
import { useState } from 'react';
import { SortDirection, SortField } from '../../api/types';

export function FavoritesView() {
  const { favorites } = useFavorites();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedFavorites = [...favorites].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const modifier = sortDirection === 'asc' ? 1 : -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * modifier;
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * modifier;
    }
    return 0;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="div">
          {favorites.length} Favorite{favorites.length !== 1 ? 's' : ''}
        </Typography>
        <SortControls
          sortField={sortField}
          sortDirection={sortDirection}
          onSortFieldChange={setSortField}
          onSortDirectionChange={setSortDirection}
        />
      </Box>
      {favorites.length > 0 ? (
        <DogGrid
          dogs={sortedFavorites}
          isLoading={false}
          error={null}
          page={1}
          totalPages={1}
          onPageChange={() => {}}
        />
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: 'center', py: 4 }}
        >
          You haven't added any favorites yet. Browse dogs and click the heart
          icon to add them here!
        </Typography>
      )}
    </Box>
  );
}
