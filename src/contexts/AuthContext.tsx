// import React, { createContext, useContext, useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { apiClient } from '../lib/api';

// interface User {
//   id: string;
//   name?: string;
//   email?: string;
//   phone?: string;
//   country?: string;
//   timezone?: string;
//   role: 'STUDENT' | 'TUTOR' | 'ADMIN';
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   signIn: (email: string, password: string) => Promise<{ error?: string }>;
//   register: (userData: {
//     name: string;
//     email: string;
//     password: string;
//     phone?: string;
//     country: string;
//     timezone?: string;
//     role: 'STUDENT' | 'TUTOR' | 'ADMIN';
//   }) => Promise<{ error?: string }>;
//   logout: () => Promise<void>;
//   getDashboardUrl: () => string;
//   sendPasswordReset: (email: string) => Promise<{ error?: string }>;
//   resendEmailConfirmation: (email: string) => Promise<{ error?: string }>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = await AsyncStorage.getItem('authToken');
//         if (!token) {
//           setLoading(false);
//           return;
//         }
//         const userData = await apiClient.getCurrentUser();
//         setUser(userData);
//       } catch (error) {
//         console.error('Auth check failed:', error);
//         await apiClient.clearToken();
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkAuth();
//   }, []);

//   const signIn = async (email: string, password: string) => {
//     try {
//       const result = await apiClient.login(email, password);
//       setUser(result.user);
//       return { error: undefined };
//     } catch (error) {
//       console.error('Login error:', error);
//       return { error: error instanceof Error ? error.message : 'Login failed' };
//     }
//   };

//   const register = async (userData: {
//     name: string;
//     email: string;
//     password: string;
//     phone?: string;
//     country: string;
//     timezone?: string;
//     role: 'STUDENT' | 'TUTOR' | 'ADMIN';
//   }) => {
//     try {
//       const result = await apiClient.register(userData);
//       setUser(result.user);
//       return { error: undefined };
//     } catch (error) {
//       console.error('Registration error:', error);
//       return { error: error instanceof Error ? error.message : 'Registration failed' };
//     }
//   };

//   const logout = async () => {
//     try {
//       await apiClient.logout();
//       setUser(null);
//       await AsyncStorage.removeItem('authToken');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   const getDashboardUrl = () => {
//     if (!user) return 'Login';
//     switch (user.role) {
//       case 'STUDENT':
//       case 'TUTOR':
//       case 'ADMIN':
//         return 'Main';
//       default:
//         return 'Login';
//     }
//   };

//   const sendPasswordReset = async (email: string) => {
//     try {
//       // Implement actual API call if available, or simulate
//       console.log('Password reset requested for:', email);
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       return { error: undefined };
//     } catch (error) {
//       console.error('Password reset error:', error);
//       return { error: error instanceof Error ? error.message : 'Failed to send password reset' };
//     }
//   };

//   const resendEmailConfirmation = async (email: string) => {
//     try {
//       // Implement actual API call if available, or simulate
//       console.log('Email confirmation resend requested for:', email);
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       return { error: undefined };
//     } catch (error) {
//       console.error('Email confirmation resend error:', error);
//       return { error: error instanceof Error ? error.message : 'Failed to resend email confirmation' };
//     }
//   };

//   const value: AuthContextType = {
//     user,
//     loading,
//     signIn,
//     register,
//     logout,
//     getDashboardUrl,
//     sendPasswordReset,
//     resendEmailConfirmation,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase'; // ← adjust path to your firebase config

export type UserRole = 'student' | 'tutor' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    adminKey?: string
  ) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// In production → move to env / secure config
const ADMIN_SECURITY_KEY = 'TutorsPool2024Admin!';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile({ ...data, uid } as UserProfile);
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        fetchUserProfile(firebaseUser.uid).finally(() => {
          setLoading(false);
        });
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    adminKey?: string
  ): Promise<{ error?: string }> => {
    try {
      // Admin protection
      if (role === 'admin') {
        if (!adminKey || adminKey !== ADMIN_SECURITY_KEY) {
          return { error: 'Invalid or missing admin security key' };
        }
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const newProfile: UserProfile = {
        uid: userCredential.user.uid,
        email,
        fullName,
        role,
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...newProfile,
        createdAt: newProfile.createdAt.toISOString(),
      });

      setUserProfile(newProfile);
      return { error: undefined };
    } catch (error: any) {
      let message = 'Failed to create account';

      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email format';
      } else if (error.message) {
        message = error.message;
      }

      return { error: message };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: undefined };
    } catch (error: any) {
      let message = 'Login failed';

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = 'Invalid email or password';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Try again later';
      } else if (error.code === 'auth/user-disabled') {
        message = 'This account has been disabled';
      } else if (error.message) {
        message = error.message;
      }

      return { error: message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      await AsyncStorage.removeItem('lastKnownUid'); // optional cleanup
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};