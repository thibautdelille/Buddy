import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';
import { Dog } from '../../api/types';
import { useQuery } from '@tanstack/react-query';
import { locationsApi } from '../../api';
import { getDogCity } from '../search/lib/utils';
import { useMemo } from 'react';

interface MatchDialogProps {
  open: boolean;
  onClose: () => void;
  matchedDog: Dog | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function MatchDialog({
  open,
  onClose,
  matchedDog,
  isLoading,
  error,
}: MatchDialogProps) {
  const zipCodes = matchedDog?.zip_code ? [matchedDog?.zip_code] : [];

  const { data: locations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ['locations', zipCodes],
    queryFn: () =>
      locationsApi.getLocations(zipCodes).then((response) => response),
  });

  const city = useMemo(
    () => (matchedDog ? getDogCity(matchedDog, locations) : undefined),
    [matchedDog, locations]
  );

  if (isLoading || locationsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!matchedDog) {
    return <Typography>No match found</Typography>;
  }
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 0 }}>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Typography color="error" sx={{ p: 3 }}>
            Error finding a match: {error.message}
          </Typography>
        )}
        {matchedDog && (
          <Box>
            <Box
              component="img"
              src={matchedDog.img}
              alt={`Photo of ${matchedDog.name}`}
              sx={{
                width: '100%',
                height: 300,
                objectFit: 'cover',
              }}
            />
            <Box sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                {matchedDog.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Based on your favorites, we think you'll love {matchedDog.name}!
                <br />
                {matchedDog.name} is a {matchedDog.age} year old{' '}
                {matchedDog.breed.toLowerCase()}
                who would make a perfect addition to your family.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Breed: {matchedDog.breed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Age: {matchedDog.age} years old
              </Typography>
              {city && (
                <Typography variant="body2" color="text.secondary">
                  City: {city}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                ZIP Code: {matchedDog.zip_code}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
