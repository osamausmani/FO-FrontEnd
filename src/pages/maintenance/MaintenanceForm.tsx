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
  Chip,
  SelectChangeEvent
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import apiService from '../../utils/api';
import { RouteParams } from '../../types/common';
import { MaintenanceRecord, Vehicle, Cost, ServiceProvider } from '../../types/maintenance';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import BuildIcon from '@mui/icons-material/Build';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessIcon from '@mui/icons-material/Business';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

interface LocationState {
  vehicleId?: string;
}

interface FormData {
  vehicle: string;
  type: 'routine' | 'repair' | 'inspection' | 'emergency' | 'recall';
  title: string;
  description: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  scheduledDate: Date | null;
  completedDate: Date | null;
  odometerReading: string;
  serviceProvider: ServiceProvider;
  cost: {
    parts: string;
    labor: string;
    tax: string;
    total: string;
  };
  notes: string[];
}

interface FormErrors {
  [key: string]: string;
}

const MaintenanceForm: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  
  const isEditMode = Boolean(id);
  const vehicleId = locationState?.vehicleId;
  
  const [loading, setLoading] = useState<boolean>(isEditMode);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    vehicle: vehicleId || '',
    type: 'routine',
    title: '',
    description: '',
    status: 'scheduled',
    priority: 'medium',
    scheduledDate: new Date(),
    completedDate: null,
    odometerReading: '',
    serviceProvider: {
      name: '',
      contact: '',
      address: ''
    },
    cost: {
      parts: '',
      labor: '',
      tax: '',
      total: ''
    },
    notes: []
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    fetchVehicles();
    if (isEditMode) {
      fetchMaintenanceData();
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

  const fetchMaintenanceData = async (): Promise<void> => {
    if (!id) return;
    
    try {
      const response = await apiService.getMaintenanceRecord(id as string);
      const record = response.data.data;
      
      setFormData({
        vehicle: record.vehicle._id || '',
        type: record.type || 'routine',
        title: record.title || '',
        description: record.description || '',
        status: record.status || 'scheduled',
        priority: record.priority || 'medium',
        scheduledDate: record.scheduledDate ? new Date(record.scheduledDate) : new Date(),
        completedDate: record.completedDate ? new Date(record.completedDate) : null,
        odometerReading: record.odometerReading ? String(record.odometerReading) : '',
        serviceProvider: {
          name: record.serviceProvider?.name || '',
          contact: record.serviceProvider?.contact || '',
          address: record.serviceProvider?.address || ''
        },
        cost: {
          parts: record.cost?.parts ? String(record.cost.parts) : '',
          labor: record.cost?.labor ? String(record.cost.labor) : '',
          tax: record.cost?.tax ? String(record.cost.tax) : '',
          total: record.cost?.total ? String(record.cost.total) : ''
        },
        notes: record.notes || []
      });
    } catch (error) {
      console.error('Error fetching maintenance data:', error);
      setError('Failed to fetch maintenance data. Please try again.');
      toast.error('Failed to fetch maintenance data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent): void => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      if (parent === 'serviceProvider') {
        setFormData({
          ...formData,
          serviceProvider: {
            ...formData.serviceProvider,
            [child]: value
          }
        });
      } else if (parent === 'cost') {
        setFormData({
          ...formData,
          cost: {
            ...formData.cost,
            [child]: value
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
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
        [name]: ''
      });
    }
  };

  const calculateTotal = (): void => {
    const parts = parseFloat(formData.cost.parts) || 0;
    const labor = parseFloat(formData.cost.labor) || 0;
    const tax = parseFloat(formData.cost.tax) || 0;
    const total = parts + labor + tax;
    
    setFormData({
      ...formData,
      cost: {
        ...formData.cost,
        total: total.toFixed(2)
      }
    });
  };

  useEffect(() => {
    calculateTotal();
  }, [formData.cost.parts, formData.cost.labor, formData.cost.tax]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.vehicle) errors.vehicle = 'Vehicle is required';
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.scheduledDate) errors.scheduledDate = 'Scheduled date is required';
    
    if (formData.status === 'completed' && !formData.completedDate) {
      errors.completedDate = 'Completed date is required for completed status';
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
      // Find the selected vehicle object from the vehicles array
      const selectedVehicle = vehicles.find(v => v._id === formData.vehicle);
      
      if (!selectedVehicle && formData.vehicle) {
        setFormErrors({
          ...formErrors,
          vehicle: 'Please select a valid vehicle'
        });
        setSubmitting(false);
        return;
      }
      
      const payload: Partial<MaintenanceRecord> = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        priority: formData.priority,
        scheduledDate: formData.scheduledDate?.toISOString(),
        completedDate: formData.completedDate?.toISOString(),
        odometerReading: formData.odometerReading ? Number(formData.odometerReading) : undefined,
        serviceProvider: {
          name: formData.serviceProvider.name,
          contact: formData.serviceProvider.contact,
          address: formData.serviceProvider.address
        },
        cost: {
          parts: formData.cost.parts ? Number(formData.cost.parts) : 0,
          labor: formData.cost.labor ? Number(formData.cost.labor) : 0,
          tax: formData.cost.tax ? Number(formData.cost.tax) : 0,
          total: formData.cost.total ? Number(formData.cost.total) : 0
        },
        notes: formData.notes,
        vehicle: selectedVehicle as Vehicle
      };
      
      if (isEditMode && id) {
        await apiService.updateMaintenanceRecord(id, payload);
        toast.success('Maintenance record updated successfully');
      } else {
        await apiService.createMaintenanceRecord(payload);
        toast.success('Maintenance record added successfully');
      }
      
      navigate('/maintenance');
    } catch (error: any) {
      console.error('Error saving maintenance record:', error);
      setError(error.response?.data?.message || 'Failed to save maintenance record. Please try again.');
      toast.error('Failed to save maintenance record');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string): 'info' | 'primary' | 'success' | 'default' | 'error' => {
    switch (status) {
      case 'scheduled':
        return 'info';
      case 'in_progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'default';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string): 'success' | 'info' | 'warning' | 'error' | 'default' => {
    switch (priority) {
      case 'low':
        return 'success';
      case 'medium':
        return 'info';
      case 'high':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
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
          onClick={() => {
            if (isEditMode && id) {
              navigate(`/maintenance/${id}`);
            } else if (vehicleId) {
              navigate(`/vehicles/${vehicleId}`);
            } else {
              navigate('/maintenance');
            }
          }} 
          sx={{ mr: 1 }}
          aria-label="back"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {isEditMode ? 'Edit Maintenance Record' : 'Add New Maintenance Record'}
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
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={Boolean(formErrors.vehicle)}>
                <InputLabel>Vehicle *</InputLabel>
                <Select
                  name="vehicle"
                  value={formData.vehicle}
                  onChange={handleInputChange}
                  label="Vehicle *"
                  required
                  startAdornment={
                    <InputAdornment position="start">
                      <DirectionsCarIcon />
                    </InputAdornment>
                  }
                >
                  {vehicles.map((vehicle) => (
                    <MenuItem key={vehicle._id} value={vehicle._id}>
                      {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.vehicle && <FormHelperText>{formErrors.vehicle}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type *</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="Type *"
                  required
                  startAdornment={
                    <InputAdornment position="start">
                      <BuildIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="routine">Routine</MenuItem>
                  <MenuItem value="repair">Repair</MenuItem>
                  <MenuItem value="inspection">Inspection</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
                  <MenuItem value="recall">Recall</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title *"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                error={Boolean(formErrors.title)}
                helperText={formErrors.title}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description *"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                multiline
                rows={3}
                error={Boolean(formErrors.description)}
                helperText={formErrors.description}
              />
            </Grid>
            
            {/* Status and Scheduling */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" sx={{ mb: 1, mt: 2 }}>
                Status and Scheduling
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status *</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Status *"
                  required
                >
                  <MenuItem value="scheduled">
                    <Chip label="Scheduled" color="info" size="small" sx={{ mr: 1 }} /> Scheduled
                  </MenuItem>
                  <MenuItem value="in_progress">
                    <Chip label="In Progress" color="primary" size="small" sx={{ mr: 1 }} /> In Progress
                  </MenuItem>
                  <MenuItem value="completed">
                    <Chip label="Completed" color="success" size="small" sx={{ mr: 1 }} /> Completed
                  </MenuItem>
                  <MenuItem value="cancelled">
                    <Chip label="Cancelled" color="default" size="small" sx={{ mr: 1 }} /> Cancelled
                  </MenuItem>
                  <MenuItem value="overdue">
                    <Chip label="Overdue" color="error" size="small" sx={{ mr: 1 }} /> Overdue
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority *</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  label="Priority *"
                  required
                  startAdornment={
                    <InputAdornment position="start">
                      <PriorityHighIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="low">
                    <Chip label="Low" color="success" size="small" sx={{ mr: 1 }} /> Low
                  </MenuItem>
                  <MenuItem value="medium">
                    <Chip label="Medium" color="info" size="small" sx={{ mr: 1 }} /> Medium
                  </MenuItem>
                  <MenuItem value="high">
                    <Chip label="High" color="warning" size="small" sx={{ mr: 1 }} /> High
                  </MenuItem>
                  <MenuItem value="critical">
                    <Chip label="Critical" color="error" size="small" sx={{ mr: 1 }} /> Critical
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Scheduled Date *"
                  value={formData.scheduledDate}
                  onChange={(date) => handleDateChange('scheduledDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: Boolean(formErrors.scheduledDate),
                      helperText: formErrors.scheduledDate,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EventIcon />
                          </InputAdornment>
                        ),
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Completed Date"
                  value={formData.completedDate}
                  onChange={(date) => handleDateChange('completedDate', date)}
                  disabled={formData.status !== 'completed'}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: Boolean(formErrors.completedDate),
                      helperText: formErrors.completedDate,
                      required: formData.status === 'completed'
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Odometer Reading"
                name="odometerReading"
                type="number"
                value={formData.odometerReading}
                onChange={handleInputChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">km</InputAdornment>,
                }}
              />
            </Grid>
            
            {/* Service Provider */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" sx={{ mb: 1, mt: 2 }}>
                Service Provider
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Provider Name"
                name="serviceProvider.name"
                value={formData.serviceProvider.name}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Provider Contact"
                name="serviceProvider.contact"
                value={formData.serviceProvider.contact}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Provider Address"
                name="serviceProvider.address"
                value={formData.serviceProvider.address}
                onChange={handleInputChange}
                multiline
                rows={2}
              />
            </Grid>
            
            {/* Cost Information */}
            <Grid item xs={12}>
              <Typography variant="h6" color="primary" sx={{ mb: 1, mt: 2 }}>
                Cost Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Parts Cost"
                name="cost.parts"
                type="number"
                value={formData.cost.parts}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Labor Cost"
                name="cost.labor"
                type="number"
                value={formData.cost.labor}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Tax"
                name="cost.tax"
                type="number"
                value={formData.cost.tax}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Total Cost"
                name="cost.total"
                type="number"
                value={formData.cost.total}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
                disabled
              />
            </Grid>
            
            {/* Form Actions */}
            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => {
                  if (isEditMode && id) {
                    navigate(`/maintenance/${id}`);
                  } else if (vehicleId) {
                    navigate(`/vehicles/${vehicleId}`);
                  } else {
                    navigate('/maintenance');
                  }
                }}
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
                  isEditMode ? 'Update Record' : 'Add Record'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default MaintenanceForm;
