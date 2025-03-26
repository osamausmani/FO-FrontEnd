import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import DirectionsIcon from '@mui/icons-material/Directions';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import FlagIcon from '@mui/icons-material/Flag';
import PinDropIcon from '@mui/icons-material/PinDrop';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';

// Map components
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// API Service
import apiService from '../../utils/api';

// Types
import { OptimizedRoute, RouteWaypoint } from '../../types/routeOptimization';
import ConfirmDialog from '../../components/common/ConfirmDialog';

// For decoding the polyline
import { decode } from '@mapbox/polyline';

const RouteOptimizationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [route, setRoute] = useState<OptimizedRoute | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  // Fetch route details
  useEffect(() => {
    const fetchRouteDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await apiService.getRouteOptimization(id);
        setRoute(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching route details:', err);
        setError('Failed to load route optimization details');
        setLoading(false);
      }
    };

    fetchRouteDetail();
  }, [id]);

  // Handle route deletion
  const handleDelete = async () => {
    if (!id) return;

    try {
      await apiService.deleteRouteOptimization(id);
      navigate('/route-optimization');
    } catch (err) {
      console.error('Error deleting route:', err);
      setError('Failed to delete route optimization');
    }
  };

  // Format distance and duration
  const formatDistance = (distance: number) => {
    return `${(distance / 1000).toFixed(1)} km`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get route coordinates from polyline
  const getRouteCoordinates = (): L.LatLngExpression[] => {
    if (!route?.directionsPolyline) return [];
    // Cast each point to LatLngExpression (which expects [lat, lng] format)
    return decode(route.directionsPolyline).map((point: [number, number]): L.LatLngTuple => [point[0], point[1]]);
  };

  // Calculate the map bounds to fit all points
  const getMapBounds = (): L.LatLngBoundsExpression => {
    if (!route) return [[0, 0], [0, 0]] as L.LatLngBoundsExpression;

    const bounds = L.latLngBounds([]);
    
    // Add start location
    bounds.extend([route.startLocation.latitude, route.startLocation.longitude]);
    
    // Add end location
    bounds.extend([route.endLocation.latitude, route.endLocation.longitude]);
    
    // Add all waypoints
    route.waypoints.forEach(waypoint => {
      bounds.extend([waypoint.location.latitude, waypoint.location.longitude]);
    });
    
    return bounds;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/route-optimization')}
          sx={{ mt: 2 }}
        >
          Back to Optimized Routes
        </Button>
      </Box>
    );
  }

  if (!route) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="info">Route optimization not found</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/route-optimization')}
          sx={{ mt: 2 }}
        >
          Back to Optimized Routes
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/route-optimization')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">Route Details</Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{ mr: 1 }}
            onClick={() => navigate(`/route-optimization/${id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Route Overview Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Route Overview"
              subheader={`Created: ${new Date(route.startTime).toLocaleDateString()}`}
            />
            <Divider />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <LocalShippingIcon />
                  </ListItemIcon>
                  <ListItemText primary="Vehicle" secondary={route.vehicleId} />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Driver" secondary={route.driverId || 'Not assigned'} />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Time Window" 
                    secondary={`${formatTime(route.startTime)} - ${formatTime(route.endTime)}`} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <SpeedIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Distance" 
                    secondary={formatDistance(route.totalDistance)} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Total Travel Time" 
                    secondary={formatDuration(route.totalTime)} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <LocalGasStationIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Fuel Consumption" 
                    secondary={`${route.fuelConsumption.toFixed(2)} L`} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Map Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '400px', overflow: 'hidden' }}>
            <CardHeader title="Route Map" />
            <Divider />
            <CardContent sx={{ p: 0, height: '350px' }}>
              <MapContainer 
                style={{ height: '100%', width: '100%' }}
                bounds={getMapBounds()}
                zoom={12}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Start marker */}
                <Marker position={[route.startLocation.latitude, route.startLocation.longitude]}>
                  <Popup>Start: {route.startLocation.address || 'Starting point'}</Popup>
                </Marker>
                
                {/* Waypoint markers */}
                {route.waypoints.map((waypoint, index) => (
                  <Marker 
                    key={index} 
                    position={[waypoint.location.latitude, waypoint.location.longitude]}
                  >
                    <Popup>
                      Stop {index + 1}: {waypoint.name || waypoint.location.address || 'Stop'}
                      <br />
                      ETA: {waypoint.arrivalTime ? formatTime(waypoint.arrivalTime) : 'N/A'}
                    </Popup>
                  </Marker>
                ))}
                
                {/* End marker */}
                <Marker position={[route.endLocation.latitude, route.endLocation.longitude]}>
                  <Popup>End: {route.endLocation.address || 'Ending point'}</Popup>
                </Marker>
                
                {/* Route line */}
                <Polyline 
                  positions={getRouteCoordinates()} 
                  color="blue"
                  weight={5}
                  opacity={0.7}
                />
              </MapContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Waypoints Table */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Route Waypoints" />
            <Divider />
            <CardContent>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Stop</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>ETA</TableCell>
                      <TableCell>Wait Time</TableCell>
                      <TableCell>Service Time</TableCell>
                      <TableCell>Departure</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Start point */}
                    <TableRow>
                      <TableCell>
                        <Chip icon={<FlagIcon />} label="Start" size="small" color="primary" />
                      </TableCell>
                      <TableCell>{route.startLocation.address || 'Starting point'}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>{formatTime(route.startTime)}</TableCell>
                    </TableRow>
                    
                    {/* Waypoints */}
                    {route.waypoints.map((waypoint, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Chip icon={<LocationOnIcon />} label={`Stop ${index + 1}`} size="small" />
                        </TableCell>
                        <TableCell>{waypoint.location.address || `Waypoint ${index + 1}`}</TableCell>
                        <TableCell>{waypoint.arrivalTime ? formatTime(waypoint.arrivalTime) : 'N/A'}</TableCell>
                        <TableCell>{waypoint.waitTime ? `${waypoint.waitTime} min` : '-'}</TableCell>
                        <TableCell>{waypoint.serviceTime ? `${waypoint.serviceTime} min` : '-'}</TableCell>
                        <TableCell>{waypoint.departureTime ? formatTime(waypoint.departureTime) : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                    
                    {/* End point */}
                    <TableRow>
                      <TableCell>
                        <Chip icon={<WhereToVoteIcon />} label="End" size="small" color="secondary" />
                      </TableCell>
                      <TableCell>{route.endLocation.address || 'Ending point'}</TableCell>
                      <TableCell>{formatTime(route.endTime)}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Route"
        message={`Are you sure you want to delete this optimized route? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default RouteOptimizationDetail;
