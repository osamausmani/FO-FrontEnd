import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import BlockIcon from '@mui/icons-material/Block';
import NatureIcon from '@mui/icons-material/Nature';
import FlagIcon from '@mui/icons-material/Flag';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import BalanceIcon from '@mui/icons-material/Balance';

// Types
import { RouteOptimizationRequest, RouteOptimizationResponse } from '../../../types/routeOptimization';
import type { Vehicle } from '../../../types/vehicles';
import type { Driver } from '../../../types/drivers';

// Map
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { decode } from '@mapbox/polyline';
import L from 'leaflet';

interface OptimizationReviewProps {
  formData: RouteOptimizationRequest;
  vehicles: Vehicle[];
  drivers: Driver[];
  optimizationResult: RouteOptimizationResponse | null;
}

const OptimizationReview: React.FC<OptimizationReviewProps> = ({
  formData,
  vehicles,
  drivers,
  optimizationResult
}) => {
  // Get vehicle and driver names
  const getVehicleName = (id: string) => {
    const vehicle = vehicles.find(v => v._id === id);
    return vehicle ? `${vehicle.name} (${vehicle.licensePlate})` : id;
  };
  
  const getDriverName = (id?: string) => {
    if (!id) return 'No driver assigned';
    const driver = drivers.find(d => d._id === id);
    return driver ? `${driver.firstName} ${driver.lastName}` : id;
  };
  
  // Format time and distance
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleString();
  };
  
  const formatDistance = (distance?: number) => {
    if (distance === undefined) return 'Not calculated';
    return `${(distance / 1000).toFixed(1)} km`;
  };
  
  const formatDuration = (minutes?: number) => {
    if (minutes === undefined) return 'Not calculated';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
  
  // Get route coordinates from polyline
  const getRouteCoordinates = (): L.LatLngExpression[] => {
    if (!optimizationResult?.routes[0]?.directionsPolyline) return [];
    return decode(optimizationResult.routes[0].directionsPolyline).map((point: [number, number]): L.LatLngTuple => [point[0], point[1]]);
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Optimization Details
      </Typography>
      
      {!optimizationResult ? (
        <Box sx={{ mb: 3 }}>
          <Alert severity="info">
            Submit your route optimization request to see the results here.
          </Alert>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {/* Vehicle & Driver */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Vehicle & Driver" />
                <Divider />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <LocalShippingIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Vehicle" 
                        secondary={getVehicleName(formData.vehicles[0]?.id || '')}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Driver" 
                        secondary={getDriverName(formData.drivers?.[0]?.id)}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <AccessTimeIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Departure Time" 
                        secondary={formatDate(formData.departureTime)}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Stops Summary */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Stops & Waypoints" />
                <Divider />
                <CardContent>
                  <Typography variant="body2" gutterBottom>
                    Number of stops: <strong>{formData.stops.length}</strong>
                  </Typography>
                  
                  {formData.stops.length > 0 ? (
                    <TableContainer component={Paper} sx={{ maxHeight: 200, overflow: 'auto' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Stop</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Service Time</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formData.stops.map((stop, index) => (
                            <TableRow key={index}>
                              <TableCell>Stop {index + 1}</TableCell>
                              <TableCell>
                                {stop.location.address || 
                                 `${stop.location.latitude.toFixed(4)}, ${stop.location.longitude.toFixed(4)}`}
                              </TableCell>
                              <TableCell>
                                {stop.serviceTime ? `${stop.serviceTime} min` : 'Default'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="text.secondary">
                      No stops have been added.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            {/* Preferences */}
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Optimization Preferences" />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Goals:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {formData.preferences?.length ? (
                          formData.preferences.map((pref, index) => (
                            <Chip 
                              key={index}
                              label={pref.type.replace('_', ' ')}
                              color="primary"
                              size="small"
                              icon={pref.type === 'minimize_fuel' ? <LocalGasStationIcon /> : 
                                    pref.type === 'minimize_time' ? <AccessTimeIcon /> :
                                    pref.type === 'minimize_distance' ? <SpeedIcon /> :
                                    <BalanceIcon />}
                            />
                          ))
                        ) : (
                          <Typography color="text.secondary">
                            No specific optimization goals selected.
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Constraints:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {formData.avoidTolls && (
                          <Chip 
                            label="Avoid Tolls"
                            color="secondary"
                            size="small"
                            icon={<MoneyOffIcon />}
                          />
                        )}
                        
                        {formData.avoidHighways && (
                          <Chip 
                            label="Avoid Highways"
                            color="secondary"
                            size="small"
                            icon={<BlockIcon />}
                          />
                        )}
                        
                        {!formData.avoidTolls && !formData.avoidHighways && (
                          <Typography color="text.secondary">
                            No specific constraints selected.
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      ) : (
        // Results View
        <Box>
          <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircleIcon />}>
            Route optimization completed successfully!
          </Alert>
          
          <Grid container spacing={3}>
            {/* Summary Card */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="Optimization Summary" />
                <Divider />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <SpeedIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Total Distance" 
                        secondary={formatDistance(optimizationResult.summary.totalDistance)}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <AccessTimeIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Total Time" 
                        secondary={formatDuration(optimizationResult.summary.totalTime)}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <LocalGasStationIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Fuel Consumption" 
                        secondary={`${optimizationResult.summary.totalFuelConsumption.toFixed(2)} L`}
                      />
                    </ListItem>
                    
                    {optimizationResult.summary.savingsEstimate && (
                      <>
                        <Divider sx={{ my: 1 }} />
                        <ListItem>
                          <ListItemIcon>
                            <NatureIcon color="success" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Estimated Savings" 
                            secondary={
                              <>
                                <Typography variant="body2">
                                  Distance: {formatDistance(optimizationResult.summary.savingsEstimate.distance)}
                                </Typography>
                                <Typography variant="body2">
                                  Time: {formatDuration(optimizationResult.summary.savingsEstimate.time)}
                                </Typography>
                                <Typography variant="body2">
                                  Fuel: {optimizationResult.summary.savingsEstimate.fuel.toFixed(2)} L
                                </Typography>
                                <Typography variant="body2">
                                  Cost: ${optimizationResult.summary.savingsEstimate.cost.toFixed(2)}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      </>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Map Card */}
            <Grid item xs={12} md={8}>
              <Card sx={{ height: '400px' }}>
                <CardHeader title="Optimized Route" />
                <Divider />
                <CardContent sx={{ p: 0, height: '350px' }}>
                  {optimizationResult.routes.length > 0 && (
                    <MapContainer 
                      style={{ height: '100%', width: '100%' }}
                      center={[
                        optimizationResult.routes[0].startLocation.latitude,
                        optimizationResult.routes[0].startLocation.longitude
                      ]}
                      zoom={12}
                      scrollWheelZoom={true}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      
                      {/* Start marker */}
                      <Marker 
                        position={[
                          optimizationResult.routes[0].startLocation.latitude,
                          optimizationResult.routes[0].startLocation.longitude
                        ]}
                      >
                        <Popup>
                          <strong>Start Location</strong>
                          <br />
                          {optimizationResult.routes[0].startLocation.address || 'Starting point'}
                        </Popup>
                      </Marker>
                      
                      {/* Waypoint markers */}
                      {optimizationResult.routes[0].waypoints.map((waypoint, index) => (
                        <Marker 
                          key={index} 
                          position={[
                            waypoint.location.latitude,
                            waypoint.location.longitude
                          ]}
                        >
                          <Popup>
                            <strong>Stop {index + 1}</strong>
                            <br />
                            {waypoint.name || waypoint.location.address || 'Stop'}
                            <br />
                            Arrival: {waypoint.arrivalTime ? new Date(waypoint.arrivalTime).toLocaleTimeString() : 'N/A'}
                          </Popup>
                        </Marker>
                      ))}
                      
                      {/* End marker */}
                      <Marker 
                        position={[
                          optimizationResult.routes[0].endLocation.latitude,
                          optimizationResult.routes[0].endLocation.longitude
                        ]}
                      >
                        <Popup>
                          <strong>End Location</strong>
                          <br />
                          {optimizationResult.routes[0].endLocation.address || 'Ending point'}
                        </Popup>
                      </Marker>
                      
                      {/* Route line */}
                      <Polyline 
                        positions={getRouteCoordinates()} 
                        color="blue"
                        weight={5}
                        opacity={0.7}
                      />
                    </MapContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            {/* Route Details */}
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Route Details" />
                <Divider />
                <CardContent>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Stop</TableCell>
                          <TableCell>Location</TableCell>
                          <TableCell>ETA</TableCell>
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
                          <TableCell>
                            {optimizationResult.routes[0].startLocation.address || 'Starting point'}
                          </TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>
                            {new Date(optimizationResult.routes[0].startTime).toLocaleTimeString()}
                          </TableCell>
                        </TableRow>
                        
                        {/* Waypoints */}
                        {optimizationResult.routes[0].waypoints.map((waypoint, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Chip icon={<LocationOnIcon />} label={`Stop ${index + 1}`} size="small" />
                            </TableCell>
                            <TableCell>
                              {waypoint.location.address || `Waypoint ${index + 1}`}
                            </TableCell>
                            <TableCell>
                              {waypoint.arrivalTime ? 
                               new Date(waypoint.arrivalTime).toLocaleTimeString() : 'N/A'}
                            </TableCell>
                            <TableCell>
                              {waypoint.serviceTime ? `${waypoint.serviceTime} min` : '-'}
                            </TableCell>
                            <TableCell>
                              {waypoint.departureTime ? 
                               new Date(waypoint.departureTime).toLocaleTimeString() : 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                        
                        {/* End point */}
                        <TableRow>
                          <TableCell>
                            <Chip icon={<WhereToVoteIcon />} label="End" size="small" color="secondary" />
                          </TableCell>
                          <TableCell>
                            {optimizationResult.routes[0].endLocation.address || 'Ending point'}
                          </TableCell>
                          <TableCell>
                            {new Date(optimizationResult.routes[0].endTime).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Unassigned Stops */}
            {optimizationResult.unassignedStops && optimizationResult.unassignedStops.length > 0 && (
              <Grid item xs={12}>
                <Card>
                  <CardHeader 
                    title="Unassigned Stops" 
                    subheader="These stops could not be assigned to the route"
                  />
                  <Divider />
                  <CardContent>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Stop ID</TableCell>
                            <TableCell>Reason</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {optimizationResult.unassignedStops.map((stop, index) => (
                            <TableRow key={index}>
                              <TableCell>{stop.id}</TableCell>
                              <TableCell>{stop.reason}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default OptimizationReview;
