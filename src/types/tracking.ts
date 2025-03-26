// Types for GPS tracking and real-time monitoring

export interface GpsPosition {
  latitude: number;
  longitude: number;
  altitude?: number;
  speed?: number; // in km/h
  heading?: number; // in degrees, 0 is north
  accuracy?: number; // in meters
  timestamp: string;
}

export interface VehicleLocation {
  vehicleId: string;
  vehicleName: string;
  position: GpsPosition;
  status: 'moving' | 'idle' | 'stopped' | 'offline';
  idleTime?: number; // in seconds
  driverId?: string;
  driverName?: string;
}

export interface TrackingHistoryEntry {
  vehicleId: string;
  position: GpsPosition;
  event?: 'start' | 'stop' | 'idle' | 'resume' | 'speeding' | 'geofence_enter' | 'geofence_exit';
  geofenceId?: string;
  geofenceName?: string;
}

export interface TrackingHistoryFilter {
  vehicleId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
  events?: string[];
  geofenceId?: string;
}

export interface DriverBehaviorEvent {
  driverId: string;
  vehicleId: string;
  eventType: 'harsh_acceleration' | 'harsh_braking' | 'harsh_cornering' | 'speeding' | 'distraction' | 'fatigue';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  position: GpsPosition;
  speed?: number;
  value?: number; // Depends on eventType: g-force, speed, etc.
}

export interface DriverScorecard {
  driverId: string;
  driverName: string;
  period: string; // 'daily', 'weekly', 'monthly'
  startDate: string;
  endDate: string;
  totalDistance: number;
  totalDrivingTime: number; // in seconds
  scores: {
    overall: number;
    safety: number;
    efficiency: number;
    compliance: number;
  };
  events: {
    harsh_acceleration: number;
    harsh_braking: number;
    harsh_cornering: number;
    speeding: number;
    distraction: number;
    fatigue: number;
  };
  fuelConsumption: {
    total: number;
    efficiency: number; // in l/100km or mpg
  };
}

export interface DriverPerformanceHistory {
  date: string;
  overall: number;
  safety: number;
  efficiency: number;
  compliance: number;
  harsh_acceleration: number;
  harsh_braking: number;
  harsh_cornering: number;
  speeding: number;
  distraction: number;
  fatigue: number;
}
