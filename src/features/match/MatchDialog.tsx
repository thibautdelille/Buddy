import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Dog } from '../../api/types';
import { DogCard } from '../search/components/DogCard';

interface MatchDialogProps {
  open: boolean;
  onClose: () => void;
  matchedDog: Dog | null;
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
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Your Perfect Match</DialogTitle>
      <DialogContent>
        {isLoading && (
          <Typography align="center" sx={{ py: 4 }}>
            <CircularProgress />
          </Typography>
        )}
        {error && (
          <Typography color="error" sx={{ py: 2 }}>
            Error finding a match: {error.message}
          </Typography>
        )}
        {matchedDog && (
          <>
            <Typography gutterBottom>
              Based on your favorites, we think you'll love:
            </Typography>
            <DogCard dog={matchedDog} />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
