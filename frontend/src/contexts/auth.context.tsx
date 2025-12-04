import { createContext, useContext, useState, useEffect } from 'react';
import type {ReactNode} from 'react'
import { AuthService } from '@/service/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('gdash_token');
    const savedUser = localStorage.getItem('gdash_user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await AuthService.login(email, password);
    localStorage.setItem('gdash_token', data.access_token);
    localStorage.setItem('gdash_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    await AuthService.register(name, email, password);
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('gdash_token');
    localStorage.removeItem('gdash_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};