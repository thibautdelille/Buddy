import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Dog } from '../../../api/types';

interface DogCardProps {
  dog: Dog;
}

export function DogCard({ dog }: DogCardProps) {
  return (
    <Card>
      <CardMedia
        component="img"
        height="200"
        image={dog.img}
        alt={dog.name}
        sx={{ objectFit: 'cover' }}
      />
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
        <Typography variant="body2" color="text.secondary">
          Location: {dog.zip_code}
        </Typography>
      </CardContent>
    </Card>
  );
}
