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
  InputAdornment
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import apiService from '../../utils/api';
import { toast } from 'react-toastify';
import { RouteParams } from '../../types/common';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';

interface LocationState {
  vehicleId?: string;
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

interface Odometer {
  value: number | string;
  unit: string;
}

interface FuelFormValues {
  date: string;
  vehicle: string;
  quantity: number | string;
  unit: string;
  totalCost: number | string;
  fuelType: string;
  odometer: Odometer;
  driver: string;
  station: string;
  location: string;
  notes: string;
}

// Validation schema
const FuelRecordSchema = Yup.object().shape({
  date: Yup.date().required('Date is required'),
  vehicle: Yup.string().required('Vehicle is required'),
  quantity: Yup.number()
    .typeError('Quantity must be a number')
    .positive('Quantity must be positive')
    .required('Quantity is required'),
  unit: Yup.string().required('Unit is required'),
  totalCost: Yup.number()
    .typeError('Total cost must be a number')
    .min(0, 'Total cost cannot be negative')
    .required('Total cost is required'),
  fuelType: Yup.string(),
  odometer: Yup.object().shape({
    value: Yup.number()
      .typeError('Odometer value must be a number')
      .min(0, 'Odometer value cannot be negative')
      .required('Odometer value is required'),
    unit: Yup.string().required('Odometer unit is required')
  }),
  driver: Yup.string(),
  station: Yup.string(),
  location: Yup.string(),
  notes: Yup.string()
});

const FuelForm: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  
  const isEditMode = Boolean(id);
  const vehicleId = locationState?.vehicleId;
  
  const [fuelRecord, setFuelRecord] = useState<FuelFormValues | null>(null);
  const [loading, setLoading] = useState<boolean>(isEditMode);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState<boolean>(true);
  const [loadingDrivers, setLoadingDrivers] = useState<boolean>(true);

  // Initial form values
  const initialValues: FuelFormValues = {
    date: new Date().toISOString().split('T')[0],
    vehicle: vehicleId || '',
    quantity: '',
    unit: 'L',
    totalCost: '',
    fuelType: '',
    odometer: {
      value: '',
      unit: 'km'
    },
    driver: '',
    station: '',
    location: '',
    notes: ''
  };

  // Fetch fuel record if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchFuelRecord = async (): Promise<void> => {
        try {
          setLoading(true);
          const response = await apiService.getFuelRecord(id);
          const recordData = response.data.data;
          
          // Format date for form
          if (recordData.date) {
            recordData.date = recordData.date.split('T')[0];
          }
          
          // Extract IDs from objects
          if (recordData.vehicle && typeof recordData.vehicle === 'object') {
            recordData.vehicle = recordData.vehicle._id;
          }
          
          if (recordData.driver && typeof recordData.driver === 'object') {
            recordData.driver = recordData.driver._id;
          }
          
          setFuelRecord(recordData);
        } catch (error) {
          console.error('Error fetching fuel record:', error);
          toast.error('Failed to load fuel record data');
        } finally {
          setLoading(false);
        }
      };
      
      fetchFuelRecord();
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
  const handleSubmit = async (values: FuelFormValues, { setSubmitting }: FormikHelpers<FuelFormValues>): Promise<void> => {
    try {
      if (isEditMode && id) {
        await apiService.updateFuelRecord(id, values);
        toast.success('Fuel record updated successfully');
      } else {
        await apiService.createFuelRecord(values);
        toast.success('Fuel record created successfully');
      }
      
      navigate('/fuel');
    } catch (error: any) {
      console.error('Error saving fuel record:', error);
      toast.error(error.response?.data?.message || 'Failed to save fuel record');
      setSubmitting(false);
    }
  };

  // Calculate price per unit
  const calculatePricePerUnit = (quantity: number | string, totalCost: number | string): string => {
    const numQuantity = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
    const numTotalCost = typeof totalCost === 'string' ? parseFloat(totalCost) : totalCost;
    
    if (!numQuantity || !numTotalCost || numQuantity <= 0) return '0.00';
    return (numTotalCost / numQuantity).toFixed(2);
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
          onClick={() => navigate(isEditMode && id ? `/fuel/${id}` : '/fuel')} 
          sx={{ mr: 1 }}
          aria-label="back"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {isEditMode ? 'Edit Fuel Record' : 'Add New Fuel Record'}
        </Typography>
      </Box>

      {/* Form */}
      <Paper sx={{ p: 3 }}>
        <Formik
          initialValues={fuelRecord || initialValues}
          validationSchema={FuelRecordSchema}
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
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="date"
                    label="Date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={touched.date && Boolean(errors.date)}
                    helperText={touched.date && errors.date}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl 
                    fullWidth 
                    variant="outlined"
                    error={touched.vehicle && Boolean(errors.vehicle)}
                  >
                    <InputLabel id="vehicle-label">Vehicle</InputLabel>
                    <Field
                      as={Select}
                      name="vehicle"
                      labelId="vehicle-label"
                      label="Vehicle"
                      startAdornment={<InputAdornment position="start"><DirectionsCarIcon /></InputAdornment>}
                    >
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
                
                <Grid item xs={12} sm={6} md={4}>
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
                
                {/* Fuel Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Fuel Information</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="quantity"
                    label="Quantity"
                    type="number"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{values.unit}</InputAdornment>,
                    }}
                    error={touched.quantity && Boolean(errors.quantity)}
                    helperText={touched.quantity && errors.quantity}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl 
                    fullWidth 
                    variant="outlined"
                    error={touched.unit && Boolean(errors.unit)}
                  >
                    <InputLabel id="unit-label">Unit</InputLabel>
                    <Field
                      as={Select}
                      name="unit"
                      labelId="unit-label"
                      label="Unit"
                    >
                      <MenuItem value="L">Liters (L)</MenuItem>
                      <MenuItem value="gal">Gallons (gal)</MenuItem>
                    </Field>
                    {touched.unit && errors.unit && (
                      <FormHelperText>{errors.unit as string}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="totalCost"
                    label="Total Cost"
                    type="number"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    error={touched.totalCost && Boolean(errors.totalCost)}
                    helperText={touched.totalCost && errors.totalCost}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Price per Unit"
                    value={calculatePricePerUnit(values.quantity, values.totalCost)}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      endAdornment: <InputAdornment position="end">/{values.unit}</InputAdornment>,
                      readOnly: true,
                    }}
                    disabled
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="fuelType"
                    label="Fuel Type"
                    fullWidth
                    variant="outlined"
                    error={touched.fuelType && Boolean(errors.fuelType)}
                    helperText={touched.fuelType && errors.fuelType}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="odometer.value"
                    label="Odometer Reading"
                    type="number"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{values.odometer?.unit}</InputAdornment>,
                    }}
                    error={touched.odometer?.value && Boolean(errors.odometer?.value)}
                    helperText={touched.odometer?.value && (errors.odometer?.value as string)}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl 
                    fullWidth 
                    variant="outlined"
                    error={touched.odometer?.unit && Boolean(errors.odometer?.unit)}
                  >
                    <InputLabel id="odometer-unit-label">Odometer Unit</InputLabel>
                    <Field
                      as={Select}
                      name="odometer.unit"
                      labelId="odometer-unit-label"
                      label="Odometer Unit"
                    >
                      <MenuItem value="km">Kilometers (km)</MenuItem>
                      <MenuItem value="mi">Miles (mi)</MenuItem>
                    </Field>
                    {touched.odometer?.unit && errors.odometer?.unit && (
                      <FormHelperText>{errors.odometer.unit as string}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                
                {/* Additional Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Additional Information</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="station"
                    label="Gas Station"
                    fullWidth
                    variant="outlined"
                    error={touched.station && Boolean(errors.station)}
                    helperText={touched.station && errors.station}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="location"
                    label="Location"
                    fullWidth
                    variant="outlined"
                    error={touched.location && Boolean(errors.location)}
                    helperText={touched.location && errors.location}
                  />
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
                      onClick={() => navigate(isEditMode && id ? `/fuel/${id}` : '/fuel')}
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
                      {isSubmitting ? 'Saving...' : isEditMode ? 'Update Record' : 'Create Record'}
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

export default FuelForm;
