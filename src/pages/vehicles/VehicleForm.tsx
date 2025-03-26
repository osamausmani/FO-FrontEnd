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
  Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import apiService from '../../utils/api';
import { toast } from 'react-toastify';
import LoggingService from '../../utils/loggingService';
import { useAuth } from '../../context/AuthContext';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

import { RouteParams } from '../../types/common';

interface Odometer {
  value: number;
  unit: string;
  date?: string;
}

interface VehicleFormValues {
  name: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  type: string;
  status: 'active' | 'maintenance' | 'inactive' | 'retired';
  color: string;
  fuelType: string;
  registrationNumber: string;
  registrationExpiry: string;
  insuranceNumber: string;
  insuranceExpiry: string;
  purchaseDate: string;
  purchasePrice: string | number;
  fuelCapacity: string | number;
  currentOdometer: Odometer;
}

// Validation schema
const VehicleSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  licensePlate: Yup.string().required('License plate is required'),
  make: Yup.string().required('Make is required'),
  model: Yup.string().required('Model is required'),
  year: Yup.number()
    .typeError('Year must be a number')
    .integer('Year must be an integer')
    .min(1900, 'Year must be at least 1900')
    .max(new Date().getFullYear() + 1, `Year cannot be greater than ${new Date().getFullYear() + 1}`)
    .required('Year is required'),
  vin: Yup.string(),
  type: Yup.string(),
  status: Yup.string().required('Status is required'),
  color: Yup.string(),
  fuelType: Yup.string(),
  registrationNumber: Yup.string(),
  registrationExpiry: Yup.date().nullable(),
  insuranceNumber: Yup.string(),
  insuranceExpiry: Yup.date().nullable(),
  purchaseDate: Yup.date().nullable(),
  purchasePrice: Yup.number()
    .typeError('Purchase price must be a number')
    .min(0, 'Purchase price cannot be negative'),
  fuelCapacity: Yup.number()
    .typeError('Fuel capacity must be a number')
    .min(0, 'Fuel capacity cannot be negative'),
  currentOdometer: Yup.object().shape({
    value: Yup.number()
      .typeError('Odometer value must be a number')
      .min(0, 'Odometer value cannot be negative')
      .required('Odometer value is required'),
    unit: Yup.string().required('Odometer unit is required')
  })
});

const VehicleForm: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState<boolean>(false);
  const [vehicle, setVehicle] = useState<VehicleFormValues | null>(null);
  const { user } = useAuth();
  
  // Initial form values
  const initialValues: VehicleFormValues = {
    name: '',
    licensePlate: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    type: '',
    status: 'active',
    color: '',
    fuelType: '',
    registrationNumber: '',
    registrationExpiry: '',
    insuranceNumber: '',
    insuranceExpiry: '',
    purchaseDate: '',
    purchasePrice: '',
    fuelCapacity: '',
    currentOdometer: {
      value: 0,
      unit: 'km'
    }
  };

  // Fetch vehicle data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchVehicle = async (): Promise<void> => {
        try {
          setLoading(true);
          const response = await apiService.getVehicle(id);
          const vehicleData = response.data.data;
          
          // Format dates for form
          if (vehicleData.registrationExpiry) {
            vehicleData.registrationExpiry = vehicleData.registrationExpiry.split('T')[0];
          }
          if (vehicleData.insuranceExpiry) {
            vehicleData.insuranceExpiry = vehicleData.insuranceExpiry.split('T')[0];
          }
          if (vehicleData.purchaseDate) {
            vehicleData.purchaseDate = vehicleData.purchaseDate.split('T')[0];
          }
          
          setVehicle(vehicleData);
        } catch (error) {
          console.error('Error fetching vehicle:', error);
          toast.error('Failed to load vehicle data');
        } finally {
          setLoading(false);
        }
      };
      
      fetchVehicle();
    }
  }, [id, isEditMode]);

  // Handle form submission
  const handleSubmit = async (values: VehicleFormValues, { setSubmitting }: FormikHelpers<VehicleFormValues>): Promise<void> => {
    try {
      // Format dates for API
      const formattedValues = { ...values };
      
      if (isEditMode && id) {
        const response = await apiService.updateVehicle(id, formattedValues);
        toast.success('Vehicle updated successfully');
        
        // Log the update action
        LoggingService.logVehicleAction(
          id,
          'update',
          values.name,
          `Vehicle updated by ${user?.name || 'user'}`
        );
      } else {
        const response = await apiService.createVehicle(formattedValues);
        const newVehicleId = response.data._id;
        toast.success('Vehicle created successfully');
        
        // Log the create action
        LoggingService.logVehicleAction(
          newVehicleId,
          'create',
          values.name,
          `Vehicle created by ${user?.name || 'user'}`
        );
      }
      
      navigate('/vehicles');
    } catch (error: any) {
      console.error('Error saving vehicle:', error);
      toast.error(error.response?.data?.message || 'Failed to save vehicle');
      setSubmitting(false);
    }
  };

  if (loading) {
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
          onClick={() => navigate(isEditMode && id ? `/vehicles/${id}` : '/vehicles')} 
          sx={{ mr: 1 }}
          aria-label="back"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {isEditMode && vehicle ? `Edit ${vehicle.name}` : 'Add New Vehicle'}
        </Typography>
      </Box>

      {/* Form */}
      <Paper sx={{ p: 3 }}>
        <Formik
          initialValues={vehicle || initialValues}
          validationSchema={VehicleSchema}
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
                    name="name"
                    label="Vehicle Name"
                    fullWidth
                    variant="outlined"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="licensePlate"
                    label="License Plate"
                    fullWidth
                    variant="outlined"
                    error={touched.licensePlate && Boolean(errors.licensePlate)}
                    helperText={touched.licensePlate && errors.licensePlate}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="vin"
                    label="VIN"
                    fullWidth
                    variant="outlined"
                    error={touched.vin && Boolean(errors.vin)}
                    helperText={touched.vin && errors.vin}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="make"
                    label="Make"
                    fullWidth
                    variant="outlined"
                    error={touched.make && Boolean(errors.make)}
                    helperText={touched.make && errors.make}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="model"
                    label="Model"
                    fullWidth
                    variant="outlined"
                    error={touched.model && Boolean(errors.model)}
                    helperText={touched.model && errors.model}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="year"
                    label="Year"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={touched.year && Boolean(errors.year)}
                    helperText={touched.year && errors.year}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl 
                    fullWidth 
                    variant="outlined"
                    error={touched.status && Boolean(errors.status)}
                  >
                    <InputLabel id="status-label">Status</InputLabel>
                    <Field
                      as={Select}
                      name="status"
                      labelId="status-label"
                      label="Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="maintenance">Maintenance</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="retired">Retired</MenuItem>
                    </Field>
                    {touched.status && errors.status && (
                      <FormHelperText>{errors.status as string}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="type"
                    label="Vehicle Type"
                    fullWidth
                    variant="outlined"
                    error={touched.type && Boolean(errors.type)}
                    helperText={touched.type && errors.type}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="color"
                    label="Color"
                    fullWidth
                    variant="outlined"
                    error={touched.color && Boolean(errors.color)}
                    helperText={touched.color && errors.color}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                
                {/* Odometer and Fuel */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Odometer & Fuel</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="currentOdometer.value"
                    label="Current Odometer"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={touched.currentOdometer?.value && Boolean(errors.currentOdometer?.value)}
                    helperText={touched.currentOdometer?.value && errors.currentOdometer?.value}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl 
                    fullWidth 
                    variant="outlined"
                    error={touched.currentOdometer?.unit && Boolean(errors.currentOdometer?.unit)}
                  >
                    <InputLabel id="odometer-unit-label">Odometer Unit</InputLabel>
                    <Field
                      as={Select}
                      name="currentOdometer.unit"
                      labelId="odometer-unit-label"
                      label="Odometer Unit"
                    >
                      <MenuItem value="km">Kilometers (km)</MenuItem>
                      <MenuItem value="mi">Miles (mi)</MenuItem>
                    </Field>
                    {touched.currentOdometer?.unit && errors.currentOdometer?.unit && (
                      <FormHelperText>{errors.currentOdometer.unit as string}</FormHelperText>
                    )}
                  </FormControl>
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
                    name="fuelCapacity"
                    label="Fuel Capacity (L)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={touched.fuelCapacity && Boolean(errors.fuelCapacity)}
                    helperText={touched.fuelCapacity && errors.fuelCapacity}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                
                {/* Registration and Insurance */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Registration & Insurance</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="registrationNumber"
                    label="Registration Number"
                    fullWidth
                    variant="outlined"
                    error={touched.registrationNumber && Boolean(errors.registrationNumber)}
                    helperText={touched.registrationNumber && errors.registrationNumber}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="registrationExpiry"
                    label="Registration Expiry Date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={touched.registrationExpiry && Boolean(errors.registrationExpiry)}
                    helperText={touched.registrationExpiry && errors.registrationExpiry}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="insuranceNumber"
                    label="Insurance Number"
                    fullWidth
                    variant="outlined"
                    error={touched.insuranceNumber && Boolean(errors.insuranceNumber)}
                    helperText={touched.insuranceNumber && errors.insuranceNumber}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="insuranceExpiry"
                    label="Insurance Expiry Date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={touched.insuranceExpiry && Boolean(errors.insuranceExpiry)}
                    helperText={touched.insuranceExpiry && errors.insuranceExpiry}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                
                {/* Purchase Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Purchase Information</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="purchaseDate"
                    label="Purchase Date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={touched.purchaseDate && Boolean(errors.purchaseDate)}
                    helperText={touched.purchaseDate && errors.purchaseDate}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Field
                    as={TextField}
                    name="purchasePrice"
                    label="Purchase Price ($)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={touched.purchasePrice && Boolean(errors.purchasePrice)}
                    helperText={touched.purchasePrice && errors.purchasePrice}
                  />
                </Grid>
                
                {/* Form Actions */}
                <Grid item xs={12} sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(isEditMode && id ? `/vehicles/${id}` : '/vehicles')}
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
                      {isSubmitting ? 'Saving...' : isEditMode ? 'Update Vehicle' : 'Create Vehicle'}
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

export default VehicleForm;
