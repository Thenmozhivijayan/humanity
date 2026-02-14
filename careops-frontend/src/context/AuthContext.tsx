import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';

interface User {
  id: string;
  email: string;
  role: string;
  workspaceId: string;
  workspaceName: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  customer: Customer | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  customerLogin: (email: string, password: string) => Promise<void>;
  customerRegister: (data: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedCustomer = localStorage.getItem('customer');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedCustomer) {
      setCustomer(JSON.parse(savedCustomer));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data.user);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  };

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data);
    setUser(res.data.user);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  };

  const customerLogin = async (email: string, password: string) => {
    const res = await api.post('/auth/customer/login', { email, password });
    setCustomer(res.data.customer);
    localStorage.setItem('customer', JSON.stringify(res.data.customer));
  };

  const customerRegister = async (data: any) => {
    const res = await api.post('/auth/customer/register', data);
    setCustomer(res.data.customer);
    localStorage.setItem('customer', JSON.stringify(res.data.customer));
  };

  const logout = () => {
    setUser(null);
    setCustomer(null);
    localStorage.removeItem('user');
    localStorage.removeItem('customer');
  };

  return (
    <AuthContext.Provider value={{ user, customer, login, register, customerLogin, customerRegister, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
