import { ReactNode, useCallback, useEffect, useState } from 'react';
import { authApi } from '../../api/auth';
import { LoginCredentials } from '../../api/types';
import { AuthContext, User } from './AuthContext';

const USER_STORAGE_KEY = 'buddy_user';
const USER_EXPIRY_KEY = 'buddy_user_expiry';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const expiryTime = localStorage.getItem(USER_EXPIRY_KEY);
    
    if (storedUser && expiryTime) {
      const expiry = parseInt(expiryTime, 10);
      if (Date.now() < expiry) {
        return JSON.parse(storedUser);
      } else {
        // Clear expired data
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(USER_EXPIRY_KEY);
      }
    }
    return null;
  });

  const persistUser = useCallback((userData: User) => {
    // Set expiry to 1 hour from now
    const expiryTime = Date.now() + 60 * 60 * 1000; // 1 hour in milliseconds
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    localStorage.setItem(USER_EXPIRY_KEY, expiryTime.toString());
    setUser(userData);
  }, []);

  const clearStoredUser = useCallback(() => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(USER_EXPIRY_KEY);
    setUser(null);
  }, []);

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    await authApi.login(credentials);
    // After successful login, persist the user
    const userData = {
      name: credentials.email,
      email: credentials.email,
    };
    persistUser(userData);
  }, [persistUser]);

  const signOut = useCallback(async () => {
    await authApi.logout();
    clearStoredUser();
  }, [clearStoredUser]);

  // Check for token expiration periodically
  useEffect(() => {
    const checkExpiry = () => {
      const expiryTime = localStorage.getItem(USER_EXPIRY_KEY);
      if (expiryTime && Date.now() >= parseInt(expiryTime, 10)) {
        clearStoredUser();
      }
    };

    const interval = setInterval(checkExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [clearStoredUser]);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
