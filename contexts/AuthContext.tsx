
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';
import * as db from '../db';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (newUser: Omit<User, 'id'>) => Promise<{ success: boolean; message: string }>;
  updateUserPassword: (userId: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'anime-gallery-session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
        const item = window.sessionStorage.getItem(SESSION_KEY);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        return null;
    }
  });
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(db.getUsers());
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const user = db.authenticateUser(username, password);
    if (user) {
      setCurrentUser(user);
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    window.sessionStorage.removeItem(SESSION_KEY);
  };

  const addUser = async (newUser: Omit<User, 'id'>): Promise<{ success: boolean; message: string }> => {
    const result = db.addUser(newUser);
    if (result.success) {
      setUsers(db.getUsers()); // Refresh user list
    }
    return result;
  };

  const updateUserPassword = async (userId: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const result = db.updateUserPassword(userId, newPassword);
    if (result.success) {
      setUsers(db.getUsers()); // Refresh user list
    }
    return result;
  };

  const value = { currentUser, users, login, logout, addUser, updateUserPassword };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
