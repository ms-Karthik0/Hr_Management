import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: Role) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PRESET_USERS: Record<Role, User> = {
  ROLE_ADMIN: {
    email: 'admin@zidio.com',
    firstName: 'Executive',
    lastName: 'Admin',
    role: 'ROLE_ADMIN',
    employeeId: 1
  },
  ROLE_HR_MANAGER: {
    email: 'hr@zidio.com',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    role: 'ROLE_HR_MANAGER',
    employeeId: 3
  },
  ROLE_MANAGER: {
    email: 'manager@zidio.com',
    firstName: 'David',
    lastName: 'Miller',
    role: 'ROLE_MANAGER',
    employeeId: 2
  },
  ROLE_EMPLOYEE: {
    email: 'alex.turner@zidio.com',
    firstName: 'Alex',
    lastName: 'Turner',
    role: 'ROLE_EMPLOYEE',
    employeeId: 1
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nexus_user');
    return saved ? JSON.parse(saved) : PRESET_USERS.ROLE_ADMIN; // Default to Admin for immediate exploration
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('nexus_token') || 'demo-jwt-token');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('nexus_theme') as 'light' | 'dark') || 'light';
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('nexus_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const data = await api.login(email, pass);
      const authenticatedUser: User = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        employeeId: data.employeeId
      };
      setUser(authenticatedUser);
      setToken(data.token);
      localStorage.setItem('nexus_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('nexus_token', data.token);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nexus_user');
    localStorage.removeItem('nexus_token');
  };

  const switchRole = (role: Role) => {
    const targetUser = PRESET_USERS[role];
    setUser(targetUser);
    localStorage.setItem('nexus_user', JSON.stringify(targetUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, switchRole, theme, toggleTheme, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
