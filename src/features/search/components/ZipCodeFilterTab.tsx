import { Alert, Box, Button, Stack, TextField } from '@mui/material';
import { Location, locationsApi } from '../../../api';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

interface ZipCodeFilterTabProps {
  selectedLocations: Location[];
  onLocationsChange: (locations: Location[]) => void;
}

export const ZipCodeFilterTab = ({
  selectedLocations,
  onLocationsChange,
}: ZipCodeFilterTabProps) => {
  const [zipCode, setZipCode] = useState('');
  const [notFound, setNotFound] = useState(false);

  const searchMutation = useMutation({
    mutationFn: (zipCode: string) => locationsApi.getLocations([zipCode]),
    onSuccess: (locations: Location[]) => {
      console.log(locations);
      if (locations.length === 0 || !locations[0]?.city) {
        setNotFound(true);
        return;
      }
      onLocationsChange([...selectedLocations, ...locations]);
      setNotFound(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchMutation.mutate(zipCode);
    setZipCode('');
  };

  return (
    <Stack spacing={2}>
      {/* Search Form */}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Zip Code"
            value={zipCode}
            onChange={(e) => {
              setZipCode(e.target.value);
              setNotFound(false);
            }}
            size="small"
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            disabled={searchMutation.isPending}
            size="small"
            fullWidth
          >
            Search
          </Button>
        </Stack>
      </Box>

      {notFound && (
        <Alert severity="error">Zip code not found. Please try again.</Alert>
      )}
    </Stack>
  );
};
