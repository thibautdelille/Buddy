import { useState } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useAuth } from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { dogsApi } from '../../api/dogs';
import { SearchHeader } from './components/SearchHeader';
import { SearchControls } from './components/SearchControls';
import { DogGrid } from './components/DogGrid';
import { SortDirection, SortField } from '../../api/types';
import { useFavorites } from '../favorites/useFavorites';
import { Favorite } from '@mui/icons-material';
import { MatchDialog } from '../match/MatchDialog';

const DOGS_PER_PAGE = 32;

interface SearchPageProps {
  onToggleTheme: () => void;
}

export function SearchPage({ onToggleTheme }: SearchPageProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('breed');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // Match mutation
  const matchMutation = useMutation({
    mutationFn: async () => {
      const match = await dogsApi.match(favorites.map((dog) => dog.id));
      const [matchedDog] = await dogsApi.getDogs([match.match]);
      return matchedDog;
    },
  });

  const handleFindMatch = () => {
    matchMutation.mutate(undefined, {
      onSuccess: () => setIsMatchDialogOpen(true),
    });
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
    return <Box sx={{ p: 3 }}>Loading breeds...</Box>;
  }

  if (breedsError) {
    return <Box sx={{ p: 3 }}>Error loading breeds: {breedsError.message}</Box>;
  }

  const handleBreedChange = (breed: string) => {
    setSelectedBreed(breed);
    setPage(1);
  };

  const handleSortFieldChange = (field: SortField) => {
    setSortField(field);
    setPage(1);
  };

  const handleSortDirectionChange = (direction: SortDirection) => {
    setSortDirection(direction);
    setPage(1);
  };

  return (
    <Box>
      <SearchHeader
        userName={user?.name || ''}
        onLogout={handleLogout}
        onToggleTheme={onToggleTheme}
      />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
          {favorites.length === 0 ? (
            <Typography>
              Search and add dogs to your favorites by clicking on the{' '}
              <Favorite
                color="primary"
                sx={{
                  verticalAlign: 'middle',
                  fontSize: '1rem',
                }}
              />{' '}
              icon and we can match you with the perfect dog
            </Typography>
          ) : (
            <Typography>
              You saved {favorites.length}{' '}
              {favorites.length === 1 ? 'dog' : 'dogs'} to your favorites. Click
              on Find a Match to get matched with the dogs you love!
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3,
          }}
        >
          <SearchControls
            breeds={breeds}
            selectedBreed={selectedBreed}
            sortField={sortField}
            sortDirection={sortDirection}
            onBreedChange={handleBreedChange}
            onSortFieldChange={handleSortFieldChange}
            onSortDirectionChange={handleSortDirectionChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleFindMatch}
            disabled={favorites.length === 0 || matchMutation.isPending}
          >
            Find a Match
          </Button>
        </Box>

        <DogGrid
          dogs={searchResults?.dogs || []}
          isLoading={isLoadingDogs}
          error={dogsError}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        <MatchDialog
          open={isMatchDialogOpen}
          onClose={() => setIsMatchDialogOpen(false)}
          matchedDog={matchMutation.data}
          isLoading={matchMutation.isPending}
          error={matchMutation.error}
        />
      </Container>
    </Box>
  );
}
