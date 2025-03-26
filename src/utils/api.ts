import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { MaintenanceParams, MaintenanceRecord } from '../types/maintenance';
import { VehicleLocation, TrackingHistoryEntry, DriverScorecard, DriverBehaviorEvent, DriverPerformanceHistory } from '../types/tracking';
import { Geofence, GeofenceEvent } from '../types/geofencing';
import { RouteOptimizationRequest, RouteOptimizationResponse, OptimizedRoute } from '../types/routeOptimization';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle unauthorized errors
    if (response && response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Session expired. Please log in again.');
    }
    
    // Handle server errors
    if (response && response.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

// API service functions
const apiService = {
  // Auth
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  register: (userData: any) => 
    api.post('/auth/register', userData),
  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => 
    api.post(`/auth/reset-password/${token}`, { password }),
  verifyToken: (token: string) => 
    api.get(`/auth/verify-token/${token}`),
  getCurrentUser: () => 
    api.get('/auth/me'),
  updateUserProfile: (data: any) => 
    api.put('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) => 
    api.put('/auth/change-password', data),
  
  // Company
  getCompanyProfile: () => 
    api.get('/company/profile'),
  updateCompanyProfile: (data: any) => 
    api.put('/company/profile', data),
  updateCompanySettings: (data: any) => 
    api.put('/company/settings', data),
  updateNotificationSettings: (data: any) => 
    api.put('/company/notifications', data),
  
  // Vehicles
  getVehicles: (params?: any) => 
    api.get('/vehicles', { params }),
  getVehicle: (id: string) => 
    api.get(`/vehicles/${id}`),
  createVehicle: (data: any) => 
    api.post('/vehicles', data),
  updateVehicle: (id: string, data: any) => 
    api.put(`/vehicles/${id}`, data),
  deleteVehicle: (id: string) => 
    api.delete(`/vehicles/${id}`),
  updateVehicleLocation: (id: string, data: any) => 
    api.put(`/vehicles/${id}/location`, data),
  updateVehicleOdometer: (id: string, data: any) => 
    api.put(`/vehicles/${id}/odometer`, data),
  
  // Drivers
  getDrivers: (params?: any) => 
    api.get('/drivers', { params }),
  getDriver: (id: string) => 
    api.get(`/drivers/${id}`),
  createDriver: (data: any) => 
    api.post('/drivers', data),
  updateDriver: (id: string, data: any) => 
    api.put(`/drivers/${id}`, data),
  deleteDriver: (id: string) => 
    api.delete(`/drivers/${id}`),
  assignVehicle: (id: string, data: { vehicleId: string }) => 
    api.put(`/drivers/${id}/assign-vehicle`, data),
  unassignVehicle: (id: string) => 
    api.put(`/drivers/${id}/unassign-vehicle`),
  
  // Maintenance
  getMaintenanceRecords: (params?: MaintenanceParams) => 
    api.get<{ data: MaintenanceRecord[]; pagination: { total: number } }>('/maintenance', { params }),
  getMaintenanceRecord: (id: string) => 
    api.get<{ data: MaintenanceRecord }>(`/maintenance/${id}`),
  createMaintenanceRecord: (data: Partial<MaintenanceRecord>) => 
    api.post('/maintenance', data),
  updateMaintenanceRecord: (id: string, data: Partial<MaintenanceRecord>) => 
    api.put(`/maintenance/${id}`, data),
  deleteMaintenanceRecord: (id: string) => 
    api.delete(`/maintenance/${id}`),
  
  // Fuel Records
  getFuelRecords: (params?: any) => 
    api.get('/fuel', { params }),
  getFuelRecord: (id: string) => 
    api.get(`/fuel/${id}`),
  createFuelRecord: (data: any) => 
    api.post('/fuel', data),
  updateFuelRecord: (id: string, data: any) => 
    api.put(`/fuel/${id}`, data),
  deleteFuelRecord: (id: string) => 
    api.delete(`/fuel/${id}`),
  getFuelStatistics: (params?: any) => 
    api.get('/fuel/statistics', { params }),
  
  // Routes
  getRoutes: (params?: any) => 
    api.get('/routes', { params }),
  getRoute: (id: string) => 
    api.get(`/routes/${id}`),
  createRoute: (data: any) => 
    api.post('/routes', data),
  updateRoute: (id: string, data: any) => 
    api.put(`/routes/${id}`, data),
  deleteRoute: (id: string) => 
    api.delete(`/routes/${id}`),
  updateWaypointStatus: (id: string, waypointId: string, data: any) => 
    api.put(`/routes/${id}/waypoints/${waypointId}`, data),
  getDriverActiveRoutes: (driverId: string) => 
    api.get(`/routes/driver/${driverId}/active`),
  
  // Reports
  getVehicleUtilization: (params?: any) => 
    api.get('/reports/vehicle-utilization', { params }),
  getDriverPerformance: (params?: any) => 
    api.get('/reports/driver-performance', { params }),
  getFuelConsumption: (params?: any) => 
    api.get('/reports/fuel-consumption', { params }),
  getMaintenanceCost: (params?: any) => 
    api.get('/reports/maintenance-cost', { params }),
  getFleetSummary: () => 
    api.get('/reports/fleet-summary'),
  getDriverStats: () => 
    api.get('/reports/driver-stats'),
  
  // Notifications
  getNotifications: (params?: any) => 
    api.get('/notifications', { params }),
  markNotificationAsRead: (id: string) => 
    api.put(`/notifications/${id}/read`),
  markAllNotificationsAsRead: () => 
    api.put('/notifications/read-all'),
  deleteNotification: (id: string) => 
    api.delete(`/notifications/${id}`),
  
  // Dashboard
  getDashboardData: () => 
    api.get('/dashboard'),
  
  // Log related endpoints
  getLogs: (params: any = {}) => {
    return api.get('/logs', { params });
  },
  getLogById: (id: string) => {
    return api.get(`/logs/${id}`);
  },
  createLog: (logData: any) => {
    return api.post('/logs', logData);
  },
  getLogStats: (params: any = {}) => {
    return api.get('/logs/stats', { params });
  },
  exportLogs: (params: any = {}) => {
    return api.get('/logs/export', { 
      params,
      responseType: 'blob'
    });
  },
  seedLogs: () => {
    return api.post('/logs/seed');
  },
  
  // Tracking related endpoints
  getVehicleLocations: () => 
    api.get<{ data: VehicleLocation[] }>('/tracking/vehicles'),
  getTrackingHistory: (vehicleId: string, params?: { startDate?: string, endDate?: string }) => 
    api.get<{ data: TrackingHistoryEntry[] }>(`/tracking/history/${vehicleId}`, { params }),
  updateVehicleLocationRealtime: (vehicleId: string, data: any) => 
    api.put(`/tracking/vehicles/${vehicleId}/location`, data),
  getDriverScorecard: (driverId: string, params?: { period?: 'daily' | 'weekly' | 'monthly' }) => 
    api.get<{ data: DriverScorecard }>(`/tracking/drivers/${driverId}/scorecard`, { params }),
  getDriverBehaviorEvents: (driverId: string, params?: { startDate?: string, endDate?: string, eventType?: string }) => 
    api.get<{ data: DriverBehaviorEvent[] }>(`/tracking/drivers/${driverId}/events`, { params }),
  getDriverPerformanceHistory: (driverId: string, params?: { period?: 'daily' | 'weekly' | 'monthly' | 'quarterly' }) => 
    api.get<{ data: DriverPerformanceHistory[] }>(`/tracking/drivers/${driverId}/performance-history`, { params }),
  
  // Geofencing related endpoints
  getGeofences: async () => {
    return await api.get<{ data: Geofence[] }>('/geofencing');
  },
  
  getGeofence: async (id: string) => {
    return await api.get<{ data: Geofence }>(`/geofencing/${id}`);
  },
  
  getGeofenceEvents: async (id: string, params?: { startDate?: string, endDate?: string, vehicleId?: string, eventType?: string }) => {
    return await api.get<{ data: GeofenceEvent[] }>(`/geofencing/${id}/events`, { params });
  },
  
  createGeofence: async (data: Partial<Geofence>) => {
    return await api.post<{ data: Geofence }>('/geofencing', data);
  },
  
  updateGeofence: async (id: string, data: Partial<Geofence>) => {
    return await api.put<{ data: Geofence }>(`/geofencing/${id}`, data);
  },
  
  deleteGeofence: async (id: string) => {
    return await api.delete(`/geofencing/${id}`);
  },
  
  checkGeofences: (data: { vehicleId: string, latitude: number, longitude: number }) => 
    api.post('/geofencing/check', data),
  
  // Route Optimization endpoints
  getRouteOptimizations: async () => {
    return await api.get<{ data: OptimizedRoute[] }>('/route-optimization');
  },
  
  getRouteOptimization: async (id: string) => {
    return await api.get<{ data: OptimizedRoute }>(`/route-optimization/${id}`);
  },
  
  createRouteOptimization: async (data: RouteOptimizationRequest) => {
    return await api.post<{ data: RouteOptimizationResponse }>('/route-optimization', data);
  },
  
  updateRouteOptimization: async (id: string, data: RouteOptimizationRequest) => {
    return await api.put<{ data: RouteOptimizationResponse }>(`/route-optimization/${id}`, data);
  },
  
  deleteRouteOptimization: async (id: string) => {
    return await api.delete(`/route-optimization/${id}`);
  },
  
  optimizeRoutes: (data: RouteOptimizationRequest) => 
    api.post<{ data: RouteOptimizationResponse }>('/route-optimization/optimize', data),
  getOptimizationResult: (requestId: string) => 
    api.get<{ data: RouteOptimizationResponse }>(`/route-optimization/optimize/${requestId}`),
  createRoutesFromOptimization: (data: { optimizationId: string, routes: any[] }) => 
    api.post('/route-optimization/create-from-optimization', data)
};

// Export individual functions for direct import
export const login = apiService.login;
export const register = apiService.register;
export const forgotPassword = apiService.forgotPassword;
export const resetPassword = apiService.resetPassword;
export const verifyToken = apiService.verifyToken;
export const getCurrentUser = apiService.getCurrentUser;
export const updateUserProfile = apiService.updateUserProfile;
export const changePassword = apiService.changePassword;

// Company
export const getCompanyProfile = apiService.getCompanyProfile;
export const updateCompanyProfile = apiService.updateCompanyProfile;
export const updateCompanySettings = apiService.updateCompanySettings;
export const updateNotificationSettings = apiService.updateNotificationSettings;

// Vehicles
export const getVehicles = apiService.getVehicles;
export const getVehicle = apiService.getVehicle;
export const createVehicle = apiService.createVehicle;
export const updateVehicle = apiService.updateVehicle;
export const deleteVehicle = apiService.deleteVehicle;
export const updateVehicleLocation = apiService.updateVehicleLocation;
export const updateVehicleOdometer = apiService.updateVehicleOdometer;

// Drivers
export const getDrivers = apiService.getDrivers;
export const getDriver = apiService.getDriver;
export const createDriver = apiService.createDriver;
export const updateDriver = apiService.updateDriver;
export const deleteDriver = apiService.deleteDriver;
export const assignVehicle = apiService.assignVehicle;
export const unassignVehicle = apiService.unassignVehicle;

// Maintenance
export const getMaintenanceRecords = apiService.getMaintenanceRecords;
export const getMaintenanceRecord = apiService.getMaintenanceRecord;
export const createMaintenanceRecord = apiService.createMaintenanceRecord;
export const updateMaintenanceRecord = apiService.updateMaintenanceRecord;
export const deleteMaintenanceRecord = apiService.deleteMaintenanceRecord;

// Routes
export const getRoutes = apiService.getRoutes;
export const getRoute = apiService.getRoute;
export const createRoute = apiService.createRoute;
export const updateRoute = apiService.updateRoute;
export const deleteRoute = apiService.deleteRoute;
export const updateWaypointStatus = apiService.updateWaypointStatus;
export const getDriverActiveRoutes = apiService.getDriverActiveRoutes;

export default apiService;
