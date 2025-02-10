import { useState } from 'react';
import { Container, Box, Button, Tabs, Tab } from '@mui/material';
import { useAuth } from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { dogsApi } from '../../api/dogs';
import { SearchHeader } from './components/SearchHeader';
import { DogGrid } from './components/DogGrid';
import { SortControls } from './components/SortControls';
import { FavoritesView } from '../favorites/FavoritesView';
import {
  SortDirection,
  SortField,
  Location as ApiLocation,
} from '../../api/types';
import { useFavorites } from '../favorites/useFavorites';
import { Favorite } from '@mui/icons-material';
import { MatchDialog } from '../match/MatchDialog';
import { FilterDialog } from './components/FilterDialog';

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
  const [selectedLocations, setSelectedLocations] = useState<ApiLocation[]>([]);
  const [activeTab, setActiveTab] = useState(0);

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

  // Fetch dogs with pagination, breed filter, and location filter
  const {
    data: searchResults,
    isLoading: isLoadingDogs,
    error: dogsError,
  } = useQuery({
    queryKey: [
      'dogs',
      selectedBreed,
      page,
      sortField,
      sortDirection,
      selectedLocations,
    ],
    queryFn: async () => {
      const searchResponse = await dogsApi.search({
        breeds: selectedBreed ? [selectedBreed] : undefined,
        zipCodes: selectedLocations.map((loc) => loc.zip_code),
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

  return (
    <Box>
      <SearchHeader
        userName={user?.name || ''}
        onLogout={handleLogout}
        onToggleTheme={onToggleTheme}
      />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            py: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={handleFindMatch}
              startIcon={<Favorite />}
              disabled={favorites.length === 0 || matchMutation.isPending}
            >
              Find Match
            </Button>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
            >
              <Tab label="Search" />
              <Tab label={`Favorites (${favorites.length})`} />
            </Tabs>
          </Box>

          {activeTab === 0 ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <FilterDialog
                  onLocationsChange={setSelectedLocations}
                  onBreedChange={setSelectedBreed}
                  breeds={breeds || []}
                  selectedBreed={selectedBreed}
                />
                <SortControls
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSortFieldChange={setSortField}
                  onSortDirectionChange={setSortDirection}
                />
              </Box>

              <DogGrid
                dogs={searchResults?.dogs || []}
                isLoading={isLoadingDogs}
                error={dogsError}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          ) : (
            <FavoritesView />
          )}
        </Box>

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
