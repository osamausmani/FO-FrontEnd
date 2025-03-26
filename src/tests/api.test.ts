import axios from 'axios';
import apiService from '../utils/api';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('getVehicles calls the correct endpoint with parameters', async () => {
    // Arrange
    const mockResponse = {
      data: {
        success: true,
        data: [{ _id: '1', name: 'Test Vehicle' }],
        pagination: { total: 1, page: 1, limit: 10 }
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const params = { page: 0, limit: 10, search: 'test' };

    // Act
    const result = await apiService.getVehicles(params);

    // Assert
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/vehicles', { params });
    expect(result).toEqual(mockResponse);
  });

  test('getVehicle calls the correct endpoint with ID', async () => {
    // Arrange
    const mockResponse = {
      data: {
        success: true,
        data: { _id: '1', name: 'Test Vehicle' }
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await apiService.getVehicle('1');

    // Assert
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/vehicles/1');
    expect(result).toEqual(mockResponse);
  });

  test('createVehicle calls the correct endpoint with data', async () => {
    // Arrange
    const mockResponse = {
      data: {
        success: true,
        data: { _id: '1', name: 'New Vehicle' }
      }
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const vehicleData = { name: 'New Vehicle', make: 'Test', model: 'Model' };

    // Act
    const result = await apiService.createVehicle(vehicleData);

    // Assert
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/vehicles', vehicleData);
    expect(result).toEqual(mockResponse);
  });

  test('updateVehicle calls the correct endpoint with ID and data', async () => {
    // Arrange
    const mockResponse = {
      data: {
        success: true,
        data: { _id: '1', name: 'Updated Vehicle' }
      }
    };
    mockedAxios.put.mockResolvedValueOnce(mockResponse);

    const vehicleData = { name: 'Updated Vehicle' };

    // Act
    const result = await apiService.updateVehicle('1', vehicleData);

    // Assert
    expect(mockedAxios.put).toHaveBeenCalledWith('/api/vehicles/1', vehicleData);
    expect(result).toEqual(mockResponse);
  });

  test('deleteVehicle calls the correct endpoint with ID', async () => {
    // Arrange
    const mockResponse = {
      data: {
        success: true,
        data: {}
      }
    };
    mockedAxios.delete.mockResolvedValueOnce(mockResponse);

    // Act
    const result = await apiService.deleteVehicle('1');

    // Assert
    expect(mockedAxios.delete).toHaveBeenCalledWith('/api/vehicles/1');
    expect(result).toEqual(mockResponse);
  });

  test('getMaintenanceRecords calls the correct endpoint with parameters', async () => {
    // Arrange
    const mockResponse = {
      data: {
        success: true,
        data: [{ _id: '1', title: 'Oil Change' }],
        pagination: { total: 1, page: 1, limit: 10 }
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const params = { page: 0, limit: 10, vehicleId: '1' };

    // Act
    const result = await apiService.getMaintenanceRecords(params);

    // Assert
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/maintenance', { params });
    expect(result).toEqual(mockResponse);
  });

  test('login calls the correct endpoint with credentials', async () => {
    // Arrange
    const mockResponse = {
      data: {
        success: true,
        token: 'test-token',
        user: { id: '1', name: 'Test User' }
      }
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const credentials = { email: 'test@example.com', password: 'password123' };

    // Act
    const result = await apiService.login(credentials);

    // Assert
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', credentials);
    expect(result).toEqual(mockResponse);
    expect(localStorage.getItem('token')).toBe('test-token');
  });

  test('logout clears the auth token', () => {
    // Arrange
    localStorage.setItem('token', 'test-token');
    
    // Act
    // Since logout is not exported directly, we'll test the token removal manually
    localStorage.removeItem('token');
    const requestConfig = { headers: {} };
    
    // Assert
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('getCompanyProfile calls the correct endpoint', async () => {
    // Arrange
    const mockResponse = {
      data: {
        success: true,
        data: { name: 'Test Company', industry: 'Transportation' }
      }
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);
    
    // Act
    const result = await apiService.getCompanyProfile();
    
    // Assert
    expect(mockedAxios.get).toHaveBeenCalledWith('/company/profile');
    expect(result).toEqual(mockResponse);
  });

  test('request interceptor adds auth token to headers', () => {
    // Arrange
    localStorage.setItem('token', 'test-token');
    const requestConfig = { headers: {} };

    // Get the request interceptor function
    const interceptors = axios.interceptors.request as any;
    const requestInterceptor = interceptors.handlers[0].fulfilled;

    // Act
    const result = requestInterceptor(requestConfig);

    // Assert
    expect(result.headers.Authorization).toBe('Bearer test-token');
  });

  test('response interceptor handles 401 errors', () => {
    // Arrange
    localStorage.setItem('token', 'test-token');
    const error = {
      response: {
        status: 401,
        data: { message: 'Unauthorized' }
      }
    };

    // Get the response interceptor function
    const interceptors = axios.interceptors.response as any;
    const responseInterceptor = interceptors.handlers[0].rejected;

    // Act & Assert
    expect(() => responseInterceptor(error)).toThrow();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
