export interface Vehicle {
  _id: string;
  make: string;
  model: string;
  licensePlate: string;
  year?: number;
  vin?: string;
}

export interface ServiceProvider {
  name: string;
  contact: string;
  address: string;
}

export interface Cost {
  parts: number;
  labor: number;
  tax: number;
  total: number;
}

export interface MaintenanceRecord {
  _id: string;
  title: string;
  description?: string;
  vehicle: Vehicle;
  type: 'routine' | 'repair' | 'inspection' | 'emergency' | 'recall';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  cost?: Cost;
  odometerReading?: number;
  serviceProvider?: ServiceProvider;
  scheduledDate: string;
  completedDate?: string;
  notes?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MaintenanceStats {
  total: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export interface PaginationModel {
  page: number;
  pageSize: number;
}

export interface MaintenanceParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  status?: string;
  type?: string;
  priority?: string;
  vehicle?: string;
}
