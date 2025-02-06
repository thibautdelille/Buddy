import { ReactNode, useCallback, useState } from 'react';
import { authApi } from '../../api/auth';
import { LoginCredentials } from '../../api/types';
import { AuthContext, User } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    await authApi.login(credentials);
    // After successful login, set the user
    setUser({
      name: credentials.email,
      email: credentials.email,
    });
  }, []);

  const signOut = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
