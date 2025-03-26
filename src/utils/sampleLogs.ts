import apiService from './api';
import { LogActionType, LogEntityType } from '../types/logs';

// Sample data for entities
const sampleEntities: Record<string, Array<{ id: string; name: string }>> = {
  vehicle: [
    { id: '60d21b4667d0d8992e610c85', name: 'Toyota Camry' },
    { id: '60d21b4667d0d8992e610c86', name: 'Honda Civic' },
    { id: '60d21b4667d0d8992e610c87', name: 'Ford F-150' },
  ],
  driver: [
    { id: '60d21b4667d0d8992e610c88', name: 'John Smith' },
    { id: '60d21b4667d0d8992e610c89', name: 'Jane Doe' },
    { id: '60d21b4667d0d8992e610c90', name: 'Mike Johnson' },
  ],
  maintenance: [
    { id: '60d21b4667d0d8992e610c91', name: 'Oil Change' },
    { id: '60d21b4667d0d8992e610c92', name: 'Tire Rotation' },
    { id: '60d21b4667d0d8992e610c93', name: 'Brake Inspection' },
  ],
  fuel: [
    { id: '60d21b4667d0d8992e610c94', name: 'Fuel Record #1' },
    { id: '60d21b4667d0d8992e610c95', name: 'Fuel Record #2' },
    { id: '60d21b4667d0d8992e610c96', name: 'Fuel Record #3' },
  ],
  route: [
    { id: '60d21b4667d0d8992e610c97', name: 'Route to Warehouse' },
    { id: '60d21b4667d0d8992e610c98', name: 'Delivery Route #42' },
    { id: '60d21b4667d0d8992e610c99', name: 'Downtown Loop' },
  ],
  user: [
    { id: '60d21b4667d0d8992e610c9a', name: 'Admin User' },
  ],
  notification: [
    { id: '60d21b4667d0d8992e610c9b', name: 'System Notification' },
  ],
  setting: [
    { id: '60d21b4667d0d8992e610c9c', name: 'System Settings' },
  ],
  report: [
    { id: '60d21b4667d0d8992e610c9d', name: 'Monthly Report' },
  ],
};

// Generate a random log entry
const generateRandomLog = () => {
  const entityTypes: LogEntityType[] = ['vehicle', 'driver', 'maintenance', 'fuel', 'route', 'user', 'notification', 'setting', 'report'];
  const actionTypes: LogActionType[] = ['create', 'update', 'delete', 'view', 'assign', 'complete'];
  
  const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)] as string;
  const action = actionTypes[Math.floor(Math.random() * actionTypes.length)];
  
  const entityArray = sampleEntities[entityType];
  const entity = entityArray[Math.floor(Math.random() * entityArray.length)];
  
  // Generate a timestamp within the last 7 days
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
  
  return {
    entityType,
    entityId: entity.id,
    entityName: entity.name,
    action,
    details: `${action.charAt(0).toUpperCase() + action.slice(1)} ${entityType} ${entity.name}`,
    timestamp: pastDate.toISOString(),
  };
};

// Create multiple sample logs
export const createSampleLogs = async (count: number = 50) => {
  console.log(`Creating ${count} sample log entries...`);
  
  const promises = [];
  for (let i = 0; i < count; i++) {
    const logData = generateRandomLog();
    promises.push(apiService.createLog(logData));
  }
  
  try {
    await Promise.all(promises);
    console.log(`Successfully created ${count} sample log entries.`);
    return true;
  } catch (error) {
    console.error('Error creating sample logs:', error);
    return false;
  }
};
