import { Dog, Location } from '../../../api';

export const groupLocations = (locations: Location[]) => {
  const groupedLocations = locations.reduce((acc, loc) => {
    if (!acc[loc.city]) {
      acc[loc.city] = [];
    }
    acc[loc.city].push(loc);
    return acc;
  }, {} as Record<string, Location[]>);

  return groupedLocations;
};

export function getDogCity(dog: Dog, locations: Location[]) {
  const location = locations.find(
    (location) => location?.zip_code === dog.zip_code
  );
  return location ? location.city : undefined;
}
