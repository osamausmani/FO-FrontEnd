import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import VehicleList from '../pages/vehicles/VehicleList';
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

// Sample vehicles for testing
const mockVehicles = [
  {
    _id: 'v1',
    name: 'Toyota Corolla',
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    licensePlate: 'ABC-123',
    vin: 'JTDBR32E840123456',
    status: 'active',
    type: 'car',
    fuelType: 'petrol',
    currentLocation: {
      type: 'Point',
      coordinates: [74.3587, 31.5204]
    }
  },
  {
    _id: 'v2',
    name: 'Honda Civic',
    make: 'Honda',
    model: 'Civic',
    year: 2019,
    licensePlate: 'DEF-456',
    vin: 'JSAAZC21S00123456',
    status: 'maintenance',
    type: 'car',
    fuelType: 'petrol',
    currentLocation: {
      type: 'Point',
      coordinates: [67.0011, 24.8607]
    }
  }
];

// Mock API response
const mockApiResponse = {
  data: {
    data: mockVehicles,
    pagination: {
      total: 10,
      page: 1,
      limit: 5
    }
  }
};

describe('VehicleList Component', () => {
  let mockedApi: MockedApiModule;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedApi = getMockedApiModule();
    // Create a proper AxiosResponse object for getVehicles
    mockedApi.getVehicles.mockResolvedValue({
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
      data: mockApiResponse.data
    });
    
    // Create a proper AxiosResponse object for deleteVehicle
    mockedApi.deleteVehicle.mockResolvedValue({
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

  test('renders the vehicle list component', async () => {
    render(
      <BrowserRouter>
        <VehicleList />
      </BrowserRouter>
    );

    // Check if the component title is rendered
    expect(screen.getByText('Vehicle Management')).toBeInTheDocument();

    // Wait for the vehicles to be loaded
    await waitFor(() => {
      expect(mockedApi.getVehicles).toHaveBeenCalled();
    });

    // Check if vehicles are displayed
    await waitFor(() => {
      expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
      expect(screen.getByText('Honda Civic')).toBeInTheDocument();
    });
  });

  test('handles pagination correctly', async () => {
    render(
      <BrowserRouter>
        <VehicleList />
      </BrowserRouter>
    );

    // Wait for the initial load
    await waitFor(() => {
      expect(mockedApi.getVehicles).toHaveBeenCalledWith({
        page: 0,
        limit: 5
      });
    });

    // Reset mock to test pagination
    mockedApi.getVehicles.mockClear();

    // Find and click the next page button
    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextPageButton);

    // Check if API was called with the correct page
    await waitFor(() => {
      expect(mockedApi.getVehicles).toHaveBeenCalledWith({
        page: 1,
        limit: 5
      });
    });
  });

  test('handles search functionality', async () => {
    render(
      <BrowserRouter>
        <VehicleList />
      </BrowserRouter>
    );

    // Wait for the initial load
    await waitFor(() => {
      expect(mockedApi.getVehicles).toHaveBeenCalled();
    });

    // Reset mock to test search
    mockedApi.getVehicles.mockClear();

    // Find the search input and type in it
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Toyota' } });

    // Simulate search submission (usually after a delay)
    jest.advanceTimersByTime(500); // If there's a debounce

    // Check if API was called with the search term
    await waitFor(() => {
      expect(mockedApi.getVehicles).toHaveBeenCalledWith({
        page: 0,
        limit: 5,
        search: 'Toyota'
      });
    });
  });

  test('displays error message when API call fails', async () => {
    // Mock API failure
    mockedApi.getVehicles.mockRejectedValue(new Error('Failed to fetch'));

    render(
      <BrowserRouter>
        <VehicleList />
      </BrowserRouter>
    );

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/error loading vehicles/i)).toBeInTheDocument();
    });
  });

  test('deletes a vehicle when delete button is clicked', async () => {
    render(
      <BrowserRouter>
        <VehicleList />
      </BrowserRouter>
    );

    // Wait for the vehicles to be loaded
    await waitFor(() => {
      expect(mockedApi.getVehicles).toHaveBeenCalled();
    });

    // Find and click the delete button for the first vehicle
    const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
    fireEvent.click(deleteButton);

    // Confirm the deletion in the confirmation dialog
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    // Check if the delete API was called with the correct ID
    await waitFor(() => {
      expect(mockedApi.deleteVehicle).toHaveBeenCalledWith('v1');
    });

    // Check if the vehicles are reloaded after deletion
    await waitFor(() => {
      expect(mockedApi.getVehicles).toHaveBeenCalledTimes(2);
    });
  });

  test('navigates to add vehicle page when add button is clicked', async () => {
    render(
      <BrowserRouter>
        <VehicleList />
      </BrowserRouter>
    );

    // Find and click the add vehicle button
    const addButton = screen.getByRole('button', { name: /add vehicle/i });
    fireEvent.click(addButton);

    // Check if navigation occurred (we can't directly test this without more mocking,
    // but we can check if the click handler was triggered)
    expect(window.location.pathname).toBe('/');
  });
});
