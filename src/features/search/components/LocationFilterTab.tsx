import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { Location } from '../../../api/types';
import { locationsApi } from '../../../api/locations';
import { useState } from 'react';
import { groupLocations } from '../lib/utils';

const STATE_OPTIONS = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
];

interface LocationFilterTabProps {
  selectedLocations: Location[];
  onLocationsChange: (locations: Location[]) => void;
}

export function LocationFilterTab({
  selectedLocations,
  onLocationsChange,
}: LocationFilterTabProps) {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [groupedLocations, setGroupedLocations] = useState<
    Record<string, Location[]>
  >({});

  const groupedSelectedLocations = groupLocations(selectedLocations);

  const searchMutation = useMutation({
    mutationFn: () =>
      locationsApi.search({
        city: city ? city.split(' ').join('+') : undefined,
        states: state ? [state] : undefined,
        size: 1000,
      }),
    onSuccess: (data) => {
      // Group locations by city
      setGroupedLocations(groupLocations(data.results));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city || state) {
      searchMutation.mutate();
    }
  };

  const handleLocationsAdd = (locations: Location[]) => {
    const newLocations = [...selectedLocations, ...locations];
    onLocationsChange(newLocations);
  };

  const handleLocationsRemove = (locations: Location[]) => {
    const newLocations = selectedLocations.filter(
      (loc) => !locations.includes(loc)
    );
    onLocationsChange(newLocations);
  };

  return (
    <Stack spacing={2}>
      {/* Search Form */}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            size="small"
            fullWidth
          />
          <FormControl size="small" fullWidth>
            <InputLabel>State</InputLabel>
            <Select
              value={state}
              onChange={(e) => setState(e.target.value)}
              label="State"
            >
              <MenuItem value="">
                <em>Any state</em>
              </MenuItem>
              {STATE_OPTIONS.map((stateCode) => (
                <MenuItem key={stateCode} value={stateCode}>
                  {stateCode}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

      {Object.entries(groupedSelectedLocations).length > 0 && (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Selected Cities
          </Typography>
          <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
            {Object.entries(groupedSelectedLocations).map(
              ([city, locations]) => (
                <ListItem
                  key={city}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleLocationsRemove(locations)}
                      size="small"
                    >
                      <Close />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`${city}, ${locations[0].state}`}
                    secondary={
                      locations.length === 1
                        ? locations[0].zip_code
                        : `${locations.length} zip codes`
                    }
                  />
                </ListItem>
              )
            )}
          </List>
        </>
      )}

      {Object.entries(groupedLocations).length > 0 && (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Available Locations
          </Typography>
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {Object.entries(groupedLocations).map(([city, locations]) => (
              <ListItem
                key={city}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleLocationsAdd(locations)}
                    size="small"
                  >
                    <Add />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${city}, ${locations[0].state}`}
                  secondary={
                    locations.length === 1
                      ? locations[0].zip_code
                      : `${locations.length} zip codes`
                  }
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Stack>
  );
}
