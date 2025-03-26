import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  IconButton, 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  CircularProgress,
  Divider,
  Alert,
  InputAdornment,
  SelectChangeEvent
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import apiService from '../../utils/api';
import { RouteParams } from '../../types/common';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  licensePlate: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  licenseExpiry: Date | null;
  dateOfBirth: Date | null;
  dateOfHire: Date | null;
  emergencyContactName: string;
  emergencyContactPhone: string;
  status: string;
  vehicle: string;
  notes: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  dateOfHire?: string;
  dateOfBirth?: string;
  [key: string]: string | undefined;
}

const DriverForm: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState<boolean>(isEditMode);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    licenseExpiry: null,
    dateOfBirth: null,
    dateOfHire: null,
    emergencyContactName: '',
    emergencyContactPhone: '',
    status: 'active',
    vehicle: '',
    notes: ''
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    fetchVehicles();
    if (isEditMode && id) {
      fetchDriverData();
    }
  }, [id]);

  const fetchVehicles = async (): Promise<void> => {
    try {
      const response = await apiService.getVehicles({ limit: 100 });
      setVehicles(response.data.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to fetch vehicles');
    }
  };

  const fetchDriverData = async (): Promise<void> => {
    if (!id) return;
    
    try {
      const response = await apiService.getDriver(id);
      const driver = response.data;
      
      setFormData({
        firstName: driver.firstName || '',
        lastName: driver.lastName || '',
        email: driver.email || '',
        phone: driver.phone || '',
        address: driver.address || '',
        licenseNumber: driver.licenseNumber || '',
        licenseExpiry: driver.licenseExpiry ? new Date(driver.licenseExpiry) : null,
        dateOfBirth: driver.dateOfBirth ? new Date(driver.dateOfBirth) : null,
        dateOfHire: driver.dateOfHire ? new Date(driver.dateOfHire) : null,
        emergencyContactName: driver.emergencyContactName || '',
        emergencyContactPhone: driver.emergencyContactPhone || '',
        status: driver.status || 'active',
        vehicle: driver.vehicle || '',
        notes: driver.notes || ''
      });
    } catch (error) {
      console.error('Error fetching driver data:', error);
      setError('Failed to fetch driver data. Please try again.');
      toast.error('Failed to fetch driver data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined
      });
    }
  };

  const handleDateChange = (name: string, date: Date | null): void => {
    setFormData({
      ...formData,
      [name]: date
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!formData.licenseNumber.trim()) {
      errors.licenseNumber = 'License number is required';
    }
    
    if (!formData.licenseExpiry) {
      errors.licenseExpiry = 'License expiry date is required';
    } else if (formData.licenseExpiry < new Date()) {
      errors.licenseExpiry = 'License has expired';
    }
    
    if (!formData.dateOfHire) {
      errors.dateOfHire = 'Hire date is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      const payload = {
        ...formData,
        licenseExpiry: formData.licenseExpiry?.toISOString(),
        dateOfBirth: formData.dateOfBirth?.toISOString(),
        dateOfHire: formData.dateOfHire?.toISOString(),
        vehicle: formData.vehicle || null
      };
      
      if (isEditMode && id) {
        await apiService.updateDriver(id, payload);
        toast.success('Driver updated successfully');
      } else {
        await apiService.createDriver(payload);
        toast.success('Driver added successfully');
      }
      
      navigate('/drivers');
    } catch (error: any) {
      console.error('Error saving driver:', error);
      setError(error.response?.data?.message || 'Failed to save driver. Please try again.');
      toast.error('Failed to save driver');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/drivers')} 
          sx={{ mr: 1 }}
          aria-label="back"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {isEditMode ? 'Edit Driver' : 'Add New Driver'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                error={Boolean(formErrors.firstName)}
                helperText={formErrors.firstName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                error={Boolean(formErrors.lastName)}
                helperText={formErrors.lastName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                error={Boolean(formErrors.phone)}
                helperText={formErrors.phone}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={(date) => handleDateChange('dateOfBirth', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: Boolean(formErrors.dateOfBirth),
                      helperText: formErrors.dateOfBirth
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Hire"
                  value={formData.dateOfHire}
                  onChange={(date) => handleDateChange('dateOfHire', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: Boolean(formErrors.dateOfHire),
                      helperText: formErrors.dateOfHire
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            {/* License Information */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" sx={{ mb: 1, mt: 2 }}>
                License Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="License Number"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                required
                error={Boolean(formErrors.licenseNumber)}
                helperText={formErrors.licenseNumber}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="License Expiry Date"
                  value={formData.licenseExpiry}
                  onChange={(date) => handleDateChange('licenseExpiry', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: Boolean(formErrors.licenseExpiry),
                      helperText: formErrors.licenseExpiry
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            {/* Emergency Contact */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" sx={{ mb: 1, mt: 2 }}>
                Emergency Contact
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Name"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Phone"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleInputChange}
              />
            </Grid>
            
            {/* Additional Information */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" sx={{ mb: 1, mt: 2 }}>
                Additional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="on_leave">On Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Assigned Vehicle</InputLabel>
                <Select
                  name="vehicle"
                  value={formData.vehicle}
                  onChange={handleSelectChange}
                  label="Assigned Vehicle"
                >
                  <MenuItem value="">None</MenuItem>
                  {vehicles.map((vehicle) => (
                    <MenuItem key={vehicle._id} value={vehicle._id}>
                      {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Optional</FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </Grid>
            
            {/* Form Actions */}
            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => navigate('/drivers')}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Saving...
                  </>
                ) : (
                  isEditMode ? 'Update Driver' : 'Add Driver'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default DriverForm;
