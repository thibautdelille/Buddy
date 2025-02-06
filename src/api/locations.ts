import { apiClient } from './client';
import { Location, LocationSearchParams, LocationSearchResponse } from './types';

export const locationsApi = {
  /**
   * Get location information for up to 100 ZIP codes
   */
  getLocations: async (zipCodes: string[]): Promise<Location[]> => {
    const { data } = await apiClient.post<Location[]>('/locations', zipCodes);
    return data;
  },

  /**
   * Search for locations with optional filters
   */
  search: async (params: LocationSearchParams): Promise<LocationSearchResponse> => {
    const { data } = await apiClient.post<LocationSearchResponse>('/locations/search', params);
    return data;
  },
};
