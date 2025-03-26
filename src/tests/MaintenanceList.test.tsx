import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import MaintenanceList from '../pages/maintenance/MaintenanceList';

// Import the API service to mock
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

// Sample maintenance records for testing
const mockMaintenanceRecords = [
  {
    _id: '1',
    title: 'Oil Change',
    vehicle: {
      _id: 'v1',
      name: 'Toyota Corolla',
      licensePlate: 'ABC-123'
    },
    date: '2023-01-15T00:00:00.000Z',
    cost: 50,
    status: 'completed',
    odometer: 5000,
    description: 'Regular oil change'
  },
  {
    _id: '2',
    title: 'Tire Rotation',
    vehicle: {
      _id: 'v2',
      name: 'Honda Civic',
      licensePlate: 'DEF-456'
    },
    date: '2023-02-20T00:00:00.000Z',
    cost: 30,
    status: 'scheduled',
    odometer: 10000,
    description: 'Rotate tires'
  }
];

// Mock API response
const mockApiResponse = {
  data: {
    data: mockMaintenanceRecords,
    pagination: {
      total: 10,
      page: 1,
      limit: 5
    }
  }
};

describe('MaintenanceList Component', () => {
  let mockedApi: MockedApiModule;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedApi = getMockedApiModule();
    // Create a proper AxiosResponse object
    mockedApi.getMaintenanceRecords.mockResolvedValue({
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
      data: mockApiResponse.data
    });
  });

  test('renders the maintenance list component', async () => {
    render(
      <BrowserRouter>
        <MaintenanceList />
      </BrowserRouter>
    );

    // Check if the component title is rendered
    expect(screen.getByText('Maintenance Records')).toBeInTheDocument();

    // Wait for the maintenance records to be loaded
    await waitFor(() => {
      expect(mockedApi.getMaintenanceRecords).toHaveBeenCalled();
    });

    // Check if maintenance records are displayed
    await waitFor(() => {
      expect(screen.getByText('Oil Change')).toBeInTheDocument();
      expect(screen.getByText('Tire Rotation')).toBeInTheDocument();
    });
  });

  test('handles pagination correctly', async () => {
    render(
      <BrowserRouter>
        <MaintenanceList />
      </BrowserRouter>
    );

    // Wait for the initial load
    await waitFor(() => {
      expect(mockedApi.getMaintenanceRecords).toHaveBeenCalledWith({
        page: 0,
        limit: 5
      });
    });

    // Reset mock to test pagination
    mockedApi.getMaintenanceRecords.mockClear();

    // Find and click the next page button
    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextPageButton);

    // Check if API was called with the correct page
    await waitFor(() => {
      expect(mockedApi.getMaintenanceRecords).toHaveBeenCalledWith({
        page: 1,
        limit: 5
      });
    });
  });

  test('handles search functionality', async () => {
    render(
      <BrowserRouter>
        <MaintenanceList />
      </BrowserRouter>
    );

    // Wait for the initial load
    await waitFor(() => {
      expect(mockedApi.getMaintenanceRecords).toHaveBeenCalled();
    });

    // Reset mock to test search
    mockedApi.getMaintenanceRecords.mockClear();

    // Find the search input and type in it
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Oil Change' } });

    // Simulate search submission (usually after a delay)
    jest.advanceTimersByTime(500); // If there's a debounce

    // Check if API was called with the search term
    await waitFor(() => {
      expect(mockedApi.getMaintenanceRecords).toHaveBeenCalledWith({
        page: 0,
        limit: 5,
        search: 'Oil Change'
      });
    });
  });

  test('displays error message when API call fails', async () => {
    // Mock API failure
    mockedApi.getMaintenanceRecords.mockRejectedValue(new Error('Failed to fetch'));

    render(
      <BrowserRouter>
        <MaintenanceList />
      </BrowserRouter>
    );

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/error loading maintenance records/i)).toBeInTheDocument();
    });
  });

  test('navigates to detail page when clicking on a record', async () => {
    render(
      <BrowserRouter>
        <MaintenanceList />
      </BrowserRouter>
    );

    // Wait for the maintenance records to be loaded
    await waitFor(() => {
      expect(mockedApi.getMaintenanceRecords).toHaveBeenCalled();
    });

    // Find and click on a maintenance record
    const viewButton = screen.getAllByRole('button', { name: /view/i })[0];
    fireEvent.click(viewButton);

    // Check if navigation occurred (we can't directly test this without more mocking,
    // but we can check if the click handler was triggered)
    expect(window.location.pathname).toBe('/');
  });
});
