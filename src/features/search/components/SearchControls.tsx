import { FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { SortDirection, SortField } from '../../../api/types';

const sortFields: { value: SortField; label: string }[] = [
  { value: 'breed', label: 'Breed' },
  { value: 'name', label: 'Name' },
  { value: 'age', label: 'Age' },
];

const sortDirections: { value: SortDirection; label: string }[] = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

interface SearchControlsProps {
  breeds: string[] | undefined;
  selectedBreed: string;
  sortField: SortField;
  sortDirection: SortDirection;
  onBreedChange: (breed: string) => void;
  onSortFieldChange: (field: SortField) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
}

export function SearchControls({
  breeds,
  selectedBreed,
  sortField,
  sortDirection,
  onBreedChange,
  onSortFieldChange,
  onSortDirectionChange,
}: SearchControlsProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="breed-select-label">Select a Breed</InputLabel>
        <Select
          labelId="breed-select-label"
          id="breed-select"
          value={selectedBreed}
          label="Select a Breed"
          onChange={(e) => onBreedChange(e.target.value)}
        >
          <MenuItem value="">
            <em>All breeds</em>
          </MenuItem>
          {breeds?.map((breed) => (
            <MenuItem key={breed} value={breed}>
              {breed}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="sort-field-label">Sort By</InputLabel>
        <Select
          labelId="sort-field-label"
          id="sort-field"
          value={sortField}
          label="Sort By"
          onChange={(e) => onSortFieldChange(e.target.value as SortField)}
        >
          {sortFields.map((field) => (
            <MenuItem key={field.value} value={field.value}>
              {field.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="sort-direction-label">Sort Direction</InputLabel>
        <Select
          labelId="sort-direction-label"
          id="sort-direction"
          value={sortDirection}
          label="Sort Direction"
          onChange={(e) => onSortDirectionChange(e.target.value as SortDirection)}
        >
          {sortDirections.map((direction) => (
            <MenuItem key={direction.value} value={direction.value}>
              {direction.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
