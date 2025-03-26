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
  Divider,
  LinearProgress
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningIcon from '@mui/icons-material/Warning';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import PlaceIcon from '@mui/icons-material/Place';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CO2Icon from '@mui/icons-material/Co2';

interface IdleEvent {
  id: string;
  vehicleId: string;
  vehicleName: string;
  driverId: string;
  driverName: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  fuelWasted: number; // gallons
  co2Emissions: number; // kg
  costImpact: number; // dollars
  reason: string;
  acknowledged: boolean;
}

const mockIdleEvents: IdleEvent[] = [
  {
    id: 'ie1',
    vehicleId: 'v1',
    vehicleName: 'Truck 101',
    driverId: 'd1',
    driverName: 'John Doe',
    startTime: '2025-03-19T09:30:00',
    endTime: '2025-03-19T09:45:00',
    duration: 15,
    location: 'Customer Site A, San Francisco',
    coordinates: {
      lat: 37.7749,
      lng: -122.4194
    },
    fuelWasted: 0.75,
    co2Emissions: 7.2,
    costImpact: 3.38,
    reason: 'Waiting for customer',
    acknowledged: false
  },
  {
    id: 'ie2',
    vehicleId: 'v2',
    vehicleName: 'Van 202',
    driverId: 'd2',
    driverName: 'Jane Smith',
    startTime: '2025-03-19T10:15:00',
    endTime: '2025-03-19T10:35:00',
    duration: 20,
    location: 'Traffic Light, Palo Alto',
    coordinates: {
      lat: 37.4419,
      lng: -122.1430
    },
    fuelWasted: 1.0,
    co2Emissions: 9.6,
    costImpact: 4.50,
    reason: 'Traffic congestion',
    acknowledged: true
  },
  {
    id: 'ie3',
    vehicleId: 'v3',
    vehicleName: 'Truck 303',
    driverId: 'd3',
    driverName: 'Mike Johnson',
    startTime: '2025-03-19T11:30:00',
    endTime: '2025-03-19T12:00:00',
    duration: 30,
    location: 'Warehouse B, Mountain View',
    coordinates: {
      lat: 37.3861,
      lng: -122.0839
    },
    fuelWasted: 1.5,
    co2Emissions: 14.4,
    costImpact: 6.75,
    reason: 'Loading cargo',
    acknowledged: false
  },
  {
    id: 'ie4',
    vehicleId: 'v4',
    vehicleName: 'Van 404',
    driverId: 'd4',
    driverName: 'Sarah Williams',
    startTime: '2025-03-19T12:45:00',
    endTime: '2025-03-19T13:00:00',
    duration: 15,
    location: 'Rest Stop, Oakland',
    coordinates: {
      lat: 37.8044,
      lng: -122.2711
    },
    fuelWasted: 0.75,
    co2Emissions: 7.2,
    costImpact: 3.38,
    reason: 'Driver break',
    acknowledged: true
  },
  {
    id: 'ie5',
    vehicleId: 'v1',
    vehicleName: 'Truck 101',
    driverId: 'd1',
    driverName: 'John Doe',
    startTime: '2025-03-19T14:20:00',
    endTime: '2025-03-19T14:50:00',
    duration: 30,
    location: 'Customer Site C, San Mateo',
    coordinates: {
      lat: 37.5630,
      lng: -122.3255
    },
    fuelWasted: 1.5,
    co2Emissions: 14.4,
    costImpact: 6.75,
    reason: 'Waiting for customer',
    acknowledged: false
  }
];

const IdleTimeTracking: React.FC = () => {
  const [idleThreshold, setIdleThreshold] = useState<number>(5);
  const [alertEnabled, setAlertEnabled] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [autoShutdown, setAutoShutdown] = useState<boolean>(false);
  const [emailRecipient, setEmailRecipient] = useState<string>('fleet-manager@example.com');
  const [fuelCostPerGallon, setFuelCostPerGallon] = useState<number>(4.50);

  const handleAcknowledge = (eventId: string) => {
    // In a real application, this would update the backend
    console.log(`Acknowledged idle event: ${eventId}`);
  };

  const handleSaveSettings = () => {
    // In a real application, this would save settings to the backend
    console.log('Saved idle time tracking settings');
  };

  // Calculate totals
  const totalIdleTime = mockIdleEvents.reduce((sum, event) => sum + event.duration, 0);
  const totalFuelWasted = mockIdleEvents.reduce((sum, event) => sum + event.fuelWasted, 0);
  const totalCO2Emissions = mockIdleEvents.reduce((sum, event) => sum + event.co2Emissions, 0);
  const totalCostImpact = mockIdleEvents.reduce((sum, event) => sum + event.costImpact, 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Idle Time Tracking
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Alert severity="info">
          Monitor and reduce vehicle idle time to save fuel, reduce emissions, and lower operational costs.
        </Alert>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <AccessTimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Idle Time Settings
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography gutterBottom>Idle Time Threshold (minutes)</Typography>
              <Slider
                value={idleThreshold}
                onChange={(_, newValue) => setIdleThreshold(newValue as number)}
                aria-labelledby="idle-threshold-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={15}
              />
              <Typography variant="body2" color="text.secondary">
                Alert when vehicles idle for more than {idleThreshold} minutes
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
                label="Enable Idle Alerts"
              />
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoShutdown}
                    onChange={(e) => setAutoShutdown(e.target.checked)}
                  />
                }
                label="Auto Engine Shutdown Recommendation"
              />
              {autoShutdown && (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                  Drivers will receive a notification to shut down engine after threshold is reached
                </Typography>
              )}
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
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Cost Calculation
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Fuel Cost Per Gallon ($)"
                type="number"
                value={fuelCostPerGallon}
                onChange={(e) => setFuelCostPerGallon(Number(e.target.value))}
                margin="normal"
                size="small"
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
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
              Recent Idle Events
            </Typography>
            
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Vehicle</TableCell>
                    <TableCell>Driver</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Impact</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockIdleEvents.map((event) => (
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
                        <Typography variant="body2" color={event.duration > 15 ? 'error' : 'text.primary'}>
                          {event.duration} min
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(event.startTime).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <PlaceIcon fontSize="small" sx={{ mr: 1 }} />
                          {event.location}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" display="flex" alignItems="center">
                            <LocalGasStationIcon fontSize="small" sx={{ mr: 0.5 }} />
                            {event.fuelWasted.toFixed(2)} gal
                          </Typography>
                          <Typography variant="body2" display="flex" alignItems="center">
                            <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5 }} />
                            ${event.costImpact.toFixed(2)}
                          </Typography>
                        </Box>
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
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      <AccessTimeIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
                      Total Idle Time
                    </Typography>
                    <Typography variant="h5" component="div">
                      {totalIdleTime} min
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      <LocalGasStationIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
                      Fuel Wasted
                    </Typography>
                    <Typography variant="h5" component="div">
                      {totalFuelWasted.toFixed(2)} gal
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      <CO2Icon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
                      CO₂ Emissions
                    </Typography>
                    <Typography variant="h5" component="div">
                      {totalCO2Emissions.toFixed(1)} kg
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      <AttachMoneyIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
                      Cost Impact
                    </Typography>
                    <Typography variant="h5" component="div">
                      ${totalCostImpact.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Fleet Idle Time Reduction Progress
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Weekly Goal: Reduce idle time by 15%
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Box width="100%" mr={1}>
                      <LinearProgress variant="determinate" value={70} color="success" />
                    </Box>
                    <Box minWidth={35}>
                      <Typography variant="body2" color="text.secondary">70%</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Monthly Goal: Reduce fuel waste by 20%
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Box width="100%" mr={1}>
                      <LinearProgress variant="determinate" value={45} color="primary" />
                    </Box>
                    <Box minWidth={35}>
                      <Typography variant="body2" color="text.secondary">45%</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Quarterly Goal: Save $5,000 in idle costs
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Box width="100%" mr={1}>
                      <LinearProgress variant="determinate" value={60} color="secondary" />
                    </Box>
                    <Box minWidth={35}>
                      <Typography variant="body2" color="text.secondary">60%</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default IdleTimeTracking;
