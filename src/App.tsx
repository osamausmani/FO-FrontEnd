import React, { useEffect, useState, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './context/AuthContext';
import theme from './theme';

// Layout components
import MainLayout from './components/layout/MainLayout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard pages
import Dashboard from './pages/dashboard/Dashboard';

// Vehicle pages
import VehicleList from './pages/vehicles/VehicleList';
import VehicleDetail from './pages/vehicles/VehicleDetail';
import VehicleForm from './pages/vehicles/VehicleForm';

// Driver pages
import DriverList from './pages/drivers/DriverList';
import DriverDetail from './pages/drivers/DriverDetail';
import DriverForm from './pages/drivers/DriverForm';

// Maintenance pages
import Maintenance from './pages/maintenance/Maintenance';
import MaintenanceForm from './pages/maintenance/MaintenanceForm';

// Fuel pages
import FuelList from './pages/fuel/FuelList';
import FuelDetail from './pages/fuel/FuelDetail';
import FuelForm from './pages/fuel/FuelForm';

// Route pages
import RouteList from './pages/routes/RouteList';
import RouteDetail from './pages/routes/RouteDetail';
import RouteForm from './pages/routes/RouteForm';

// Geofencing pages
import GeofenceList from './pages/geofencing/GeofenceList';
import GeofenceDetail from './pages/geofencing/GeofenceDetail';
import GeofenceForm from './pages/geofencing/GeofenceForm';

// Route Optimization pages
import RouteOptimizationList from './pages/routeOptimization/RouteOptimizationList';
import RouteOptimizationDetail from './pages/routeOptimization/RouteOptimizationDetail';
import RouteOptimizationForm from './pages/routeOptimization/RouteOptimizationForm';

// Report pages
import Reports from './pages/reports/Reports';

// Settings and Help pages
import Settings from './pages/settings/Settings';
import Help from './pages/help/Help';

// Profile page
import Profile from './pages/profile/Profile';

// Notifications page
import Notifications from './pages/notifications/Notifications';

// Activity Logs page
import ActivityLogs from './pages/logs/ActivityLogs';

// GPS Tracking pages
const GPSTracking = React.lazy(() => import('./pages/gps-tracking/GPSTracking'));
const LiveTracking = React.lazy(() => import('./pages/gps-tracking/LiveTracking'));
const GeofencingAlerts = React.lazy(() => import('./pages/gps-tracking/GeofencingAlerts'));
const RouteOptimizationAI = React.lazy(() => import('./pages/gps-tracking/RouteOptimizationAI'));
const TripHistory = React.lazy(() => import('./pages/gps-tracking/TripHistory'));
const CustomMapOverlays = React.lazy(() => import('./pages/gps-tracking/CustomMapOverlays'));
const SpeedMonitoring = React.lazy(() => import('./pages/gps-tracking/SpeedMonitoring'));
const IdleTimeTracking = React.lazy(() => import('./pages/gps-tracking/IdleTimeTracking'));
const CargoMonitoring = React.lazy(() => import('./pages/gps-tracking/CargoMonitoring'));
const EngineDiagnostics = React.lazy(() => import('./pages/gps-tracking/EngineDiagnostics'));
const LiveLocationSharing = React.lazy(() => import('./pages/gps-tracking/LiveLocationSharing'));

// Driver Management pages
const DriverPerformance = React.lazy(() => import('./pages/driver-management/DriverPerformance'));

// Messaging page
import Messaging from './pages/communication/Messaging';

// Integration page
import ThirdPartyIntegration from './pages/integration/ThirdPartyIntegration';

// User Management page
import UserManagement from './pages/user-management/UserManagement';

// Sustainability page
import SustainabilityDashboard from './pages/sustainability/SustainabilityDashboard';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Protected route component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          
          {/* Vehicle routes */}
          <Route path="vehicles" element={<VehicleList />} />
          <Route path="vehicles/:id" element={<VehicleDetail />} />
          <Route path="vehicles/new" element={<VehicleForm />} />
          <Route path="vehicles/:id/edit" element={<VehicleForm />} />
          
          {/* Driver routes */}
          <Route path="drivers" element={<DriverList />} />
          <Route path="drivers/:id" element={<DriverDetail />} />
          <Route path="drivers/new" element={<DriverForm />} />
          <Route path="drivers/:id/edit" element={<DriverForm />} />
          
          {/* Maintenance routes */}
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="maintenance/new" element={<MaintenanceForm />} />
          <Route path="maintenance/:id/edit" element={<MaintenanceForm />} />
          
          {/* Fuel routes */}
          <Route path="fuel" element={<FuelList />} />
          <Route path="fuel/:id" element={<FuelDetail />} />
          <Route path="fuel/new" element={<FuelForm />} />
          <Route path="fuel/:id/edit" element={<FuelForm />} />
          
          {/* Route routes */}
          <Route path="routes" element={<RouteList />} />
          <Route path="routes/:id" element={<RouteDetail />} />
          <Route path="routes/new" element={<RouteForm />} />
          <Route path="routes/:id/edit" element={<RouteForm />} />
          
          {/* Geofencing routes */}
          <Route path="geofencing" element={<GeofenceList />} />
          <Route path="geofencing/:id" element={<GeofenceDetail />} />
          <Route path="geofencing/new" element={<GeofenceForm />} />
          <Route path="geofencing/:id/edit" element={<GeofenceForm />} />
          
          {/* Route Optimization routes */}
          <Route path="route-optimization" element={<RouteOptimizationList />} />
          <Route path="route-optimization/:id" element={<RouteOptimizationDetail />} />
          <Route path="route-optimization/new" element={<RouteOptimizationForm />} />
          <Route path="route-optimization/:id/edit" element={<RouteOptimizationForm />} />
          
          {/* Report routes */}
          <Route path="reports" element={<Reports />} />
          
          {/* Settings and Help routes */}
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
          
          {/* Profile route */}
          <Route path="profile" element={<Profile />} />
          
          {/* Notifications route */}
          <Route path="notifications" element={<Notifications />} />
          
          {/* Activity Logs route */}
          <Route path="activity-logs" element={<ActivityLogs />} />

          {/* GPS Tracking routes */}
          <Route path="gps-tracking" element={
            <Suspense fallback={<div>Loading...</div>}>
              <GPSTracking />
            </Suspense>
          } />
          <Route path="gps-tracking/live" element={
            <Suspense fallback={<div>Loading...</div>}>
              <LiveTracking />
            </Suspense>
          } />
          <Route path="gps-tracking/geofencing-alerts" element={
            <Suspense fallback={<div>Loading...</div>}>
              <GeofencingAlerts />
            </Suspense>
          } />
          <Route path="gps-tracking/route-optimization" element={
            <Suspense fallback={<div>Loading...</div>}>
              <RouteOptimizationAI />
            </Suspense>
          } />
          <Route path="gps-tracking/trip-history" element={
            <Suspense fallback={<div>Loading...</div>}>
              <TripHistory />
            </Suspense>
          } />
          <Route path="gps-tracking/map-overlays" element={
            <Suspense fallback={<div>Loading...</div>}>
              <CustomMapOverlays />
            </Suspense>
          } />
          <Route path="gps-tracking/speed-monitoring" element={
            <Suspense fallback={<div>Loading...</div>}>
              <SpeedMonitoring />
            </Suspense>
          } />
          <Route path="gps-tracking/idle-time" element={
            <Suspense fallback={<div>Loading...</div>}>
              <IdleTimeTracking />
            </Suspense>
          } />
          <Route path="gps-tracking/cargo-monitoring" element={
            <Suspense fallback={<div>Loading...</div>}>
              <CargoMonitoring />
            </Suspense>
          } />
          <Route path="gps-tracking/engine-diagnostics" element={
            <Suspense fallback={<div>Loading...</div>}>
              <EngineDiagnostics />
            </Suspense>
          } />
          <Route path="gps-tracking/location-sharing" element={
            <Suspense fallback={<div>Loading...</div>}>
              <LiveLocationSharing />
            </Suspense>
          } />

          {/* Driver Management routes */}
          <Route path="driver-management" element={
            <Suspense fallback={<div>Loading...</div>}>
              <DriverPerformance />
            </Suspense>
          } />
          
          {/* Communication routes */}
          <Route path="communication/messaging" element={<Messaging />} />

          {/* Integration routes */}
          <Route path="integrations/third-party" element={<ThirdPartyIntegration />} />

          {/* Sustainability routes */}
          <Route path="sustainability" element={<SustainabilityDashboard />} />

          {/* User Management routes */}
          <Route path="user-management/user-management" element={<UserManagement />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;
