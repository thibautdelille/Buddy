import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  useTheme,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Dog, Location } from '../../../api/types';
import { useFavorites } from '../../../features/favorites/useFavorites';

interface DogCardProps {
  dog: Dog;
  location?: Location;
}

export function DogCard({ dog, location }: DogCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(dog.id);
  const theme = useTheme();

  const handleToggleFavorite = () => {
    if (favorite) {
      removeFavorite(dog.id);
    } else {
      addFavorite(dog);
    }
  };

  return (
    <Card>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={dog.img}
          alt={dog.name}
          sx={{ objectFit: 'cover' }}
        />
        <IconButton
          onClick={handleToggleFavorite}
          sx={{
            'position': 'absolute',
            'top': 8,
            'right': 8,
            'backgroundColor':
              theme.palette.mode === 'dark'
                ? 'rgba(0, 0, 0, 0.7)'
                : 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(0, 0, 0, 0.9)'
                  : 'rgba(255, 255, 255, 0.9)',
            },
            'color': favorite ? theme.palette.error.main : undefined,
          }}
        >
          {favorite ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </Box>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {dog.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Breed: {dog.breed}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Age: {dog.age} years
        </Typography>
        {location ? (
          <Typography variant="body2" color="text.secondary">
            Location: {location.city}, {location.state} {dog.zip_code}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Location: {dog.zip_code}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
