import { useState } from 'react';
import { Container, Box } from '@mui/material';
import { useAuth } from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dogsApi } from '../../api/dogs';
import { SearchHeader } from './components/SearchHeader';
import { SearchControls } from './components/SearchControls';
import { DogGrid } from './components/DogGrid';
import { useDogs } from './hooks/useDogs';
import { SortDirection, SortField } from '../../api/types';

const DOGS_PER_PAGE = 32;

interface SearchPageProps {
  onToggleTheme: () => void;
}

export function SearchPage({ onToggleTheme }: SearchPageProps) {
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
      <Box sx={{ p: 3 }}>Loading breeds...</Box>
    );
  }

  if (breedsError) {
    return (
      <Box sx={{ p: 3 }}>Error loading breeds: {breedsError.message}</Box>
    );
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
        <SearchControls
          breeds={breeds}
          selectedBreed={selectedBreed}
          sortField={sortField}
          sortDirection={sortDirection}
          onBreedChange={handleBreedChange}
          onSortFieldChange={handleSortFieldChange}
          onSortDirectionChange={handleSortDirectionChange}
        />
        <DogGrid
          dogs={searchResults?.dogs || []}
          isLoading={isLoadingDogs}
          error={dogsError}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </Container>
    </Box>
  );
}
