export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface LoginCredentials {
  name: string;
  email: string;
}

export interface SearchDogsResponse {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

export interface Match {
  match: string;
}

export interface LocationSearchParams {
  city?: string;
  states?: string[];
  geoBoundingBox?: {
    top?: Coordinates;
    left?: Coordinates;
    bottom?: Coordinates;
    right?: Coordinates;
    bottom_left?: Coordinates;
    top_left?: Coordinates;
  };
  size?: number;
  from?: number;
}

export interface LocationSearchResponse {
  results: Location[];
  total: number;
}

export type SortField = 'breed' | 'name' | 'age';
export type SortDirection = 'asc' | 'desc';

export interface SearchDogsParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: string;
  sort?: `${SortField}:${SortDirection}`;
}
