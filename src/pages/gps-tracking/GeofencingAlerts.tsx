import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Paper
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WarningIcon from '@mui/icons-material/Warning';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

interface GeofenceAlert {
  id: string;
  vehicleId: string;
  vehicleName: string;
  driverId: string;
  driverName: string;
  geofenceId: string;
  geofenceName: string;
  eventType: 'entry' | 'exit' | 'dwell';
  timestamp: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  status: 'new' | 'acknowledged' | 'resolved';
}

const mockAlerts: GeofenceAlert[] = [
  {
    id: 'ga1',
    vehicleId: 'v1',
    vehicleName: 'Truck 101',
    driverId: 'd1',
    driverName: 'John Doe',
    geofenceId: 'gf1',
    geofenceName: 'Warehouse Zone A',
    eventType: 'exit',
    timestamp: '2025-03-19T09:45:00',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: '123 Delivery St, San Francisco, CA'
    },
    status: 'new'
  },
  {
    id: 'ga2',
    vehicleId: 'v2',
    vehicleName: 'Van 202',
    driverId: 'd2',
    driverName: 'Jane Smith',
    geofenceId: 'gf2',
    geofenceName: 'Customer Site B',
    eventType: 'entry',
    timestamp: '2025-03-19T10:15:00',
    location: {
      lat: 37.7833,
      lng: -122.4167,
      address: '456 Pickup Ave, San Francisco, CA'
    },
    status: 'acknowledged'
  },
  {
    id: 'ga3',
    vehicleId: 'v3',
    vehicleName: 'Truck 303',
    driverId: 'd3',
    driverName: 'Mike Johnson',
    geofenceId: 'gf3',
    geofenceName: 'Restricted Area C',
    eventType: 'dwell',
    timestamp: '2025-03-19T11:30:00',
    location: {
      lat: 37.7694,
      lng: -122.4862,
      address: '789 Restricted Rd, San Francisco, CA'
    },
    status: 'resolved'
  }
];

const GeofencingAlerts: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Geofencing Alerts
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Alert severity="info">
          Monitor and manage real-time geofence boundary violations and alerts.
        </Alert>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <NotificationsActiveIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Active Alerts
            </Typography>
            
            <List>
              {mockAlerts.map((alert) => (
                <React.Fragment key={alert.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      {alert.eventType === 'entry' ? (
                        <PlaceIcon color="success" />
                      ) : alert.eventType === 'exit' ? (
                        <PlaceIcon color="error" />
                      ) : (
                        <WarningIcon color="warning" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="subtitle1">
                            {alert.geofenceName} - {alert.eventType.toUpperCase()} Alert
                          </Typography>
                          <Chip 
                            label={alert.status} 
                            color={
                              alert.status === 'new' ? 'error' : 
                              alert.status === 'acknowledged' ? 'warning' : 'success'
                            } 
                            size="small" 
                          />
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Grid container spacing={1} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                              <Box display="flex" alignItems="center">
                                <LocalShippingIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                  {alert.vehicleName} (Driver: {alert.driverName})
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Box display="flex" alignItems="center">
                                <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                  {new Date(alert.timestamp).toLocaleString()}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12}>
                              <Box display="flex" alignItems="center">
                                <PlaceIcon fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                  {alert.location.address}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GeofencingAlerts;
