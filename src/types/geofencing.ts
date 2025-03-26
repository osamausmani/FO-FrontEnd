// Types for geofencing and location-based alerts

export type GeofenceType = 'circle' | 'polygon' | 'rectangle';

export interface GeofenceCenter {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface GeofenceGeometry {
  // For circle type
  center?: GeofenceCenter;
  radius?: number; // in meters
  
  // For polygon and rectangle types
  coordinates?: [number, number][][]; // Array of rings with [longitude, latitude] pairs
}

export interface GeofenceSchedule {
  active: boolean;
  startTime?: string; // Format: 'HH:MM'
  endTime?: string; // Format: 'HH:MM'
  daysOfWeek?: number[]; // 0 = Sunday, 6 = Saturday
}

export interface GeofenceAlertConfig {
  entry: boolean;
  exit: boolean;
  dwell: boolean;
  dwellTime?: number; // Time in minutes before dwell alert is triggered
  speedLimit?: number; // Speed limit within geofence (km/h)
}

export interface GeofenceNotificationConfig {
  email?: string[];
  sms?: string[];
  pushNotification: boolean;
}

export interface Geofence {
  _id: string;
  name: string;
  description?: string;
  type: GeofenceType;
  geometry: GeofenceGeometry;
  address?: string;
  vehicles: string[];
  alertType: GeofenceAlertConfig;
  schedule: GeofenceSchedule;
  notifications: GeofenceNotificationConfig;
  status: 'active' | 'inactive';
  tags?: string[];
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GeofenceEvent {
  _id: string;
  geofenceId: string;
  geofenceName: string;
  vehicleId: string;
  vehicleName: string;
  driverId?: string;
  driverName?: string;
  eventType: 'entry' | 'exit' | 'dwell' | 'speeding';
  timestamp: string;
  position: {
    latitude: number;
    longitude: number;
  };
  speed?: number;
  dwellTime?: number; // in minutes
}

export interface GeofenceEventFilter {
  geofenceId?: string;
  vehicleId?: string;
  driverId?: string;
  eventType?: 'entry' | 'exit' | 'dwell' | 'speeding';
  startDate?: string;
  endDate?: string;
}
