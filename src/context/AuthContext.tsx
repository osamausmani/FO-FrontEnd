import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, AuthContextType, RegisterUserData, PasswordChangeData } from '../types/auth';

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check if token is valid
  const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  // Set auth token in axios headers
  const setAuthToken = (token: string | null): void => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Register user
  const register = async (userData: RegisterUserData): Promise<boolean> => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      const { token } = res.data;
      
      setToken(token);
      setAuthToken(token);
      loadUser();
      
      toast.success('Registration successful');
      navigate('/');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return false;
    }
  };

  // Login user
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token } = res.data;
      
      setToken(token);
      setAuthToken(token);
      loadUser();
      
      toast.success('Login successful');
      navigate('/');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid credentials';
      toast.error(message);
      return false;
    }
  };

  // Logout user
  const logout = (): void => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthToken(null);
    navigate('/login');
    toast.info('Logged out successfully');
  };

  // Load user data
  const loadUser = async (): Promise<void> => {
    if (!token) {
      setLoading(false);
      return;
    }

    if (!isTokenValid(token)) {
      logout();
      setLoading(false);
      return;
    }

    setAuthToken(token);
    
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data.data);
      setIsAuthenticated(true);
    } catch (error) {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const res = await axios.put('/api/auth/updatedetails', userData);
      setUser(res.data.data);
      toast.success('Profile updated successfully');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return false;
    }
  };

  // Change password
  const changePassword = async (passwordData: PasswordChangeData): Promise<boolean> => {
    try {
      await axios.put('/api/auth/updatepassword', passwordData);
      toast.success('Password changed successfully');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
      return false;
    }
  };

  // Request password reset
  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      await axios.post('/api/auth/forgotpassword', { email });
      toast.success('Password reset email sent');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      return false;
    }
  };

  // Reset password with token
  const resetPassword = async (token: string, password: string): Promise<boolean> => {
    try {
      await axios.put(`/api/auth/resetpassword/${token}`, { password });
      toast.success('Password reset successful');
      navigate('/login');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
      return false;
    }
  };

  // Load user on initial app load
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
