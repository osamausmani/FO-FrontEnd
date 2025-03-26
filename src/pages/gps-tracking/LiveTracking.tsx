import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Card, 
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip,
  IconButton,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

// Mock data for vehicles
interface Vehicle {
  id: string;
  name: string;
  type: 'car' | 'truck' | 'van';
  status: 'active' | 'idle' | 'offline';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  speed: number;
  heading: number;
  lastUpdated: string;
  driver: {
    id: string;
    name: string;
  };
}

const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    name: 'Fleet Car 001',
    type: 'car',
    status: 'active',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: '350 5th Ave, New York, NY 10118'
    },
    speed: 45,
    heading: 90,
    lastUpdated: new Date().toISOString(),
    driver: {
      id: 'd1',
      name: 'John Doe'
    }
  },
  {
    id: 'v2',
    name: 'Fleet Truck 002',
    type: 'truck',
    status: 'idle',
    location: {
      lat: 40.7282,
      lng: -73.9942,
      address: '200 Park Ave, New York, NY 10166'
    },
    speed: 0,
    heading: 0,
    lastUpdated: new Date().toISOString(),
    driver: {
      id: 'd2',
      name: 'Jane Smith'
    }
  },
  {
    id: 'v3',
    name: 'Fleet Van 003',
    type: 'van',
    status: 'active',
    location: {
      lat: 40.7580,
      lng: -73.9855,
      address: '30 Rockefeller Plaza, New York, NY 10112'
    },
    speed: 35,
    heading: 180,
    lastUpdated: new Date().toISOString(),
    driver: {
      id: 'd3',
      name: 'Robert Johnson'
    }
  },
  {
    id: 'v4',
    name: 'Fleet Car 004',
    type: 'car',
    status: 'offline',
    location: {
      lat: 40.7484,
      lng: -73.9857,
      address: '234 W 42nd St, New York, NY 10036'
    },
    speed: 0,
    heading: 0,
    lastUpdated: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago
    driver: {
      id: 'd4',
      name: 'Sarah Williams'
    }
  },
];

const LiveTracking: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  
  // Simulate fetching vehicle data
  const fetchVehicleData = () => {
    setLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      // Update vehicle positions slightly to simulate movement
      const updatedVehicles = vehicles.map(vehicle => {
        if (vehicle.status === 'active') {
          return {
            ...vehicle,
            location: {
              ...vehicle.location,
              lat: vehicle.location.lat + (Math.random() * 0.01 - 0.005),
              lng: vehicle.location.lng + (Math.random() * 0.01 - 0.005),
            },
            speed: Math.max(25, Math.min(65, vehicle.speed + (Math.random() * 10 - 5))),
            lastUpdated: new Date().toISOString()
          };
        }
        return vehicle;
      });
      setVehicles(updatedVehicles);
      setLoading(false);
    }, 1000);
  };

  // Auto refresh effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchVehicleData, 10000); // Refresh every 10 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh, vehicles]);

  // Filter vehicles based on selected filter
  const filteredVehicles = vehicles.filter(vehicle => {
    if (filter === 'all') return true;
    if (filter === 'active') return vehicle.status === 'active';
    if (filter === 'idle') return vehicle.status === 'idle';
    if (filter === 'offline') return vehicle.status === 'offline';
    if (filter === 'car') return vehicle.type === 'car';
    if (filter === 'truck') return vehicle.type === 'truck';
    if (filter === 'van') return vehicle.type === 'van';
    return true;
  });

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as string);
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleRefresh = () => {
    fetchVehicleData();
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success.main';
      case 'idle': return 'warning.main';
      case 'offline': return 'text.disabled';
      default: return 'text.primary';
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'car': return <DirectionsCarIcon />;
      case 'truck': return <LocalShippingIcon />;
      case 'van': return <DirectionsCarIcon />;
      default: return <DirectionsCarIcon />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Live GPS Tracking
          </Typography>
          <Box>
            <IconButton onClick={handleRefresh} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
            <IconButton onClick={toggleAutoRefresh} color={autoRefresh ? 'primary' : 'default'}>
              {autoRefresh ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body1">
          Real-time location tracking of all fleet vehicles. Select a vehicle to view detailed information.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Vehicles</Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="filter-label">Filter</InputLabel>
                <Select
                  labelId="filter-label"
                  value={filter}
                  label="Filter"
                  onChange={handleFilterChange}
                  startAdornment={<FilterListIcon fontSize="small" sx={{ mr: 1 }} />}
                >
                  <MenuItem value="all">All Vehicles</MenuItem>
                  <Divider />
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="idle">Idle</MenuItem>
                  <MenuItem value="offline">Offline</MenuItem>
                  <Divider />
                  <MenuItem value="car">Cars</MenuItem>
                  <MenuItem value="truck">Trucks</MenuItem>
                  <MenuItem value="van">Vans</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            {filteredVehicles.length === 0 ? (
              <Alert severity="info">No vehicles match the selected filter.</Alert>
            ) : (
              <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                {filteredVehicles.map((vehicle) => (
                  <Card 
                    key={vehicle.id} 
                    sx={{ 
                      mb: 2, 
                      cursor: 'pointer',
                      border: selectedVehicle?.id === vehicle.id ? 2 : 0,
                      borderColor: 'primary.main',
                      '&:hover': { boxShadow: 3 }
                    }}
                    onClick={() => handleVehicleSelect(vehicle)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ mr: 1, color: getStatusColor(vehicle.status) }}>
                            {getVehicleIcon(vehicle.type)}
                          </Box>
                          <Box>
                            <Typography variant="subtitle1">{vehicle.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Driver: {vehicle.driver.name}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip 
                          label={vehicle.status.toUpperCase()} 
                          size="small" 
                          sx={{ 
                            backgroundColor: getStatusColor(vehicle.status),
                            color: vehicle.status === 'offline' ? 'text.primary' : 'white'
                          }} 
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, height: '70vh', display: 'flex', flexDirection: 'column' }}>
            {selectedVehicle ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{selectedVehicle.name}</Typography>
                  <Chip 
                    label={selectedVehicle.status.toUpperCase()} 
                    size="small" 
                    sx={{ 
                      backgroundColor: getStatusColor(selectedVehicle.status),
                      color: selectedVehicle.status === 'offline' ? 'text.primary' : 'white'
                    }} 
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Card sx={{ backgroundColor: 'background.default' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">Speed</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SpeedIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">{Math.round(selectedVehicle.speed)} mph</Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card sx={{ backgroundColor: 'background.default' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">
                              {new Date(selectedVehicle.lastUpdated).toLocaleTimeString()}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ backgroundColor: 'background.default' }}>
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">Current Location</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <MyLocationIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body2" noWrap>
                              {selectedVehicle.location.address}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ flexGrow: 1, bgcolor: 'grey.100', position: 'relative', borderRadius: 1 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      color: 'text.secondary'
                    }}
                  >
                    Map view would be displayed here with the vehicle's location.
                    <br />
                    Coordinates: {selectedVehicle.location.lat.toFixed(4)}, {selectedVehicle.location.lng.toFixed(4)}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary">
                  Select a vehicle to view its location and details
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LiveTracking;
