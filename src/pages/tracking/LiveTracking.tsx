import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Alert,
  Tooltip,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Map components
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icons
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import SpeedIcon from '@mui/icons-material/Speed';
import TimerIcon from '@mui/icons-material/Timer';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PauseIcon from '@mui/icons-material/Pause';
import WarningIcon from '@mui/icons-material/Warning';
import NavigationIcon from '@mui/icons-material/Navigation';
import RefreshIcon from '@mui/icons-material/Refresh';
import HistoryIcon from '@mui/icons-material/History';
import RouteIcon from '@mui/icons-material/Route';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Types
import { VehicleLocation, GpsPosition, TrackingHistoryEntry } from '../../types/tracking';

// API
import apiService from '../../utils/api';

// Fix Leaflet icon issues
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

// Custom vehicle marker icons
const createVehicleIcon = (status: string) => {
  const iconUrl = status === 'moving'
    ? '/assets/vehicle-moving.png'
    : status === 'idle'
      ? '/assets/vehicle-idle.png'
      : status === 'stopped'
        ? '/assets/vehicle-stopped.png'
        : '/assets/vehicle-offline.png';
  
  return L.icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

// Map view that automatically centers on vehicles
const MapView: React.FC<{
  vehicles: VehicleLocation[];
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
}> = ({ vehicles, selectedVehicleId, setSelectedVehicleId }) => {
  const map = useMapEvents({
    load: () => {
      if (vehicles.length > 0) {
        fitBoundsToVehicles();
      }
    },
  });

  const fitBoundsToVehicles = () => {
    if (vehicles.length === 0) return;
    
    if (selectedVehicleId) {
      const vehicle = vehicles.find(v => v.vehicleId === selectedVehicleId);
      if (vehicle) {
        map.setView(
          [vehicle.position.latitude, vehicle.position.longitude],
          15
        );
        return;
      }
    }
    
    // If no vehicle is selected or the selected vehicle isn't found, fit to all vehicles
    const bounds = L.latLngBounds(
      vehicles.map(v => [v.position.latitude, v.position.longitude])
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  };

  useEffect(() => {
    fitBoundsToVehicles();
  }, [vehicles, selectedVehicleId]);

  return null;
};

// Vehicle history trail component
interface TrailProps {
  history: TrackingHistoryEntry[];
}

const VehicleTrail: React.FC<TrailProps> = ({ history }) => {
  if (history.length < 2) return null;
  
  const positions = history.map(entry => [
    entry.position.latitude,
    entry.position.longitude
  ] as [number, number]);
  
  return <Polyline positions={positions} color="#3388ff" weight={3} opacity={0.7} />
};

interface LiveTrackingProps {}

const LiveTracking: React.FC<LiveTrackingProps> = () => {
  const theme = useTheme();
  const [vehicles, setVehicles] = useState<VehicleLocation[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleLocation[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [vehicleHistory, setVehicleHistory] = useState<TrackingHistoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<{
    status: string;
    search: string;
  }>({ status: 'all', search: '' });
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // seconds
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fix Leaflet icon issues on component mount
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  // Fetch vehicle locations
  const fetchVehicleLocations = async () => {
    try {
      const res = await apiService.getVehicleLocations();
      setVehicles(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching vehicle locations:', err);
      setError('Failed to fetch vehicle locations. Please try again.');
      setLoading(false);
    }
  };

  // Fetch vehicle history
  const fetchVehicleHistory = async (vehicleId: string) => {
    try {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      
      const res = await apiService.getTrackingHistory(vehicleId, {
        startDate: twoHoursAgo.toISOString(),
        endDate: now.toISOString()
      });
      
      setVehicleHistory(res.data.data);
    } catch (err) {
      console.error('Error fetching vehicle history:', err);
      setVehicleHistory([]);
    }
  };

  // Initialize data loading and refresh interval
  useEffect(() => {
    fetchVehicleLocations();
    
    // Set up refresh interval
    intervalRef.current = setInterval(fetchVehicleLocations, refreshInterval * 1000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval]);

  // Apply filters when vehicles or filter changes
  useEffect(() => {
    let result = [...vehicles];
    
    // Apply status filter
    if (filter.status !== 'all') {
      result = result.filter(vehicle => vehicle.status === filter.status);
    }
    
    // Apply search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(
        vehicle =>
          vehicle.vehicleName.toLowerCase().includes(searchLower) ||
          (vehicle.driverName && vehicle.driverName.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredVehicles(result);
  }, [vehicles, filter]);

  // Fetch history when a vehicle is selected
  useEffect(() => {
    if (selectedVehicleId) {
      fetchVehicleHistory(selectedVehicleId);
    } else {
      setVehicleHistory([]);
    }
  }, [selectedVehicleId]);

  // Handle filter changes
  const handleFilterChange = (field: 'status' | 'search', value: string) => {
    setFilter(prev => ({ ...prev, [field]: value }));
  };

  // Handle refresh interval change
  const handleRefreshIntervalChange = (newInterval: number) => {
    setRefreshInterval(newInterval);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(fetchVehicleLocations, newInterval * 1000);
  };

  // Manual refresh handler
  const handleManualRefresh = () => {
    fetchVehicleLocations();
    if (selectedVehicleId) {
      fetchVehicleHistory(selectedVehicleId);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Live Vehicle Tracking
      </Typography>
      
      {/* Control panel and filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filter.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="moving">Moving</MenuItem>
                <MenuItem value="idle">Idle</MenuItem>
                <MenuItem value="stopped">Stopped</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size="small"
              label="Search Vehicles/Drivers"
              variant="outlined"
              value={filter.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Refresh Interval</InputLabel>
              <Select
                value={refreshInterval}
                onChange={(e) => handleRefreshIntervalChange(Number(e.target.value))}
                label="Refresh Interval"
              >
                <MenuItem value={10}>10 seconds</MenuItem>
                <MenuItem value={30}>30 seconds</MenuItem>
                <MenuItem value={60}>1 minute</MenuItem>
                <MenuItem value={300}>5 minutes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleManualRefresh}
              fullWidth
            >
              Refresh Now
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Main content area with map and vehicle list */}
      <Grid container spacing={3}>
        {/* Vehicle list */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ height: 'calc(100vh - 250px)', overflow: 'auto' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : filteredVehicles.length === 0 ? (
              <Alert severity="info">No vehicles match the selected filters.</Alert>
            ) : (
              <List>
                {filteredVehicles.map((vehicle) => (
                  <React.Fragment key={vehicle.vehicleId}>
                    <ListItem
                      button
                      selected={selectedVehicleId === vehicle.vehicleId}
                      onClick={() => setSelectedVehicleId(
                        selectedVehicleId === vehicle.vehicleId ? null : vehicle.vehicleId
                      )}
                    >
                      <ListItemIcon>
                        <DirectionsCarIcon color={
                          vehicle.status === 'moving' ? 'success' :
                          vehicle.status === 'idle' ? 'warning' :
                          vehicle.status === 'stopped' ? 'info' : 'disabled'
                        } />
                      </ListItemIcon>
                      <ListItemText
                        primary={vehicle.vehicleName}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="textSecondary">
                              {vehicle.driverName || 'No driver assigned'}
                            </Typography>
                            <br />
                            <Chip
                              label={vehicle.status.toUpperCase()}
                              size="small"
                              color={
                                vehicle.status === 'moving' ? 'success' :
                                vehicle.status === 'idle' ? 'warning' :
                                vehicle.status === 'stopped' ? 'info' : 'default'
                              }
                              sx={{ mt: 0.5 }}
                            />
                            {vehicle.status === 'idle' && vehicle.idleTime && (
                              <Typography component="span" variant="caption" sx={{ ml: 1 }}>
                                {Math.floor(vehicle.idleTime / 60)}m {vehicle.idleTime % 60}s
                              </Typography>
                            )}
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="Center on map">
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVehicleId(vehicle.vehicleId);
                            }}
                          >
                            <MyLocationIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        
        {/* Map area */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper sx={{ height: 'calc(100vh - 250px)', overflow: 'hidden' }}>
            <MapContainer
              center={[39.8283, -98.5795]} // Center of USA
              zoom={4}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapView
                vehicles={filteredVehicles}
                selectedVehicleId={selectedVehicleId}
                setSelectedVehicleId={setSelectedVehicleId}
              />
              
              {/* Vehicle markers */}
              {filteredVehicles.map((vehicle) => {
                const isSelected = vehicle.vehicleId === selectedVehicleId;
                return (
                  <Marker
                    key={vehicle.vehicleId}
                    position={[vehicle.position.latitude, vehicle.position.longitude]}
                    icon={createVehicleIcon(vehicle.status)}
                    eventHandlers={{
                      click: () => {
                        setSelectedVehicleId(
                          selectedVehicleId === vehicle.vehicleId ? null : vehicle.vehicleId
                        );
                      },
                    }}
                  >
                    <Popup>
                      <Typography variant="subtitle1">{vehicle.vehicleName}</Typography>
                      <Typography variant="body2">
                        Driver: {vehicle.driverName || 'None'}
                      </Typography>
                      <Typography variant="body2">
                        Status: 
                        <Chip
                          size="small"
                          label={vehicle.status.toUpperCase()}
                          color={
                            vehicle.status === 'moving' ? 'success' :
                            vehicle.status === 'idle' ? 'warning' :
                            vehicle.status === 'stopped' ? 'info' : 'default'
                          }
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                      {vehicle.position.speed !== undefined && (
                        <Typography variant="body2">
                          Speed: {vehicle.position.speed} km/h
                        </Typography>
                      )}
                      <Typography variant="body2">
                        Last updated: {new Date(vehicle.position.timestamp).toLocaleString()}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<HistoryIcon />}
                        sx={{ mt: 1 }}
                        onClick={() => {
                          // Handle history view navigation
                        }}
                      >
                        View History
                      </Button>
                    </Popup>
                  </Marker>
                );
              })}
              
              {/* Selected vehicle trail */}
              {selectedVehicleId && vehicleHistory.length > 0 && (
                <VehicleTrail history={vehicleHistory} />
              )}
            </MapContainer>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Selected vehicle details panel */}
      {selectedVehicleId && (
        <Paper sx={{ mt: 3, p: 2 }}>
          {vehicles.filter(v => v.vehicleId === selectedVehicleId).map(vehicle => (
            <Grid container spacing={2} key={vehicle.vehicleId}>
              <Grid item xs={12}>
                <Typography variant="h6">
                  Vehicle Details: {vehicle.vehicleName}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      <DirectionsCarIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Status Information
                    </Typography>
                    
                    <List dense disablePadding>
                      <ListItem>
                        <ListItemIcon><SpeedIcon /></ListItemIcon>
                        <ListItemText 
                          primary="Current Speed" 
                          secondary={`${vehicle.position.speed || 0} km/h`} 
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon><PersonIcon /></ListItemIcon>
                        <ListItemText 
                          primary="Driver" 
                          secondary={vehicle.driverName || 'No driver assigned'} 
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          {vehicle.status === 'moving' ? <PlayArrowIcon color="success" /> :
                           vehicle.status === 'idle' ? <PauseIcon color="warning" /> :
                           vehicle.status === 'stopped' ? <StopIcon /> :
                           <WarningIcon color="error" />}
                        </ListItemIcon>
                        <ListItemText 
                          primary="Status" 
                          secondary={
                            <Chip 
                              size="small"
                              label={vehicle.status.toUpperCase()}
                              color={
                                vehicle.status === 'moving' ? 'success' :
                                vehicle.status === 'idle' ? 'warning' :
                                vehicle.status === 'stopped' ? 'info' : 'default'
                              }
                            />
                          } 
                        />
                      </ListItem>
                      
                      {vehicle.status === 'idle' && vehicle.idleTime && (
                        <ListItem>
                          <ListItemIcon><TimerIcon /></ListItemIcon>
                          <ListItemText 
                            primary="Idle Time" 
                            secondary={`${Math.floor(vehicle.idleTime / 60)}m ${vehicle.idleTime % 60}s`} 
                          />
                        </ListItem>
                      )}
                      
                      <ListItem>
                        <ListItemIcon><LocationOnIcon /></ListItemIcon>
                        <ListItemText 
                          primary="Position" 
                          secondary={`${vehicle.position.latitude.toFixed(6)}, ${vehicle.position.longitude.toFixed(6)}`} 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      <HistoryIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Today's Activity
                    </Typography>
                    
                    <Stack spacing={2}>
                      <Button
                        variant="outlined"
                        startIcon={<HistoryIcon />}
                        // Handle history view navigation
                      >
                        View Detailed History
                      </Button>
                      
                      <Button
                        variant="outlined"
                        startIcon={<RouteIcon />}
                        // Handle route planning navigation
                      >
                        Plan Route
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default LiveTracking;
