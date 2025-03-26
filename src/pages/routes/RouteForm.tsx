import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  IconButton,
  Divider,
  InputAdornment,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  SelectChangeEvent
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, FieldArray, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import apiService from '../../utils/api';
import { toast } from 'react-toastify';
import { RouteParams } from '../../types/common';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

interface LocationState {
  vehicleId?: string;
  driverId?: string;
}

interface Vehicle {
  _id: string;
  name: string;
  licensePlate: string;
}

interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Waypoint {
  name: string;
  location: string;
}

interface RouteFormValues {
  name: string;
  startLocation: string;
  endLocation: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  vehicle: string;
  driver: string;
  distance: string | number;
  estimatedDuration: string | number;
  waypoints: Waypoint[];
  cargo: string;
  notes: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
}

// Validation schema
const RouteSchema = Yup.object().shape({
  name: Yup.string().required('Route name is required'),
  startLocation: Yup.string().required('Start location is required'),
  endLocation: Yup.string().required('End location is required'),
  scheduledStartTime: Yup.date().nullable(),
  scheduledEndTime: Yup.date().nullable(),
  vehicle: Yup.string(),
  driver: Yup.string(),
  distance: Yup.number()
    .typeError('Distance must be a number')
    .min(0, 'Distance cannot be negative')
    .nullable(),
  estimatedDuration: Yup.number()
    .typeError('Duration must be a number')
    .min(0, 'Duration cannot be negative')
    .nullable(),
  waypoints: Yup.array().of(
    Yup.object().shape({
      name: Yup.string(),
      location: Yup.string().required('Waypoint location is required'),
    })
  ),
  cargo: Yup.string(),
  notes: Yup.string()
});

const RouteForm: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  
  const isEditMode = Boolean(id);
  const vehicleId = locationState?.vehicleId;
  const driverId = locationState?.driverId;
  
  const [route, setRoute] = useState<RouteFormValues | null>(null);
  const [loading, setLoading] = useState<boolean>(isEditMode);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState<boolean>(true);
  const [loadingDrivers, setLoadingDrivers] = useState<boolean>(true);

  // Initial form values
  const initialValues: RouteFormValues = {
    name: '',
    startLocation: '',
    endLocation: '',
    scheduledStartTime: '',
    scheduledEndTime: '',
    vehicle: vehicleId || '',
    driver: driverId || '',
    distance: '',
    estimatedDuration: '',
    waypoints: [],
    cargo: '',
    notes: '',
    status: 'planned'
  };

  // Fetch route if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchRoute = async (): Promise<void> => {
        try {
          setLoading(true);
          const response = await apiService.getRoute(id);
          const routeData = response.data.data;
          
          // Format dates for form
          if (routeData.scheduledStartTime) {
            routeData.scheduledStartTime = new Date(routeData.scheduledStartTime).toISOString().slice(0, 16);
          }
          
          if (routeData.scheduledEndTime) {
            routeData.scheduledEndTime = new Date(routeData.scheduledEndTime).toISOString().slice(0, 16);
          }
          
          // Extract IDs from objects
          if (routeData.vehicle && typeof routeData.vehicle === 'object') {
            routeData.vehicle = routeData.vehicle._id;
          }
          
          if (routeData.driver && typeof routeData.driver === 'object') {
            routeData.driver = routeData.driver._id;
          }
          
          setRoute(routeData as RouteFormValues);
        } catch (error) {
          console.error('Error fetching route:', error);
          toast.error('Failed to load route data');
        } finally {
          setLoading(false);
        }
      };
      
      fetchRoute();
    }
  }, [id, isEditMode]);

  // Fetch vehicles and drivers
  useEffect(() => {
    const fetchVehicles = async (): Promise<void> => {
      try {
        setLoadingVehicles(true);
        const response = await apiService.getVehicles({ limit: 100, status: 'active' });
        setVehicles(response.data.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        toast.error('Failed to load vehicles');
      } finally {
        setLoadingVehicles(false);
      }
    };

    const fetchDrivers = async (): Promise<void> => {
      try {
        setLoadingDrivers(true);
        const response = await apiService.getDrivers({ limit: 100, status: 'active' });
        setDrivers(response.data.data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        toast.error('Failed to load drivers');
      } finally {
        setLoadingDrivers(false);
      }
    };
    
    fetchVehicles();
    fetchDrivers();
  }, []);

  // Handle form submission
  const handleSubmit = async (values: RouteFormValues, { setSubmitting }: FormikHelpers<RouteFormValues>): Promise<void> => {
    try {
      if (isEditMode && id) {
        await apiService.updateRoute(id, values);
        toast.success('Route updated successfully');
      } else {
        await apiService.createRoute(values);
        toast.success('Route created successfully');
      }
      
      navigate('/routes');
    } catch (error) {
      console.error('Error saving route:', error);
      toast.error((error as any).response?.data?.message || 'Failed to save route');
      setSubmitting(false);
    }
  };

  // Calculate duration in hours and minutes
  const formatDuration = (minutes: number | string): string => {
    if (!minutes) return '';
    const mins = Number(minutes);
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  };

  if (loading || loadingVehicles || loadingDrivers) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate(isEditMode && id ? `/routes/${id}` : '/routes')} 
          sx={{ mr: 1 }}
          aria-label="back"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {isEditMode ? 'Edit Route' : 'Create New Route'}
        </Typography>
      </Box>

      {/* Form */}
      <Paper sx={{ p: 3 }}>
        <Formik
          initialValues={route || initialValues}
          validationSchema={RouteSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting, values, setFieldValue }) => (
            <Form>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Basic Information</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="name"
                    label="Route Name"
                    fullWidth
                    variant="outlined"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl 
                    fullWidth 
                    variant="outlined"
                    error={touched.vehicle && Boolean(errors.vehicle)}
                  >
                    <InputLabel id="vehicle-label">Vehicle (Optional)</InputLabel>
                    <Field
                      as={Select}
                      name="vehicle"
                      labelId="vehicle-label"
                      label="Vehicle (Optional)"
                      startAdornment={<InputAdornment position="start"><DirectionsCarIcon /></InputAdornment>}
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      {vehicles.map((vehicle) => (
                        <MenuItem key={vehicle._id} value={vehicle._id}>
                          {vehicle.name} ({vehicle.licensePlate})
                        </MenuItem>
                      ))}
                    </Field>
                    {touched.vehicle && errors.vehicle && (
                      <FormHelperText>{errors.vehicle as string}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl 
                    fullWidth 
                    variant="outlined"
                    error={touched.driver && Boolean(errors.driver)}
                  >
                    <InputLabel id="driver-label">Driver (Optional)</InputLabel>
                    <Field
                      as={Select}
                      name="driver"
                      labelId="driver-label"
                      label="Driver (Optional)"
                      startAdornment={<InputAdornment position="start"><PersonIcon /></InputAdornment>}
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      {drivers.map((driver) => (
                        <MenuItem key={driver._id} value={driver._id}>
                          {driver.firstName} {driver.lastName}
                        </MenuItem>
                      ))}
                    </Field>
                    {touched.driver && errors.driver && (
                      <FormHelperText>{errors.driver as string}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                
                {/* Schedule Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Schedule</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="scheduledStartTime"
                    label="Scheduled Start Time"
                    type="datetime-local"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={touched.scheduledStartTime && Boolean(errors.scheduledStartTime)}
                    helperText={touched.scheduledStartTime && errors.scheduledStartTime}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="scheduledEndTime"
                    label="Scheduled End Time"
                    type="datetime-local"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={touched.scheduledEndTime && Boolean(errors.scheduledEndTime)}
                    helperText={touched.scheduledEndTime && errors.scheduledEndTime}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                
                {/* Route Details */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Route Details</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="startLocation"
                    label="Start Location"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MyLocationIcon />
                        </InputAdornment>
                      ),
                    }}
                    error={touched.startLocation && Boolean(errors.startLocation)}
                    helperText={touched.startLocation && errors.startLocation}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="endLocation"
                    label="End Location"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon />
                        </InputAdornment>
                      ),
                    }}
                    error={touched.endLocation && Boolean(errors.endLocation)}
                    helperText={touched.endLocation && errors.endLocation}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="distance"
                    label="Distance (km)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={touched.distance && Boolean(errors.distance)}
                    helperText={touched.distance && errors.distance}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="estimatedDuration"
                    label="Estimated Duration (minutes)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={touched.estimatedDuration && Boolean(errors.estimatedDuration)}
                    helperText={touched.estimatedDuration && errors.estimatedDuration}
                    InputProps={{
                      endAdornment: values.estimatedDuration ? (
                        <InputAdornment position="end">
                          {formatDuration(values.estimatedDuration)}
                        </InputAdornment>
                      ) : null,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="cargo"
                    label="Cargo/Purpose"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalShippingIcon />
                        </InputAdornment>
                      ),
                    }}
                    error={touched.cargo && Boolean(errors.cargo)}
                    helperText={touched.cargo && errors.cargo}
                  />
                </Grid>
                
                {/* Waypoints */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 2 }}>
                    <Typography variant="h6">Waypoints</Typography>
                    <FieldArray name="waypoints">
                      {({ push }) => (
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => push({ name: '', location: '' })}
                        >
                          Add Waypoint
                        </Button>
                      )}
                    </FieldArray>
                  </Box>
                  
                  <FieldArray name="waypoints">
                    {({ remove, push }) => (
                      <Box>
                        {values.waypoints.length > 0 ? (
                          <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                            {values.waypoints.map((waypoint, index) => (
                              <ListItem key={index} sx={{ border: '1px solid', borderColor: 'divider', mb: 1, borderRadius: 1 }}>
                                <ListItemIcon>
                                  <DragIndicatorIcon />
                                </ListItemIcon>
                                <ListItemText>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} sm={5}>
                                      <Field
                                        as={TextField}
                                        name={`waypoints.${index}.name`}
                                        label="Waypoint Name"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        error={touched.waypoints?.[index]?.name && Boolean(typeof errors.waypoints?.[index] === 'object' && 'name' in errors.waypoints[index] ? errors.waypoints[index].name : undefined)}
                                        helperText={touched.waypoints?.[index]?.name && (typeof errors.waypoints?.[index] === 'object' && 'name' in errors.waypoints[index] ? errors.waypoints[index].name : undefined)}
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={7}>
                                      <Field
                                        as={TextField}
                                        name={`waypoints.${index}.location`}
                                        label="Location"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        error={touched.waypoints?.[index]?.location && Boolean(typeof errors.waypoints?.[index] === 'object' && 'location' in errors.waypoints[index] ? errors.waypoints[index].location : undefined)}
                                        helperText={touched.waypoints?.[index]?.location && (typeof errors.waypoints?.[index] === 'object' && 'location' in errors.waypoints[index] ? errors.waypoints[index].location : undefined)}
                                      />
                                    </Grid>
                                  </Grid>
                                </ListItemText>
                                <ListItemSecondaryAction>
                                  <IconButton edge="end" onClick={() => remove(index)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Card variant="outlined" sx={{ mb: 2 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                              <Typography variant="body2" color="text.secondary">
                                No waypoints added yet. Click "Add Waypoint" to add stops along your route.
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </Box>
                    )}
                  </FieldArray>
                </Grid>
                
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="notes"
                    label="Notes"
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    error={touched.notes && Boolean(errors.notes)}
                    helperText={touched.notes && errors.notes}
                  />
                </Grid>
                
                {/* Form Actions */}
                <Grid item xs={12} sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(isEditMode && id ? `/routes/${id}` : '/routes')}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : isEditMode ? 'Update Route' : 'Create Route'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default RouteForm;
