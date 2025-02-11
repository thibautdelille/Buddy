import { useMemo, useState } from 'react';
import { Box, Stack, Chip, Popover, Tab, Tabs, Button } from '@mui/material';
import { FilterList } from '@mui/icons-material';
import { Location } from '../../../api/types';
import { BreedFilterTab } from './BreedFilterTab';
import { LocationFilterTab } from './LocationFilterTab';
import { groupLocations } from '../lib/utils';
import { ZipCodeFilterTab } from './ZipCodeFilterTab';

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
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const groupedSelectedLocations = useMemo(
    () => groupLocations(selectedLocations),
    [selectedLocations]
  );
  const [tabValue, setTabValue] = useState(0);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLocationsChange = (locations: Location[]) => {
    setSelectedLocations(locations);
    onLocationsChange(locations);
  };

  const handleLocationRemove = (city: string) => {
    const newLocations = selectedLocations.filter((loc) => loc.city !== city);
    setSelectedLocations(newLocations);
    onLocationsChange(newLocations);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      {/* Selected Filters Display */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button onClick={handleFilterClick} color="primary" variant="outlined">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FilterList sx={{ mr: 1 }} />
            Filter
          </div>
        </Button>
        {selectedBreed && (
          <Chip
            label={selectedBreed}
            onDelete={() => onBreedChange('')}
            color="primary"
            variant="outlined"
          />
        )}
        {Object.entries(groupedSelectedLocations).map(([city, locations]) => (
          <Chip
            key={city}
            label={`${city} (${locations.length})`}
            onDelete={() => handleLocationRemove(city)}
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
              <Tab label="City/State" />
              <Tab label="Zip Code" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <BreedFilterTab
              selectedBreed={selectedBreed}
              breeds={breeds}
              onBreedChange={onBreedChange}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <LocationFilterTab
              selectedLocations={selectedLocations}
              onLocationsChange={handleLocationsChange}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <ZipCodeFilterTab
              selectedLocations={selectedLocations}
              onLocationsChange={handleLocationsChange}
            />
          </TabPanel>
        </Box>
      </Popover>
    </Box>
  );
}
