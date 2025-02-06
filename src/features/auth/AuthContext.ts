import { createContext } from 'react';
import { LoginCredentials } from '../../api/types';

export interface User {
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
