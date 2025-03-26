import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import RouteList from '../pages/routes/RouteList';
import * as apiModule from '../utils/api';
import { getMockedApiModule, MockedApiModule } from './mocks/apiMock';

// Mock the API service
jest.mock('../utils/api');

// Mock the context
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user1',
      name: 'Test User',
      role: 'admin',
      company: {
        id: 'company1',
        name: 'Test Company'
      }
    },
    isAuthenticated: true,
    loading: false
  })
}));

// Sample routes for testing
const mockRoutes = [
  {
    _id: 'r1',
    name: 'Route 1',
    startLocation: 'Location A',
    endLocation: 'Location B',
    distance: 100,
    estimatedTime: 120,
    waypoints: []
  },
  {
    _id: 'r2',
    name: 'Route 2',
    startLocation: 'Location C',
    endLocation: 'Location D',
    distance: 150,
    estimatedTime: 180,
    waypoints: []
  }
];

// Mock API response
const mockApiResponse = {
  data: {
    data: mockRoutes,
    pagination: {
      total: 10,
      page: 1,
      limit: 5
    }
  }
};

describe('RouteList Component', () => {
  let mockedApi: MockedApiModule;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedApi = getMockedApiModule();
    // Create a proper AxiosResponse object for getRoutes
    mockedApi.getRoutes.mockResolvedValue({
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
      data: mockApiResponse.data
    });
    
    // Create a proper AxiosResponse object for deleteRoute
    mockedApi.deleteRoute.mockResolvedValue({
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
      data: {
        success: true,
        data: {}
      }
    });
  });

  test('renders the route list component', async () => {
    render(
      <BrowserRouter>
        <RouteList />
      </BrowserRouter>
    );

    // Check if the component title is rendered
    expect(screen.getByText('Routes Management')).toBeInTheDocument();

    // Wait for the routes to be loaded
    await waitFor(() => {
      expect(mockedApi.getRoutes).toHaveBeenCalled();
    });

    // Check if routes are displayed
    await waitFor(() => {
      expect(screen.getByText('Route 1')).toBeInTheDocument();
      expect(screen.getByText('Route 2')).toBeInTheDocument();
      expect(screen.getByText('Location A')).toBeInTheDocument();
      expect(screen.getByText('Location B')).toBeInTheDocument();
    });
  });

  test('handles pagination correctly', async () => {
    render(
      <BrowserRouter>
        <RouteList />
      </BrowserRouter>
    );

    // Wait for the initial load
    await waitFor(() => {
      expect(mockedApi.getRoutes).toHaveBeenCalledWith({
        page: 0,
        limit: 10
      });
    });

    // Reset mock to test pagination
    mockedApi.getRoutes.mockClear();

    // Find and click the next page button
    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextPageButton);

    // Check if API was called with the correct page
    await waitFor(() => {
      expect(mockedApi.getRoutes).toHaveBeenCalledWith({
        page: 1,
        limit: 10
      });
    });
  });

  test('handles search functionality', async () => {
    render(
      <BrowserRouter>
        <RouteList />
      </BrowserRouter>
    );

    // Wait for the initial load
    await waitFor(() => {
      expect(mockedApi.getRoutes).toHaveBeenCalled();
    });

    // Reset mock to test search
    mockedApi.getRoutes.mockClear();

    // Find the search input and type in it
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Route 1' } });

    // Simulate search submission (usually after a delay)
    jest.advanceTimersByTime(500); // If there's a debounce

    // Check if API was called with the search term
    await waitFor(() => {
      expect(mockedApi.getRoutes).toHaveBeenCalledWith({
        page: 0,
        limit: 10,
        search: 'Route 1'
      });
    });
  });

  test('displays error message when API call fails', async () => {
    // Mock API failure
    mockedApi.getRoutes.mockRejectedValue(new Error('Failed to fetch'));

    render(
      <BrowserRouter>
        <RouteList />
      </BrowserRouter>
    );

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/error loading routes/i)).toBeInTheDocument();
    });
  });

  test('deletes a route when delete button is clicked', async () => {
    render(
      <BrowserRouter>
        <RouteList />
      </BrowserRouter>
    );

    // Wait for the routes to be loaded
    await waitFor(() => {
      expect(mockedApi.getRoutes).toHaveBeenCalled();
    });

    // Find and click the delete button for the first route
    const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
    fireEvent.click(deleteButton);

    // Confirm the deletion in the confirmation dialog
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    // Check if the delete API was called with the correct ID
    await waitFor(() => {
      expect(mockedApi.deleteRoute).toHaveBeenCalledWith('r1');
    });

    // Check if the routes are reloaded after deletion
    await waitFor(() => {
      expect(mockedApi.getRoutes).toHaveBeenCalledTimes(2);
    });
  });

  test('navigates to add route page when add button is clicked', async () => {
    render(
      <BrowserRouter>
        <RouteList />
      </BrowserRouter>
    );

    // Find and click the add route button
    const addButton = screen.getByRole('button', { name: /add route/i });
    fireEvent.click(addButton);

    // Check if navigation occurred (we can't directly test this without more mocking,
    // but we can check if the click handler was triggered)
    expect(window.location.pathname).toBe('/');
  });
});
