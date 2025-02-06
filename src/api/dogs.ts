import { apiClient } from './client';
import { Dog, Match, SearchDogsParams, SearchDogsResponse } from './types';

export const dogsApi = {
  /**
   * Get a list of all available dog breeds
   */
  getBreeds: async (): Promise<string[]> => {
    const { data } = await apiClient.get<string[]>('/dogs/breeds');
    return data;
  },

  /**
   * Search for dogs with optional filters
   */
  search: async (params: SearchDogsParams): Promise<SearchDogsResponse> => {
    const { data } = await apiClient.get<SearchDogsResponse>('/dogs/search', { params });
    return data;
  },

  /**
   * Get detailed information for up to 100 dogs by their IDs
   */
  getDogs: async (dogIds: string[]): Promise<Dog[]> => {
    const { data } = await apiClient.post<Dog[]>('/dogs', dogIds);
    return data;
  },

  /**
   * Get a match from a list of dog IDs
   */
  match: async (dogIds: string[]): Promise<Match> => {
    const { data } = await apiClient.post<Match>('/dogs/match', dogIds);
    return data;
  },
};
