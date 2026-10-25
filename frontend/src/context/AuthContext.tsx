import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../api/auth.api';
import { setAuthToken } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requestOtp: (phoneNumber: string) => Promise<{ message: string; debugOtp?: string }>;
  login: (phoneNumber: string, otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const requestOtp = async (phoneNumber: string) => {
    setIsLoading(true);
    try {
      const data = await authApi.requestOtp(phoneNumber);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phoneNumber: string, otp: string) => {
    setIsLoading(true);
    try {
      const data = await authApi.verifyOtp(phoneNumber, otp);
      setToken(data.token);
      setUser(data.user);
      setAuthToken(data.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        requestOtp,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
