import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../utils/api';
import { toast } from 'react-toastify';
import LoggingService from '../../utils/loggingService';
import { useAuth } from '../../context/AuthContext';
// import { RouteParams } from '../../types/common';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BuildIcon from '@mui/icons-material/Build';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import RouteIcon from '@mui/icons-material/Route';
import SpeedIcon from '@mui/icons-material/Speed';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';

// Map components
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icon
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface RouteParams {
  id: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Coordinates {
  type: string;
  coordinates: number[];
  timestamp: string;
}

interface Odometer {
  value: number;
  unit: string;
  date?: string;
}

interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Cost {
  parts?: number;
  labor?: number;
  total: number;
}

interface MaintenanceRecord {
  _id: string;
  type: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  scheduledDate: string;
  completedDate?: string;
  cost?: Cost;
}

interface FuelRecord {
  _id: string;
  date: string;
  quantity: number;
  unit: string;
  totalCost: number;
  station?: string;
}

interface Route {
  _id: string;
  name: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  scheduledStartTime?: string;
}

interface Vehicle {
  _id: string;
  name: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  type?: string;
  status: 'active' | 'maintenance' | 'inactive' | 'retired';
  color?: string;
  fuelType?: string;
  registrationNumber?: string;
  registrationExpiry?: string;
  insuranceNumber?: string;
  insuranceExpiry?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  fuelCapacity?: number;
  currentOdometer: Odometer | number;
  currentLocation?: Coordinates;
  assignedDriver?: Driver;
}

// Tab panel component
function TabPanel(props: TabPanelProps): JSX.Element {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vehicle-tabpanel-${index}`}
      aria-labelledby={`vehicle-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const VehicleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState<number>(0);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // Fetch vehicle data
  useEffect(() => {
    const fetchVehicleData = async (): Promise<void> => {
      if (!id) return;
      
      try {
        setLoading(true);
        const vehicleRes = await apiService.getVehicle(id);
        setVehicle(vehicleRes.data.data);
        
        // Fetch maintenance records
        const maintenanceRes = await apiService.getMaintenanceRecords({ vehicle: id, sort: '-scheduledDate', limit: 5 });
        setMaintenanceRecords(maintenanceRes.data.data);
        
        // Fetch fuel records
        const fuelRes = await apiService.getFuelRecords({ vehicle: id, sort: '-date', limit: 5 });
        setFuelRecords(fuelRes.data.data);
        
        // Fetch routes
        const routesRes = await apiService.getRoutes({ vehicle: id, sort: '-scheduledStartTime', limit: 5 });
        setRoutes(routesRes.data.data);
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
        toast.error('Failed to load vehicle data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicleData();
  }, [id]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue);
  };

  // Handle delete
  const handleDeleteClick = (): void => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = (): void => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!id) return;
    
    try {
      setDeleteLoading(true);
      await apiService.deleteVehicle(id);
      toast.success('Vehicle deleted successfully');
      navigate('/vehicles');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!vehicle) {
    return (
      <Box>
        <Typography variant="h5" color="error">Vehicle not found</Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/vehicles')}
          sx={{ mt: 2 }}
        >
          Back to Vehicles
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={() => navigate('/vehicles')} 
            sx={{ mr: 1 }}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">{vehicle.name}</Typography>
          <Chip 
            label={vehicle.status} 
            color={
              vehicle.status === 'active' ? 'success' :
              vehicle.status === 'maintenance' ? 'warning' :
              vehicle.status === 'inactive' ? 'default' :
              'error' // retired
            }
            size="small"
            sx={{ ml: 2 }}
          />
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/vehicles/${id}/edit`)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Vehicle Info */}
      <Grid container spacing={3}>
        {/* Left column - Vehicle details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">License Plate</Typography>
                <Typography variant="h6">{vehicle.licensePlate}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">VIN</Typography>
                <Typography variant="h6">{vehicle.vin || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">Make & Model</Typography>
                <Typography variant="h6">{`${vehicle.make} ${vehicle.model}`}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">Year</Typography>
                <Typography variant="h6">{vehicle.year}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">Color</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 20, 
                      height: 20, 
                      borderRadius: '50%', 
                      backgroundColor: vehicle.color || '#cccccc',
                      mr: 1,
                      border: '1px solid #ddd'
                    }} 
                  />
                  <Typography variant="h6">{vehicle.color || 'N/A'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">Type</Typography>
                <Typography variant="h6">{vehicle.type || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">Current Odometer</Typography>
                <Typography variant="h6">
                  {vehicle.currentOdometer ? 
                    typeof vehicle.currentOdometer === 'object' ?
                      `${vehicle.currentOdometer.value?.toLocaleString() || '0'} ${vehicle.currentOdometer.unit || 'km'}` :
                      `${vehicle.currentOdometer.toLocaleString()} km` : 
                    'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">Fuel Type</Typography>
                <Typography variant="h6">{vehicle.fuelType || 'N/A'}</Typography>
              </Grid>
              {vehicle.assignedDriver && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1" color="text.secondary">Assigned Driver</Typography>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mt: 1,
                      p: 1,
                      bgcolor: 'background.default',
                      borderRadius: 1
                    }}
                    onClick={() => vehicle.assignedDriver && navigate(`/drivers/${vehicle.assignedDriver._id}`)}
                  >
                    <PersonIcon sx={{ mr: 1 }} />
                    <Typography>
                      {`${vehicle.assignedDriver.firstName} ${vehicle.assignedDriver.lastName}`}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Tabs for related data */}
          <Paper sx={{ mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<BuildIcon />} label="Maintenance" />
              <Tab icon={<LocalGasStationIcon />} label="Fuel" />
              <Tab icon={<RouteIcon />} label="Routes" />
            </Tabs>

            {/* Maintenance Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Recent Maintenance</Typography>
                  <Box>
                    <Button 
                      variant="outlined" 
                      startIcon={<BuildIcon />}
                      onClick={() => navigate('/maintenance/new', { state: { vehicleId: id } })}
                      sx={{ mr: 1 }}
                    >
                      Add Maintenance
                    </Button>
                    <Button 
                      variant="text"
                      onClick={() => navigate('/maintenance', { state: { vehicleId: id } })}
                    >
                      View All
                    </Button>
                  </Box>
                </Box>
                
                {maintenanceRecords.length > 0 ? (
                  <List>
                    {maintenanceRecords.map((record) => (
                      <React.Fragment key={record._id}>
                        <ListItem 
                          button 
                          onClick={() => navigate(`/maintenance/${record._id}`)}
                          secondaryAction={
                            <Chip 
                              label={record.status} 
                              color={
                                record.status === 'completed' ? 'success' :
                                record.status === 'in_progress' ? 'info' :
                                record.status === 'scheduled' ? 'primary' :
                                record.status === 'overdue' ? 'error' :
                                'default' // cancelled
                              }
                              size="small"
                            />
                          }
                        >
                          <ListItemIcon>
                            <BuildIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary={record.type} 
                            secondary={
                              <>
                                {record.status === 'completed' ? 
                                  `Completed: ${new Date(record.completedDate || '').toLocaleDateString()}` : 
                                  `Scheduled: ${new Date(record.scheduledDate).toLocaleDateString()}`}
                                {record.cost && record.cost.total ? ` - $${record.cost.total.toFixed(2)}` : ''}
                              </>
                            } 
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                    No maintenance records found
                  </Typography>
                )}
              </Box>
            </TabPanel>

            {/* Fuel Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Recent Fuel Records</Typography>
                  <Box>
                    <Button 
                      variant="outlined" 
                      startIcon={<LocalGasStationIcon />}
                      onClick={() => navigate('/fuel/new', { state: { vehicleId: id } })}
                      sx={{ mr: 1 }}
                    >
                      Add Fuel Record
                    </Button>
                    <Button 
                      variant="text"
                      onClick={() => navigate('/fuel', { state: { vehicleId: id } })}
                    >
                      View All
                    </Button>
                  </Box>
                </Box>
                
                {fuelRecords.length > 0 ? (
                  <List>
                    {fuelRecords.map((record) => (
                      <React.Fragment key={record._id}>
                        <ListItem 
                          button 
                          onClick={() => navigate(`/fuel/${record._id}`)}
                        >
                          <ListItemIcon>
                            <LocalGasStationIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary={`${record.quantity} ${record.unit} - $${record.totalCost.toFixed(2)}`} 
                            secondary={`${new Date(record.date).toLocaleDateString()} - ${record.station || 'N/A'}`} 
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                    No fuel records found
                  </Typography>
                )}
              </Box>
            </TabPanel>

            {/* Routes Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Recent Routes</Typography>
                  <Box>
                    <Button 
                      variant="outlined" 
                      startIcon={<RouteIcon />}
                      onClick={() => navigate('/routes/new', { state: { vehicleId: id } })}
                      sx={{ mr: 1 }}
                    >
                      Create Route
                    </Button>
                    <Button 
                      variant="text"
                      onClick={() => navigate('/routes', { state: { vehicleId: id } })}
                    >
                      View All
                    </Button>
                  </Box>
                </Box>
                
                {routes.length > 0 ? (
                  <List>
                    {routes.map((route) => (
                      <React.Fragment key={route._id}>
                        <ListItem 
                          button 
                          onClick={() => navigate(`/routes/${route._id}`)}
                          secondaryAction={
                            <Chip 
                              label={route.status} 
                              color={
                                route.status === 'completed' ? 'success' :
                                route.status === 'in_progress' ? 'info' :
                                route.status === 'planned' ? 'primary' :
                                'error' // cancelled
                              }
                              size="small"
                            />
                          }
                        >
                          <ListItemIcon>
                            <RouteIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary={route.name} 
                            secondary={
                              route.scheduledStartTime ? 
                                `Scheduled: ${new Date(route.scheduledStartTime).toLocaleDateString()}` : 
                                'No schedule'
                            } 
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                    No routes found
                  </Typography>
                )}
              </Box>
            </TabPanel>
          </Paper>
        </Grid>

        {/* Right column - Map and stats */}
        <Grid item xs={12} md={4}>
          {/* Current Location */}
          {vehicle.currentLocation && vehicle.currentLocation.coordinates && (
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Current Location</Typography>
              <Box sx={{ height: 300, width: '100%', mb: 2 }}>
                {/* @ts-ignore - Ignoring type issues with react-leaflet props */}
                <MapContainer 
                  style={{ height: '100%', width: '100%' }}
                  center={[vehicle.currentLocation.coordinates[1], vehicle.currentLocation.coordinates[0]]}
                  zoom={13}
                >
                  {/* @ts-ignore - Ignoring type issues with TileLayer props */}
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[vehicle.currentLocation.coordinates[1], vehicle.currentLocation.coordinates[0]]}>
                    <Popup>
                      {vehicle.name}<br />
                      Last updated: {new Date(vehicle.currentLocation.timestamp).toLocaleString()}
                    </Popup>
                  </Marker>
                </MapContainer>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Last updated: {new Date(vehicle.currentLocation.timestamp).toLocaleString()}
              </Typography>
            </Paper>
          )}

          {/* Vehicle Stats */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Vehicle Stats</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SpeedIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">Odometer</Typography>
                    </Box>
                    <Typography variant="h6">
                      {vehicle.currentOdometer ? 
                        typeof vehicle.currentOdometer === 'object' ?
                          `${vehicle.currentOdometer.value?.toLocaleString() || '0'} ${vehicle.currentOdometer.unit || 'km'}` :
                          `${vehicle.currentOdometer.toLocaleString()} km` : 
                        'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">Registration</Typography>
                    </Box>
                    <Typography variant="h6">
                      {vehicle.registrationExpiry ? 
                        new Date(vehicle.registrationExpiry).toLocaleDateString() : 
                        'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <BuildIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">Maintenance</Typography>
                    </Box>
                    <Typography variant="h6">{maintenanceRecords.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocalGasStationIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">Fuel Records</Typography>
                    </Box>
                    <Typography variant="h6">{fuelRecords.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* Additional Info */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Additional Information</Typography>
            <List dense>
              {vehicle.registrationNumber && (
                <ListItem>
                  <ListItemIcon>
                    <VpnKeyIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Registration Number" 
                    secondary={vehicle.registrationNumber} 
                  />
                </ListItem>
              )}
              {vehicle.insuranceNumber && (
                <ListItem>
                  <ListItemIcon>
                    <VpnKeyIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Insurance Number" 
                    secondary={vehicle.insuranceNumber} 
                  />
                </ListItem>
              )}
              {vehicle.insuranceExpiry && (
                <ListItem>
                  <ListItemIcon>
                    <CalendarTodayIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Insurance Expiry" 
                    secondary={new Date(vehicle.insuranceExpiry).toLocaleDateString()} 
                  />
                </ListItem>
              )}
              {vehicle.purchaseDate && (
                <ListItem>
                  <ListItemIcon>
                    <CalendarTodayIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Purchase Date" 
                    secondary={new Date(vehicle.purchaseDate).toLocaleDateString()} 
                  />
                </ListItem>
              )}
              {vehicle.purchasePrice && (
                <ListItem>
                  <ListItemIcon>
                    <DirectionsCarIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Purchase Price" 
                    secondary={`$${vehicle.purchasePrice.toLocaleString()}`} 
                  />
                </ListItem>
              )}
              {vehicle.fuelCapacity && (
                <ListItem>
                  <ListItemIcon>
                    <LocalGasStationIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Fuel Capacity" 
                    secondary={`${vehicle.fuelCapacity} L`} 
                  />
                </ListItem>
              )}
              {vehicle.color && (
                <ListItem>
                  <ListItemIcon>
                    <ColorLensIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Color" 
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 16, 
                            height: 16, 
                            borderRadius: '50%', 
                            backgroundColor: vehicle.color,
                            mr: 1,
                            border: '1px solid #ddd'
                          }} 
                        />
                        {vehicle.color}
                      </Box>
                    } 
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Vehicle</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the vehicle "{vehicle.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VehicleDetail;
