import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Divider,
  Tab,
  Tabs,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { locationsApi } from '../../../api/locations';
import { Location } from '../../../api/types';
import { FilterList, Close } from '@mui/icons-material';

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

interface FilterDialogProps {
  onLocationsChange: (locations: Location[]) => void;
  onBreedChange: (breed: string) => void;
  breeds: string[];
  selectedBreed: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`filter-tabpanel-${index}`}
      aria-labelledby={`filter-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export function FilterDialog({
  onLocationsChange,
  onBreedChange,
  breeds,
  selectedBreed,
}: FilterDialogProps) {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [tabValue, setTabValue] = useState(0);

  // Popover state
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const searchMutation = useMutation({
    mutationFn: () =>
      locationsApi.search({
        city,
        states: state ? [state] : undefined,
      }),
    onSuccess: (data) => {
      setSearchResults(data.results);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchMutation.mutate();
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchResults([]);
    setCity('');
    setState('');
  };

  const handleLocationSelect = (location: Location) => {
    if (!selectedLocations.some((loc) => loc.zip_code === location.zip_code)) {
      const newLocations = [...selectedLocations, location];
      setSelectedLocations(newLocations);
      onLocationsChange(newLocations);
    }
  };

  const handleLocationRemove = (zipCode: string) => {
    const newLocations = selectedLocations.filter(
      (loc) => loc.zip_code !== zipCode
    );
    setSelectedLocations(newLocations);
    onLocationsChange(newLocations);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      {/* Selected Filters Display */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <IconButton onClick={handleFilterClick} color="primary">
          <FilterList />
        </IconButton>
        {selectedBreed && (
          <Chip
            label={selectedBreed}
            onDelete={() => onBreedChange('')}
            color="primary"
            variant="outlined"
          />
        )}
        {selectedLocations.map((location) => (
          <Chip
            key={location.zip_code}
            label={`${location.city}, ${location.state}`}
            onDelete={() => handleLocationRemove(location.zip_code)}
          />
        ))}
      </Stack>

      {/* Filter Dialog */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ width: 400 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Breed" />
              <Tab label="Location" />
            </Tabs>
          </Box>

          {/* Breed Filter Tab */}
          <TabPanel value={tabValue} index={0}>
            <FormControl fullWidth size="small">
              <InputLabel>Breed</InputLabel>
              <Select
                value={selectedBreed}
                onChange={(e) => onBreedChange(e.target.value)}
                label="Breed"
              >
                <MenuItem value="">
                  <em>Any breed</em>
                </MenuItem>
                {breeds.map((breed) => (
                  <MenuItem key={breed} value={breed}>
                    {breed}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </TabPanel>

          {/* Location Filter Tab */}
          <TabPanel value={tabValue} index={1}>
            {/* Search Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  size="small"
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>State</InputLabel>
                  <Select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    label="State"
                  >
                    <MenuItem value="">
                      <em>None</em>
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
                >
                  Search
                </Button>
              </Stack>
            </Box>

            {/* Selected Locations */}
            {selectedLocations.length > 0 && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Locations
                </Typography>
                <List dense>
                  {selectedLocations.map((location) => (
                    <ListItem
                      key={location.zip_code}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() =>
                            handleLocationRemove(location.zip_code)
                          }
                          size="small"
                        >
                          <Close />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={`${location.city}, ${location.state}`}
                        secondary={location.zip_code}
                      />
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
              </>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Search Results
                </Typography>
                <List dense>
                  {searchResults.map((location) => (
                    <ListItemButton
                      key={location.zip_code}
                      onClick={() => handleLocationSelect(location)}
                      disabled={selectedLocations.some(
                        (loc) => loc.zip_code === location.zip_code
                      )}
                    >
                      <ListItemText
                        primary={`${location.city}, ${location.state}`}
                        secondary={location.zip_code}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </>
            )}
          </TabPanel>
        </Box>
      </Popover>
    </Box>
  );
}
