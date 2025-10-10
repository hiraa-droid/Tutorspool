import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../lib/api';

interface User {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  timezone?: string;
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    country: string;
    timezone?: string;
    role: 'STUDENT' | 'TUTOR' | 'ADMIN';
  }) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  getDashboardUrl: () => string;
  sendPasswordReset: (email: string) => Promise<{ error?: string }>;
  resendEmailConfirmation: (email: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }
        const userData = await apiClient.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Auth check failed:', error);
        await apiClient.clearToken();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await apiClient.login(email, password);
      setUser(result.user);
      return { error: undefined };
    } catch (error) {
      console.error('Login error:', error);
      return { error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    country: string;
    timezone?: string;
    role: 'STUDENT' | 'TUTOR' | 'ADMIN';
  }) => {
    try {
      const result = await apiClient.register(userData);
      setUser(result.user);
      return { error: undefined };
    } catch (error) {
      console.error('Registration error:', error);
      return { error: error instanceof Error ? error.message : 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getDashboardUrl = () => {
    if (!user) return 'Login';
    switch (user.role) {
      case 'STUDENT':
      case 'TUTOR':
      case 'ADMIN':
        return 'Main';
      default:
        return 'Login';
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      // Implement actual API call if available, or simulate
      console.log('Password reset requested for:', email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { error: undefined };
    } catch (error) {
      console.error('Password reset error:', error);
      return { error: error instanceof Error ? error.message : 'Failed to send password reset' };
    }
  };

  const resendEmailConfirmation = async (email: string) => {
    try {
      // Implement actual API call if available, or simulate
      console.log('Email confirmation resend requested for:', email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { error: undefined };
    } catch (error) {
      console.error('Email confirmation resend error:', error);
      return { error: error instanceof Error ? error.message : 'Failed to resend email confirmation' };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    register,
    logout,
    getDashboardUrl,
    sendPasswordReset,
    resendEmailConfirmation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};