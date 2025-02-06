import { apiClient } from './client';
import { LoginCredentials } from './types';

export const authApi = {
  /**
   * Authenticate user with the API
   * On success, the API will set an HttpOnly cookie named 'fetch-access-token'
   */
  login: async (credentials: LoginCredentials): Promise<void> => {
    await apiClient.post('/auth/login', credentials);
  },

  /**
   * Logout user and invalidate the auth cookie
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
