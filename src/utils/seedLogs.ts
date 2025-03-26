import { LogEntry, LogEntityType, LogActionType } from '../types/logs';

// Generate a user for the logs
const user = {
  _id: '60d21b4667d0d8992e610c80',
  name: 'Admin User',
  email: 'admin@fleetapp.com',
  role: 'admin'
};

// Generate a timestamp within the last 7 days
const getRandomTimestamp = () => {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
  return pastDate.toISOString();
};

// Seed data for logs
export const seedLogs: LogEntry[] = [
  {
    _id: '60d21b4667d0d8992e610d01',
    user,
    entityType: 'vehicle',
    entityId: '60d21b4667d0d8992e610c85',
    entityName: 'Toyota Camry',
    action: 'create',
    details: 'Created new vehicle Toyota Camry',
    timestamp: getRandomTimestamp(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    _id: '60d21b4667d0d8992e610d02',
    user,
    entityType: 'vehicle',
    entityId: '60d21b4667d0d8992e610c86',
    entityName: 'Honda Civic',
    action: 'update',
    details: 'Updated vehicle information for Honda Civic',
    timestamp: getRandomTimestamp(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    _id: '60d21b4667d0d8992e610d03',
    user,
    entityType: 'driver',
    entityId: '60d21b4667d0d8992e610c88',
    entityName: 'John Smith',
    action: 'create',
    details: 'Added new driver John Smith',
    timestamp: getRandomTimestamp(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    _id: '60d21b4667d0d8992e610d04',
    user,
    entityType: 'driver',
    entityId: '60d21b4667d0d8992e610c89',
    entityName: 'Jane Doe',
    action: 'assign',
    details: 'Assigned Jane Doe to Toyota Camry',
    timestamp: getRandomTimestamp(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    _id: '60d21b4667d0d8992e610d05',
    user,
    entityType: 'maintenance',
    entityId: '60d21b4667d0d8992e610c91',
    entityName: 'Oil Change',
    action: 'create',
    details: 'Scheduled oil change for Toyota Camry',
    timestamp: getRandomTimestamp(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    _id: '60d21b4667d0d8992e610d06',
    user,
    entityType: 'maintenance',
    entityId: '60d21b4667d0d8992e610c92',
    entityName: 'Tire Rotation',
    action: 'complete',
    details: 'Completed tire rotation for Honda Civic',
    timestamp: getRandomTimestamp(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    _id: '60d21b4667d0d8992e610d07',
    user,
    entityType: 'fuel',
    entityId: '60d21b4667d0d8992e610c94',
    entityName: 'Fuel Record #1',
    action: 'create',
    details: 'Added fuel record for Toyota Camry: 15 gallons',
    timestamp: getRandomTimestamp(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    _id: '60d21b4667d0d8992e610d08',
    user,
    entityType: 'route',
    entityId: '60d21b4667d0d8992e610c97',
    entityName: 'Route to Warehouse',
    action: 'create',
    details: 'Created new route to warehouse',
    timestamp: getRandomTimestamp(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    _id: '60d21b4667d0d8992e610d09',
    user,
    entityType: 'route',
    entityId: '60d21b4667d0d8992e610c98',
    entityName: 'Delivery Route #42',
    action: 'assign',
    details: 'Assigned Delivery Route #42 to John Smith',
    timestamp: getRandomTimestamp(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    _id: '60d21b4667d0d8992e610d10',
    user,
    entityType: 'vehicle',
    entityId: '60d21b4667d0d8992e610c87',
    entityName: 'Ford F-150',
    action: 'delete',
    details: 'Removed vehicle Ford F-150 from fleet',
    timestamp: getRandomTimestamp(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    _id: '60d21b4667d0d8992e610d11',
    user,
    entityType: 'user',
    entityId: '60d21b4667d0d8992e610c9a',
    entityName: 'New Manager',
    action: 'create',
    details: 'Added new user: New Manager (manager@fleetapp.com)',
    timestamp: getRandomTimestamp(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    _id: '60d21b4667d0d8992e610d12',
    user,
    entityType: 'notification',
    entityId: '60d21b4667d0d8992e610c9b',
    entityName: 'Maintenance Alert',
    action: 'create',
    details: 'Created maintenance alert for Honda Civic',
    timestamp: getRandomTimestamp(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    _id: '60d21b4667d0d8992e610d13',
    user,
    entityType: 'setting',
    entityId: '60d21b4667d0d8992e610c9c',
    entityName: 'Notification Settings',
    action: 'update',
    details: 'Updated notification settings',
    timestamp: getRandomTimestamp(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    _id: '60d21b4667d0d8992e610d14',
    user,
    entityType: 'report',
    entityId: '60d21b4667d0d8992e610c9d',
    entityName: 'Monthly Report',
    action: 'create',
    details: 'Generated monthly fleet report',
    timestamp: getRandomTimestamp(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    _id: '60d21b4667d0d8992e610d15',
    user,
    entityType: 'user',
    entityId: user._id,
    entityName: user.name,
    action: 'login',
    details: 'User logged in',
    timestamp: getRandomTimestamp(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  }
];

// Generate more seed logs
export const generateMoreSeedLogs = (count: number = 35): LogEntry[] => {
  const entityTypes: LogEntityType[] = ['vehicle', 'driver', 'maintenance', 'fuel', 'route', 'user', 'notification', 'setting', 'report', 'geofence', 'route_optimization'];
  const actionTypes: LogActionType[] = ['create', 'update', 'delete', 'view', 'assign', 'complete', 'login', 'logout', 'export'];
  
  const entityNames = {
    vehicle: ['Toyota Camry', 'Honda Civic', 'Ford F-150', 'Chevrolet Silverado', 'Tesla Model 3'],
    driver: ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Williams', 'David Brown'],
    maintenance: ['Oil Change', 'Tire Rotation', 'Brake Inspection', 'Engine Tune-up', 'Battery Replacement'],
    fuel: ['Fuel Record #1', 'Fuel Record #2', 'Fuel Record #3', 'Fuel Record #4', 'Fuel Record #5'],
    route: ['Route to Warehouse', 'Delivery Route #42', 'Downtown Loop', 'Airport Shuttle', 'Cross-country Route'],
    user: ['Admin User', 'Manager User', 'Driver User', 'Support Staff', 'System Administrator'],
    notification: ['Maintenance Alert', 'Low Fuel Warning', 'Route Delay', 'Driver Assignment', 'System Update'],
    setting: ['Notification Settings', 'System Settings', 'User Preferences', 'Security Settings', 'Display Settings'],
    report: ['Monthly Report', 'Quarterly Summary', 'Driver Performance', 'Fuel Efficiency', 'Maintenance Costs'],
    geofence: ['Office Geofence', 'Warehouse Area', 'Delivery Zone', 'Restricted Area', 'Customer Location'],
    route_optimization: ['Daily Optimization', 'Weekly Plan', 'Delivery Optimization', 'Service Route Plan', 'Multi-stop Route']
  };
  
  const additionalLogs: LogEntry[] = [];
  
  for (let i = 0; i < count; i++) {
    const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
    const action = actionTypes[Math.floor(Math.random() * actionTypes.length)];
    const entityName = entityNames[entityType][Math.floor(Math.random() * entityNames[entityType].length)];
    
    additionalLogs.push({
      _id: `60d21b4667d0d8992e610e${i.toString().padStart(2, '0')}`,
      user,
      entityType,
      entityId: `60d21b4667d0d8992e610f${i.toString().padStart(2, '0')}`,
      entityName,
      action,
      details: `${action.charAt(0).toUpperCase() + action.slice(1)} ${entityType} ${entityName}`,
      timestamp: getRandomTimestamp(),
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    });
  }
  
  return additionalLogs;
};

// Get all seed logs (base + additional)
export const getAllSeedLogs = (): LogEntry[] => {
  return [...seedLogs, ...generateMoreSeedLogs()];
};
