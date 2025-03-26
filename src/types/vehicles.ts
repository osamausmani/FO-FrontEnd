export interface Vehicle {
  _id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  type: string;
  status: string;
  fuelType: string;
  fuelCapacity: number;
  fuelLevel: number;
  mileage: number;
  assignedDriver?: string;
  company: string;
  location?: {
    type: string;
    coordinates: [number, number];
    lastUpdated: string;
  };
  specifications?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    cargoCapacity?: number;
    passengerCapacity?: number;
    fuelEfficiency?: number;
  };
  registrationExpiry?: string;
  insuranceExpiry?: string;
  lastMaintenance?: string;
  maintenanceSchedule?: {
    type: string;
    interval: number;
    lastPerformed: string;
    nextDue: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
