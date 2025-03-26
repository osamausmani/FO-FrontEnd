import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Chip,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LocationOn,
  DirectionsCar,
  Notifications,
  Edit,
  Delete,
  AccessTime,
  Speed,
  ExitToApp,
  SignalCellularAlt,
  Warning,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Circle, Rectangle, Polygon, Marker, Popup } from 'react-leaflet';
import { format } from 'date-fns';
import apiService from '../../utils/api';
import { Geofence, GeofenceEvent, GeofenceType } from '../../types/geofencing';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { toast } from 'react-toastify';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`geofence-tabpanel-${index}`}
      aria-labelledby={`geofence-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `geofence-tab-${index}`,
    'aria-controls': `geofence-tabpanel-${index}`,
  };
};

const GeofenceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // States
  const [geofence, setGeofence] = useState<Geofence | null>(null);
  const [events, setEvents] = useState<GeofenceEvent[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  
  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deletingGeofence, setDeletingGeofence] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          setError('No geofence ID provided');
          setLoading(false);
          return;
        }

        // Fetch geofence data
        const geofenceRes = await apiService.getGeofence(id);
        const geofenceData = geofenceRes.data.data;
        setGeofence(geofenceData);

        // Fetch events for this geofence
        const eventsRes = await apiService.getGeofenceEvents(id);
        setEvents(eventsRes.data.data);

        // Fetch vehicle details if geofence has assigned vehicles
        if (geofenceData.vehicles?.length > 0) {
          const vehiclePromises = geofenceData.vehicles.map(
            (vehicleId: string) => apiService.getVehicle(vehicleId)
          );
          const vehicleResponses = await Promise.all(vehiclePromises);
          const vehicleData = vehicleResponses.map(res => res.data.data);
          setVehicles(vehicleData);
        }

        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching geofence details:', err);
        setError(err.response?.data?.message || 'Failed to load geofence details');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    
    setDeletingGeofence(true);
    try {
      await apiService.deleteGeofence(id);
      toast.success('Geofence deleted successfully');
      navigate('/geofencing');
    } catch (err: any) {
      console.error('Error deleting geofence:', err);
      toast.error(err.response?.data?.message || 'Failed to delete geofence');
      setDeletingGeofence(false);
      setDeleteDialogOpen(false);
    }
  };

  // Function to render the geofence shape on the map
  const renderGeofenceShape = () => {
    if (!geofence) return null;

    if (geofence.type === 'circle' && geofence.geometry?.center?.coordinates) {
      const [longitude, latitude] = geofence.geometry.center.coordinates;
      const radius = geofence.geometry.radius || 500;
      return (
        <Circle 
          center={[latitude, longitude]} 
          radius={radius} 
          pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
        >
          <Popup>
            <strong>{geofence.name}</strong><br />
            Radius: {radius}m
          </Popup>
        </Circle>
      );
    } 
    else if (geofence.type === 'rectangle' && geofence.geometry?.coordinates) {
      const coords = geofence.geometry.coordinates[0];
      if (coords && coords.length >= 5) {
        const bounds = [
          [coords[0][1], coords[0][0]], // SW
          [coords[2][1], coords[2][0]]  // NE
        ] as [[number, number], [number, number]];
        
        return (
          <Rectangle 
            bounds={bounds} 
            pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.2 }}
          >
            <Popup>
              <strong>{geofence.name}</strong>
            </Popup>
          </Rectangle>
        );
      }
    } 
    else if (geofence.type === 'polygon' && geofence.geometry?.coordinates) {
      const coords = geofence.geometry.coordinates[0];
      if (coords && coords.length >= 4) {
        const positions = coords.map(([lng, lat]) => [lat, lng]);
        return (
          <Polygon 
            positions={positions as [number, number][]} 
            pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }}
          >
            <Popup>
              <strong>{geofence.name}</strong>
            </Popup>
          </Polygon>
        );
      }
    }
    return null;
  };
  
  // Function to render event markers on the map
  const renderEventMarkers = () => {
    if (!events || events.length === 0) return null;
    
    return events.map(event => (
      <Marker 
        key={event._id} 
        position={[event.position.latitude, event.position.longitude]}
      >
        <Popup>
          <strong>{event.vehicleName}</strong><br />
          Event: {event.eventType}<br />
          Time: {format(new Date(event.timestamp), 'yyyy-MM-dd HH:mm')}<br />
          {event.driverName && <>Driver: {event.driverName}<br /></>}
          {event.speed && <>Speed: {event.speed} km/h<br /></>}
          {event.dwellTime && <>Dwell time: {event.dwellTime} min<br /></>}
        </Popup>
      </Marker>
    ));
  };
  
  // Function to get map center
  const getMapCenter = (): [number, number] => {
    if (!geofence) return [37.7749, -122.4194]; // Default to San Francisco
    
    if (geofence.type === 'circle' && geofence.geometry?.center?.coordinates) {
      const [longitude, latitude] = geofence.geometry.center.coordinates;
      return [latitude, longitude];
    } 
    else if (geofence.type === 'rectangle' || geofence.type === 'polygon') {
      if (geofence.geometry?.coordinates && geofence.geometry.coordinates[0]?.length > 0) {
        const [longitude, latitude] = geofence.geometry.coordinates[0][0];
        return [latitude, longitude];
      }
    }
    
    return [37.7749, -122.4194]; // Default
  };

  // Get event type icon
  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'entry':
        return <SignalCellularAlt color="primary" />;
      case 'exit':
        return <ExitToApp color="secondary" />;
      case 'dwell':
        return <AccessTime color="warning" />;
      case 'speeding':
        return <Speed color="error" />;
      default:
        return <Warning />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!geofence) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography>Geofence not found</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{geofence.name}</Typography>
        <Box>
          <Tooltip title="Edit Geofence">
            <IconButton 
              color="primary" 
              onClick={() => navigate(`/geofencing/edit/${id}`)}
              sx={{ mr: 1 }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Geofence">
            <IconButton 
              color="error" 
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} aria-label="geofence tabs">
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Events" {...a11yProps(1)} />
          <Tab label="Map" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <LocationOn sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Geofence Information
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Name:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{geofence.name}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Description:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{geofence.description || 'No description'}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Type:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Chip 
                      label={geofence.type} 
                      color={
                        geofence.type === 'circle' ? 'primary' : 
                        geofence.type === 'rectangle' ? 'success' : 'warning'
                      }
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Status:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Chip 
                      label={geofence.status} 
                      color={geofence.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Created:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>
                      {geofence.createdAt ? format(new Date(geofence.createdAt), 'yyyy-MM-dd HH:mm') : 'Unknown'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Last Updated:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>
                      {geofence.updatedAt ? format(new Date(geofence.updatedAt), 'yyyy-MM-dd HH:mm') : 'Never'}
                    </Typography>
                  </Grid>
                  
                  {geofence.type === 'circle' && (
                    <>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2">Radius:</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography>{geofence.geometry?.radius || 0} meters</Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Notifications sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Alert Settings
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Alert Types:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {geofence.alertType?.entry && (
                        <Chip label="Entry" color="primary" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                      )}
                      {geofence.alertType?.exit && (
                        <Chip label="Exit" color="secondary" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                      )}
                      {geofence.alertType?.dwell && (
                        <Chip label="Dwell" color="warning" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                      )}
                      {geofence.alertType?.speedLimit && (
                        <Chip label="Speeding" color="error" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                      )}
                      {!geofence.alertType?.entry && 
                       !geofence.alertType?.exit && 
                       !geofence.alertType?.dwell && 
                       !geofence.alertType?.speedLimit && (
                        <Typography color="text.secondary">None</Typography>
                      )}
                    </Box>
                  </Grid>
                  
                  {geofence.alertType?.dwell && (
                    <>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2">Dwell Time:</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography>{geofence.alertType.dwellTime || 0} minutes</Typography>
                      </Grid>
                    </>
                  )}
                  
                  {geofence.alertType?.speedLimit && (
                    <>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2">Speed Limit:</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography>{geofence.alertType.speedLimit || 0} km/h</Typography>
                      </Grid>
                    </>
                  )}
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Notification Methods:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Box>
                      {geofence.notifications?.email && geofence.notifications.email.length > 0 && (
                        <Chip label="Email" size="small" sx={{ mr: 1, mb: 1 }} />
                      )}
                      {geofence.notifications?.sms && geofence.notifications.sms.length > 0 && (
                        <Chip label="SMS" size="small" sx={{ mr: 1, mb: 1 }} />
                      )}
                      {geofence.notifications?.pushNotification && (
                        <Chip label="In-App" size="small" sx={{ mr: 1, mb: 1 }} />
                      )}
                      {(!geofence.notifications?.email || geofence.notifications.email.length === 0) && 
                       (!geofence.notifications?.sms || geofence.notifications.sms.length === 0) && 
                       !geofence.notifications?.pushNotification && (
                        <Typography color="text.secondary">None</Typography>
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Schedule:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Chip 
                      label={geofence.schedule?.active ? 'Active Schedule' : 'Always Active'} 
                      color={geofence.schedule?.active ? 'success' : 'default'}
                      size="small"
                    />
                    {geofence.schedule?.active && geofence.schedule.daysOfWeek && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Days: {geofence.schedule.daysOfWeek.map(day => [
                          'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
                        ][day]).join(', ')}
                      </Typography>
                    )}
                    {geofence.schedule?.active && geofence.schedule.startTime && geofence.schedule.endTime && (
                      <Typography variant="body2">
                        Hours: {geofence.schedule.startTime} - {geofence.schedule.endTime}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <DirectionsCar sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Assigned Vehicles ({vehicles.length})
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                {vehicles.length > 0 ? (
                  <List dense>
                    {vehicles.map(vehicle => (
                      <ListItem 
                        key={vehicle._id}
                        secondaryAction={
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => navigate(`/vehicles/${vehicle._id}`)}
                          >
                            View
                          </Button>
                        }
                      >
                        <ListItemIcon>
                          <DirectionsCar />
                        </ListItemIcon>
                        <ListItemText 
                          primary={vehicle.name} 
                          secondary={
                            vehicle.status === 'active' ? 'Active' : 
                            vehicle.status === 'maintenance' ? 'In Maintenance' : 'Inactive'
                          } 
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                    No vehicles assigned to this geofence
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Events
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {events.length > 0 ? (
            <List>
              {events.map(event => (
                <ListItem key={event._id} divider>
                  <ListItemIcon>
                    {getEventTypeIcon(event.eventType)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1">
                          {event.vehicleName}
                        </Typography>
                        <Chip 
                          label={event.eventType} 
                          size="small" 
                          color={
                            event.eventType === 'entry' ? 'primary' : 
                            event.eventType === 'exit' ? 'secondary' : 
                            event.eventType === 'dwell' ? 'warning' : 'error'
                          }
                          sx={{ ml: 2 }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          {format(new Date(event.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                        </Typography>
                        {event.driverName && (
                          <Typography variant="body2" component="span" sx={{ ml: 2 }}>
                            Driver: {event.driverName}
                          </Typography>
                        )}
                        {event.speed !== undefined && (
                          <Typography variant="body2" component="span" sx={{ ml: 2 }}>
                            Speed: {event.speed} km/h
                          </Typography>
                        )}
                        {event.dwellTime && (
                          <Typography variant="body2" component="span" sx={{ ml: 2 }}>
                            Dwell time: {event.dwellTime} min
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
              No events recorded for this geofence
            </Typography>
          )}
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box sx={{ height: '600px', width: '100%' }}>
            <MapContainer 
              center={getMapCenter()} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {renderGeofenceShape()}
              {tabValue === 2 && renderEventMarkers()}
            </MapContainer>
          </Box>
        </Paper>
      </TabPanel>

      <ConfirmDialog 
        open={deleteDialogOpen}
        title="Delete Geofence"
        message="Are you sure you want to delete this geofence? This action cannot be undone."
        confirmButtonText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        loading={deletingGeofence}
      />
    </Box>
  );
};

export default GeofenceDetail;
