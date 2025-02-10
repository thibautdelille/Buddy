import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { SortDirection, SortField } from '../../../api/types';

interface SortControlsProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortFieldChange: (field: SortField) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
}

export function SortControls({
  sortField,
  sortDirection,
  onSortFieldChange,
  onSortDirectionChange,
}: SortControlsProps) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Sort by</InputLabel>
        <Select
          value={sortField}
          label="Sort by"
          onChange={(e) => onSortFieldChange(e.target.value as SortField)}
        >
          <MenuItem value="breed">Breed</MenuItem>
          <MenuItem value="age">Age</MenuItem>
          <MenuItem value="name">Name</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Direction</InputLabel>
        <Select
          value={sortDirection}
          label="Direction"
          onChange={(e) => onSortDirectionChange(e.target.value as SortDirection)}
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
