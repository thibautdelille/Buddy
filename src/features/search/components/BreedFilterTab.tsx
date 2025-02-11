import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

interface BreedFilterTabProps {
  selectedBreed: string;
  breeds: string[];
  onBreedChange: (breed: string) => void;
}

export function BreedFilterTab({
  selectedBreed,
  breeds,
  onBreedChange,
}: BreedFilterTabProps) {
  return (
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
  );
}
