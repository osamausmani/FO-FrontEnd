// Types for route optimization and planning

export interface OptimizationConstraint {
  type: 'time_window' | 'vehicle_capacity' | 'driver_availability' | 'distance' | 'priority';
  value: any; // Depends on constraint type
}

export interface OptimizationPreference {
  type: 'minimize_fuel' | 'minimize_time' | 'minimize_distance' | 'balance';
  weight: number; // 0-1 representing importance
}

export interface VehicleLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface RouteWaypoint {
  location: VehicleLocation;
  name?: string;
  arrivalTime?: string;
  departureTime?: string;
  waitTime?: number; // in minutes
  serviceTime?: number; // in minutes
  priority?: number; // 1-10, 10 being highest
  timeWindow?: {
    start: string; // ISO date string
    end: string; // ISO date string
  };
}

export interface OptimizedRoute {
  vehicleId: string;
  vehicleName?: string;
  driverId?: string;
  startTime: string;
  endTime: string;
  startLocation: VehicleLocation;
  endLocation: VehicleLocation;
  waypoints: RouteWaypoint[];
  totalDistance: number;
  totalTime: number;
  fuelConsumption: number;
  directionsPolyline: string; // Encoded polyline for the route
  createdAt: string;
  updatedAt?: string;
}

export interface RouteOptimizationRequest {
  vehicles: {
    id: string;
    startLocation: VehicleLocation;
    endLocation?: VehicleLocation;
    capacity?: number;
    fuelEfficiency?: number; // km/L or mpg
  }[];
  drivers?: {
    id: string;
    maxWorkTime?: number; // in minutes
    restTime?: number; // in minutes
    skills?: string[];
  }[];
  stops: {
    id: string;
    location: VehicleLocation;
    timeWindow?: {
      start: string; // ISO date string
      end: string; // ISO date string
    };
    serviceTime?: number; // in minutes
    priority?: number; // 1-10, 10 being highest
    size?: number; // size/weight for capacity constraint
    skills?: string[]; // skills required for this stop
  }[];
  constraints?: OptimizationConstraint[];
  preferences?: OptimizationPreference[];
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  departureTime?: string; // ISO date string
}

export interface RouteOptimizationResponse {
  requestId: string;
  status: 'completed' | 'processing' | 'failed';
  routes: OptimizedRoute[];
  unassignedStops?: {
    id: string;
    reason: string;
  }[];
  summary: {
    totalDistance: number;
    totalTime: number;
    totalFuelConsumption: number;
    savingsEstimate?: {
      distance: number;
      time: number;
      fuel: number;
      cost: number;
    };
  };
}
