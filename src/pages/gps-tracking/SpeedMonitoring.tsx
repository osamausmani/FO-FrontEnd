import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Slider,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Alert,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import WarningIcon from '@mui/icons-material/Warning';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface SpeedEvent {
  id: string;
  vehicleId: string;
  vehicleName: string;
  driverId: string;
  driverName: string;
  timestamp: string;
  speed: number;
  speedLimit: number;
  duration: number;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  acknowledged: boolean;
}

const mockSpeedEvents: SpeedEvent[] = [
  {
    id: 'se1',
    vehicleId: 'v1',
    vehicleName: 'Truck 101',
    driverId: 'd1',
    driverName: 'John Doe',
    timestamp: '2025-03-19T09:45:00',
    speed: 78,
    speedLimit: 65,
    duration: 3.5,
    location: 'Highway 101, San Francisco',
    coordinates: {
      lat: 37.7749,
      lng: -122.4194
    },
    acknowledged: false
  },
  {
    id: 'se2',
    vehicleId: 'v2',
    vehicleName: 'Van 202',
    driverId: 'd2',
    driverName: 'Jane Smith',
    timestamp: '2025-03-19T10:15:00',
    speed: 72,
    speedLimit: 55,
    duration: 5.2,
    location: 'Interstate 280, Palo Alto',
    coordinates: {
      lat: 37.4419,
      lng: -122.1430
    },
    acknowledged: true
  },
  {
    id: 'se3',
    vehicleId: 'v3',
    vehicleName: 'Truck 303',
    driverId: 'd3',
    driverName: 'Mike Johnson',
    timestamp: '2025-03-19T11:30:00',
    speed: 67,
    speedLimit: 55,
    duration: 2.8,
    location: 'Route 85, Mountain View',
    coordinates: {
      lat: 37.3861,
      lng: -122.0839
    },
    acknowledged: false
  },
  {
    id: 'se4',
    vehicleId: 'v4',
    vehicleName: 'Van 404',
    driverId: 'd4',
    driverName: 'Sarah Williams',
    timestamp: '2025-03-19T12:45:00',
    speed: 82,
    speedLimit: 65,
    duration: 4.1,
    location: 'Interstate 880, Oakland',
    coordinates: {
      lat: 37.8044,
      lng: -122.2711
    },
    acknowledged: true
  },
  {
    id: 'se5',
    vehicleId: 'v1',
    vehicleName: 'Truck 101',
    driverId: 'd1',
    driverName: 'John Doe',
    timestamp: '2025-03-19T14:20:00',
    speed: 75,
    speedLimit: 65,
    duration: 2.3,
    location: 'Highway 101, San Mateo',
    coordinates: {
      lat: 37.5630,
      lng: -122.3255
    },
    acknowledged: false
  }
];

const SpeedMonitoring: React.FC = () => {
  const [speedThreshold, setSpeedThreshold] = useState<number>(10);
  const [alertEnabled, setAlertEnabled] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [smsNotifications, setSmsNotifications] = useState<boolean>(false);
  const [emailRecipient, setEmailRecipient] = useState<string>('fleet-manager@example.com');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const handleAcknowledge = (eventId: string) => {
    // In a real application, this would update the backend
    console.log(`Acknowledged speed event: ${eventId}`);
  };

  const handleSaveSettings = () => {
    // In a real application, this would save settings to the backend
    console.log('Saved speed monitoring settings');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Speed Monitoring
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Alert severity="info">
          Monitor and manage speed violations across your fleet to improve safety and compliance.
        </Alert>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <SpeedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Speed Alert Settings
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography gutterBottom>Speed Threshold (mph over limit)</Typography>
              <Slider
                value={speedThreshold}
                onChange={(_, newValue) => setSpeedThreshold(newValue as number)}
                aria-labelledby="speed-threshold-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={5}
                max={25}
              />
              <Typography variant="body2" color="text.secondary">
                Alert when vehicles exceed the speed limit by {speedThreshold} mph or more
              </Typography>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={alertEnabled}
                    onChange={(e) => setAlertEnabled(e.target.checked)}
                  />
                }
                label="Enable Speed Alerts"
              />
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Notification Settings
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                }
                label="Email Notifications"
              />
              
              {emailNotifications && (
                <TextField
                  fullWidth
                  label="Email Recipient"
                  value={emailRecipient}
                  onChange={(e) => setEmailRecipient(e.target.value)}
                  margin="normal"
                  size="small"
                />
              )}
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                  />
                }
                label="SMS Notifications"
              />
              
              {smsNotifications && (
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  margin="normal"
                  size="small"
                />
              )}
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveSettings}
                fullWidth
              >
                Save Settings
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Recent Speed Violations
            </Typography>
            
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Vehicle</TableCell>
                    <TableCell>Driver</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Speed / Limit</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockSpeedEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <LocalShippingIcon fontSize="small" sx={{ mr: 1 }} />
                          {event.vehicleName}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                          {event.driverName}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                          {new Date(event.timestamp).toLocaleString()}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="error">
                          {event.speed} mph / {event.speedLimit} mph
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(event.speed - event.speedLimit).toFixed(0)} mph over for {event.duration} min
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <PlaceIcon fontSize="small" sx={{ mr: 1 }} />
                          {event.location}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={event.acknowledged ? 'Acknowledged' : 'New'}
                          color={event.acknowledged ? 'default' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary" 
                          aria-label="view details"
                          size="small"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        {!event.acknowledged && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleAcknowledge(event.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      <SpeedIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
                      Total Violations
                    </Typography>
                    <Typography variant="h5" component="div">
                      {mockSpeedEvents.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last 30 days
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      <LocalShippingIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
                      Vehicles with Violations
                    </Typography>
                    <Typography variant="h5" component="div">
                      {new Set(mockSpeedEvents.map(event => event.vehicleId)).size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Out of 15 total vehicles
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      <WarningIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
                      Unacknowledged Alerts
                    </Typography>
                    <Typography variant="h5" component="div">
                      {mockSpeedEvents.filter(event => !event.acknowledged).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Require attention
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SpeedMonitoring;
