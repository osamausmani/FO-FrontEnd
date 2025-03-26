import { LogActionType, LogEntityType } from '../types/logs';
import apiService from './api';

/**
 * LoggingService provides methods to log user actions throughout the application
 * This is a client-side service that sends logging information to the backend
 */
class LoggingService {
  /**
   * Log a user action
   * @param entityType The type of entity being acted upon
   * @param entityId The ID of the entity
   * @param action The action being performed
   * @param entityName Optional name of the entity for better readability
   * @param details Optional additional details about the action
   */
  static logAction = (
    entityType: LogEntityType,
    entityId: string,
    action: LogActionType,
    entityName?: string,
    details?: string
  ): void => {
    try {
      // We don't need to await this as we don't need to block the UI
      apiService.createLog({
        entityType,
        entityId,
        action,
        entityName,
        details
      });
    } catch (error) {
      // Silent fail - logging should never block the application
      console.error('Error logging action:', error);
    }
  };

  /**
   * Log a vehicle action
   */
  static logVehicleAction = (
    vehicleId: string,
    action: LogActionType,
    vehicleName?: string,
    details?: string
  ): void => {
    this.logAction('vehicle', vehicleId, action, vehicleName, details);
  };

  /**
   * Log a driver action
   */
  static logDriverAction = (
    driverId: string,
    action: LogActionType,
    driverName?: string,
    details?: string
  ): void => {
    this.logAction('driver', driverId, action, driverName, details);
  };

  /**
   * Log a maintenance action
   */
  static logMaintenanceAction = (
    maintenanceId: string,
    action: LogActionType,
    maintenanceTitle?: string,
    details?: string
  ): void => {
    this.logAction('maintenance', maintenanceId, action, maintenanceTitle, details);
  };

  /**
   * Log a fuel action
   */
  static logFuelAction = (
    fuelId: string,
    action: LogActionType,
    vehicleName?: string,
    details?: string
  ): void => {
    this.logAction('fuel', fuelId, action, vehicleName, details);
  };

  /**
   * Log a route action
   */
  static logRouteAction = (
    routeId: string,
    action: LogActionType,
    routeName?: string,
    details?: string
  ): void => {
    this.logAction('route', routeId, action, routeName, details);
  };

  /**
   * Log a user action (like login, logout, etc.)
   */
  static logUserAction = (
    userId: string,
    action: LogActionType,
    userName?: string,
    details?: string
  ): void => {
    this.logAction('user', userId, action, userName, details);
  };
}

export default LoggingService;
