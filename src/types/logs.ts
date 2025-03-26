// Types for the logging system

export type LogEntityType = 
  | 'vehicle'
  | 'driver'
  | 'maintenance'
  | 'fuel'
  | 'route'
  | 'notification'
  | 'user'
  | 'setting'
  | 'report'
  | 'geofence'
  | 'route_optimization';

export type LogActionType = 
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'assign'
  | 'complete'
  | 'cancel'
  | 'login'
  | 'logout'
  | 'export';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface LogEntry {
  _id: string;
  id?: string;
  user: User;
  entityType: LogEntityType;
  entityId: string;
  entityName?: string;
  action: LogActionType;
  details?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface LogsResponse {
  data: LogEntry[];
  total: number;
  page: number;
  limit: number;
}

export interface LogFilterParams {
  page?: number;
  limit?: number;
  entityType?: LogEntityType;
  action?: LogActionType;
  userId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}
