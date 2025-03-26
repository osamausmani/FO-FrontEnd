import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Mock axios directly instead of the API module
jest.mock('axios', () => ({
  defaults: {
    headers: {
      common: {}
    }
  },
  post: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      data: {
        token: 'fake-token',
        user: { id: '123', name: 'Test User', email: 'test@example.com', role: 'user' }
      }
    });
  }),
  get: jest.fn().mockImplementation(() => {
    return Promise.resolve({
      data: {
        success: true,
        data: { _id: '123', name: 'Test User', email: 'test@example.com', role: 'user' }
      }
    });
  })
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isAuthenticated, loading, login, logout, register } = useAuth();

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : isAuthenticated && user ? (
        <div>
          <p>Authenticated as {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <p>Not authenticated</p>
          <button onClick={() => login('test@example.com', 'password123')}>Login</button>
          <button onClick={() => register({ name: 'Test User', email: 'test@example.com', password: 'password123' })}>Register</button>
        </div>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('provides initial unauthenticated state', async () => {
    // Mock the getCurrentUser API call to return null (no user)
    jest.mocked(axios.get).mockResolvedValueOnce({
      data: {
        success: false,
        message: 'No user found'
      }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initially loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // After API call completes, should show unauthenticated state
    await waitFor(() => {
      expect(screen.getByText('Not authenticated')).toBeInTheDocument();
    });
  });

  test('handles successful login', async () => {
    // Mock successful login response
    const mockUser = { id: '123', name: 'Test User', email: 'test@example.com', role: 'user' };
    jest.mocked(axios.post).mockResolvedValueOnce({
      data: {
        success: true,
        token: 'fake-token',
        user: mockUser
      }
    });

    // Mock getCurrentUser to return the user
    jest.mocked(axios.get).mockResolvedValueOnce({
      data: {
        success: true,
        data: mockUser
      }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for the initial loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Click login button
    const loginButton = screen.getByText('Login');
    act(() => {
      loginButton.click();
    });

    // After login, should show authenticated state
    await waitFor(() => {
      expect(screen.getByText('Authenticated as Test User')).toBeInTheDocument();
      expect(screen.getByText('Email: test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Role: user')).toBeInTheDocument();
    });

    // Check if token was stored in localStorage
    expect(localStorage.getItem('token')).toBe('fake-token');
  });

  test('handles logout', async () => {
    // Mock initial authenticated state
    const mockUser = { id: '123', name: 'Test User', email: 'test@example.com', role: 'user' };
    localStorage.setItem('token', 'fake-token');
    
    jest.mocked(axios.get).mockResolvedValueOnce({
      data: {
        success: true,
        data: mockUser
      }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for authenticated state
    await waitFor(() => {
      expect(screen.getByText('Authenticated as Test User')).toBeInTheDocument();
    });

    // Click logout button
    const logoutButton = screen.getByText('Logout');
    act(() => {
      logoutButton.click();
    });

    // After logout, should show unauthenticated state
    await waitFor(() => {
      expect(screen.getByText('Not authenticated')).toBeInTheDocument();
    });

    // Check if token was removed from localStorage
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('handles registration', async () => {
    // Mock successful registration response
    const mockUser = { id: '123', name: 'Test User', email: 'test@example.com', role: 'user' };
    jest.mocked(axios.post).mockResolvedValueOnce({
      data: {
        success: true,
        token: 'fake-token',
        user: mockUser
      }
    });

    // Mock getCurrentUser to return the user
    jest.mocked(axios.get).mockResolvedValueOnce({
      data: {
        success: true,
        data: mockUser
      }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for the initial loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Click register button
    const registerButton = screen.getByText('Register');
    act(() => {
      registerButton.click();
    });

    // After registration, should show authenticated state
    await waitFor(() => {
      expect(screen.getByText('Authenticated as Test User')).toBeInTheDocument();
      expect(screen.getByText('Email: test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Role: user')).toBeInTheDocument();
    });

    // Check if token was stored in localStorage
    expect(localStorage.getItem('token')).toBe('fake-token');
  });
});
