import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import RouteIcon from '@mui/icons-material/Route';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface Trip {
  id: string;
  vehicleId: string;
  vehicleName: string;
  driverId: string;
  driverName: string;
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  duration: number;
  status: 'completed' | 'in-progress' | 'cancelled';
  fuelConsumption: number;
  maxSpeed: number;
  idleTime: number;
}

const mockTrips: Trip[] = [
  {
    id: 't1',
    vehicleId: 'v1',
    vehicleName: 'Truck 101',
    driverId: 'd1',
    driverName: 'John Doe',
    startTime: '2025-03-18T08:30:00',
    endTime: '2025-03-18T11:45:00',
    startLocation: 'Warehouse A, San Francisco',
    endLocation: 'Customer Site B, Oakland',
    distance: 42.5,
    duration: 195,
    status: 'completed',
    fuelConsumption: 12.3,
    maxSpeed: 65,
    idleTime: 15
  },
  {
    id: 't2',
    vehicleId: 'v2',
    vehicleName: 'Van 202',
    driverId: 'd2',
    driverName: 'Jane Smith',
    startTime: '2025-03-18T09:15:00',
    endTime: '2025-03-18T14:30:00',
    startLocation: 'Distribution Center C, San Jose',
    endLocation: 'Retail Store D, Palo Alto',
    distance: 78.2,
    duration: 315,
    status: 'completed',
    fuelConsumption: 18.7,
    maxSpeed: 72,
    idleTime: 23
  },
  {
    id: 't3',
    vehicleId: 'v3',
    vehicleName: 'Truck 303',
    driverId: 'd3',
    driverName: 'Mike Johnson',
    startTime: '2025-03-19T07:45:00',
    endTime: '',
    startLocation: 'Warehouse A, San Francisco',
    endLocation: 'En route to Customer Site E',
    distance: 28.9,
    duration: 85,
    status: 'in-progress',
    fuelConsumption: 8.4,
    maxSpeed: 68,
    idleTime: 7
  },
  {
    id: 't4',
    vehicleId: 'v4',
    vehicleName: 'Van 404',
    driverId: 'd4',
    driverName: 'Sarah Williams',
    startTime: '2025-03-17T10:00:00',
    endTime: '2025-03-17T13:15:00',
    startLocation: 'Distribution Center C, San Jose',
    endLocation: 'Customer Site F, Mountain View',
    distance: 35.7,
    duration: 195,
    status: 'completed',
    fuelConsumption: 9.2,
    maxSpeed: 63,
    idleTime: 18
  },
  {
    id: 't5',
    vehicleId: 'v1',
    vehicleName: 'Truck 101',
    driverId: 'd1',
    driverName: 'John Doe',
    startTime: '2025-03-17T14:30:00',
    endTime: '2025-03-17T16:45:00',
    startLocation: 'Customer Site B, Oakland',
    endLocation: 'Warehouse A, San Francisco',
    distance: 41.8,
    duration: 135,
    status: 'completed',
    fuelConsumption: 11.9,
    maxSpeed: 67,
    idleTime: 12
  }
];

const TripHistory: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [driverFilter, setDriverFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTrips = mockTrips.filter(trip => {
    if (vehicleFilter !== 'all' && trip.vehicleId !== vehicleFilter) return false;
    if (driverFilter !== 'all' && trip.driverId !== driverFilter) return false;
    if (statusFilter !== 'all' && trip.status !== statusFilter) return false;
    return true;
  });

  const uniqueVehicles = Array.from(new Set(mockTrips.map(trip => trip.vehicleId)));
  const uniqueDrivers = Array.from(new Set(mockTrips.map(trip => trip.driverId)));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Trip History
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Search Trips
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Vehicle</InputLabel>
              <Select
                value={vehicleFilter}
                label="Vehicle"
                onChange={(e: SelectChangeEvent) => setVehicleFilter(e.target.value)}
              >
                <MenuItem value="all">All Vehicles</MenuItem>
                {uniqueVehicles.map(vehicleId => {
                  const vehicle = mockTrips.find(trip => trip.vehicleId === vehicleId);
                  return (
                    <MenuItem key={vehicleId} value={vehicleId}>
                      {vehicle?.vehicleName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Driver</InputLabel>
              <Select
                value={driverFilter}
                label="Driver"
                onChange={(e: SelectChangeEvent) => setDriverFilter(e.target.value)}
              >
                <MenuItem value="all">All Drivers</MenuItem>
                {uniqueDrivers.map(driverId => {
                  const driver = mockTrips.find(trip => trip.driverId === driverId);
                  return (
                    <MenuItem key={driverId} value={driverId}>
                      {driver?.driverName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Trip ID</TableCell>
              <TableCell>Vehicle</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Distance (km)</TableCell>
              <TableCell>Duration (min)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTrips.map((trip) => (
              <TableRow key={trip.id}>
                <TableCell>{trip.id}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <LocalShippingIcon fontSize="small" sx={{ mr: 1 }} />
                    {trip.vehicleName}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                    {trip.driverName}
                  </Box>
                </TableCell>
                <TableCell>{new Date(trip.startTime).toLocaleString()}</TableCell>
                <TableCell>
                  {trip.endTime ? new Date(trip.endTime).toLocaleString() : 'In progress'}
                </TableCell>
                <TableCell>{trip.distance}</TableCell>
                <TableCell>{trip.duration}</TableCell>
                <TableCell>
                  <Chip
                    label={trip.status}
                    color={
                      trip.status === 'completed' ? 'success' :
                      trip.status === 'in-progress' ? 'primary' : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" aria-label="view trip">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="primary" aria-label="play trip">
                    <PlayArrowIcon />
                  </IconButton>
                  <IconButton color="primary" aria-label="download trip data">
                    <FileDownloadIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  <RouteIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
                  Total Distance
                </Typography>
                <Typography variant="h5" component="div">
                  {filteredTrips.reduce((sum, trip) => sum + trip.distance, 0).toFixed(1)} km
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  <AccessTimeIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
                  Total Duration
                </Typography>
                <Typography variant="h5" component="div">
                  {filteredTrips.reduce((sum, trip) => sum + trip.duration, 0)} min
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  <LocalShippingIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
                  Total Trips
                </Typography>
                <Typography variant="h5" component="div">
                  {filteredTrips.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default TripHistory;
