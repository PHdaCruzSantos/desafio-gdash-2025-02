import { createContext, useContext, useState, useEffect } from 'react';
import type {ReactNode} from 'react'
import { AuthService, UserService } from '@/service/api';

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  description?: string;
  pokemonCollection?: { id: number; name: string; sprite: string; capturedAt: string }[];
  lastSpin?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('gdash_token');
      const savedUser = localStorage.getItem('gdash_user');
      
      if (token && savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        // Fetch fresh data
        try {
          const freshUser = await UserService.getProfile(parsedUser.id);
          const mappedUser = { ...freshUser, id: freshUser._id };
          setUser(mappedUser);
          localStorage.setItem('gdash_user', JSON.stringify(mappedUser));
        } catch (error) {
          console.error("Failed to refresh user data", error);
          // Optional: logout if token is invalid?
        }
      }
      setLoading(false);
    };

    initAuth();
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

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('gdash_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};