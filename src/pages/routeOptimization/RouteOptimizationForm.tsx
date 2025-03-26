import React, { useState, useEffect, ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Checkbox,
  FormControlLabel,
  ListItem,
  ListItemText,
  ListItemIcon,
  List,
  Chip,
} from '@mui/material';

// Map components
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SaveIcon from '@mui/icons-material/Save';
import DirectionsIcon from '@mui/icons-material/Directions';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import PersonIcon from '@mui/icons-material/Person';
import GradeIcon from '@mui/icons-material/Grade';
import EventIcon from '@mui/icons-material/Event';
import FlagIcon from '@mui/icons-material/Flag';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';

// API
import apiService from '../../utils/api';

// Types
import {
  RouteOptimizationRequest,
  RouteOptimizationResponse,
  OptimizationPreference,
  OptimizationConstraint,
  VehicleLocation
} from '../../types/routeOptimization';
import type { Vehicle } from '../../types/vehicles';
import type { Driver } from '../../types/drivers';

// Datepicker
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Component imports
import StopsConfiguration from './components/StopsConfiguration';
import ConstraintsPreferences from './components/ConstraintsPreferences';
import OptimizationReview from './components/OptimizationReview';

const steps = ['Vehicle & Driver Selection', 'Stops & Waypoints', 'Constraints & Preferences', 'Review & Optimize'];

const RouteOptimizationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // State
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  
  // Form data
  const [formData, setFormData] = useState<RouteOptimizationRequest>({
    vehicles: [{
      id: '',
      startLocation: { latitude: 0, longitude: 0 },
      endLocation: { latitude: 0, longitude: 0 },
      capacity: 100
    }],
    drivers: [],
    stops: [],
    constraints: [],
    preferences: [],
    avoidTolls: false,
    avoidHighways: false,
    departureTime: new Date().toISOString()
  });
  
  // Result data
  const [optimizationResult, setOptimizationResult] = useState<RouteOptimizationResponse | null>(null);
  
  // Load existing data if in edit mode
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch vehicles
        const vehiclesResponse = await apiService.getVehicles();
        setVehicles(vehiclesResponse.data.data);
        
        // Fetch drivers
        const driversResponse = await apiService.getDrivers();
        setDrivers(driversResponse.data.data);
        
        // If edit mode, fetch existing optimization
        if (isEditMode && id) {
          setLoading(true);
          const optimizationResponse = await apiService.getRouteOptimization(id);
          // Map the response data to the form structure
          // This is a simplified example and might need adjustment based on actual API response
          setFormData({
            vehicles: [{
              id: optimizationResponse.data.data.vehicleId,
              startLocation: optimizationResponse.data.data.startLocation,
              endLocation: optimizationResponse.data.data.endLocation
            }],
            drivers: optimizationResponse.data.data.driverId ? [{
              id: optimizationResponse.data.data.driverId
            }] : [],
            stops: optimizationResponse.data.data.waypoints.map(wp => ({
              id: wp.name || 'Stop',
              location: wp.location,
              serviceTime: wp.serviceTime,
              timeWindow: wp.timeWindow
            })),
            departureTime: optimizationResponse.data.data.startTime
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading form data:', err);
        setError('Failed to load required data. Please try again.');
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, isEditMode]);
  
  // Handle step navigation
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Handle vehicle selection
  const handleVehicleChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
    const selectedVehicleId = event.target.value as string;
    const selectedVehicle = vehicles.find(v => v._id === selectedVehicleId);
    
    if (selectedVehicle) {
      setFormData(prev => ({
        ...prev,
        vehicles: [{
          ...prev.vehicles[0],
          id: selectedVehicleId,
          // If the vehicle has a location, use it as the start location
          ...(selectedVehicle.location && {
            startLocation: {
              latitude: selectedVehicle.location.coordinates[1],
              longitude: selectedVehicle.location.coordinates[0],
              address: selectedVehicle.location.type || 'Current Location'
            }
          })
        }]
      }));
    }
  };
  
  // Handle driver selection
  const handleDriverChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
    const selectedDriverId = event.target.value as string;
    
    if (selectedDriverId) {
      setFormData(prev => ({
        ...prev,
        drivers: [{
          id: selectedDriverId,
          maxWorkTime: 480, // Default to 8 hours (480 minutes)
          restTime: 30 // Default rest time in minutes
        }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        drivers: []
      }));
    }
  };
  
  // Add a stop
  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [
        ...prev.stops,
        {
          id: `stop-${prev.stops.length + 1}`,
          location: { latitude: 0, longitude: 0 },
          serviceTime: 15 // Default service time in minutes
        }
      ]
    }));
  };
  
  // Remove a stop
  const removeStop = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index)
    }));
  };
  
  // Update stop location
  const updateStopLocation = (index: number, location: VehicleLocation) => {
    setFormData(prev => {
      const updatedStops = [...prev.stops];
      updatedStops[index] = {
        ...updatedStops[index],
        location
      };
      return {
        ...prev,
        stops: updatedStops
      };
    });
  };
  
  // Toggle optimization preferences
  const togglePreference = (type: OptimizationPreference['type']) => {
    setFormData(prev => {
      const existingIndex = prev.preferences?.findIndex(p => p.type === type);
      
      if (existingIndex !== undefined && existingIndex >= 0) {
        // Remove preference if it exists
        return {
          ...prev,
          preferences: prev.preferences?.filter((_, i) => i !== existingIndex)
        };
      } else {
        // Add preference if it doesn't exist
        return {
          ...prev,
          preferences: [
            ...(prev.preferences || []),
            { type, weight: 1 } // Default weight
          ]
        };
      }
    });
  };
  
  // Check if a preference is selected
  const isPreferenceSelected = (type: OptimizationPreference['type']) => {
    return formData.preferences?.some(p => p.type === type) || false;
  };
  
  // Submit form
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (isEditMode && id) {
        response = await apiService.updateRouteOptimization(id, formData);
      } else {
        response = await apiService.createRouteOptimization(formData);
      }
      
      setOptimizationResult(response.data.data);
      setSuccess('Route optimization successful!');
      setLoading(false);
      
      // Navigate to the next step to show results
      if (activeStep < steps.length - 1) {
        setActiveStep(steps.length - 1);
      }
    } catch (err) {
      console.error('Error submitting optimization request:', err);
      setError('Failed to process optimization request. Please check your inputs and try again.');
      setLoading(false);
    }
  };
  
  // Render step content
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <VehicleDriverSelection 
            vehicles={vehicles}
            drivers={drivers}
            formData={formData}
            onVehicleChange={handleVehicleChange}
            onDriverChange={handleDriverChange}
            onDepartureTimeChange={(date) => {
              setFormData(prev => ({
                ...prev,
                departureTime: date?.toISOString() || new Date().toISOString()
              }));
            }}
          />
        );
      case 1:
        return (
          <StopsConfiguration 
            stops={formData.stops}
            onAddStop={addStop}
            onRemoveStop={removeStop}
            onUpdateStop={updateStopLocation}
          />
        );
      case 2:
        return (
          <ConstraintsPreferences 
            formData={formData}
            setFormData={setFormData}
            onTogglePreference={togglePreference}
            isPreferenceSelected={isPreferenceSelected}
          />
        );
      case 3:
        return (
          <OptimizationReview 
            formData={formData}
            vehicles={vehicles}
            drivers={drivers}
            optimizationResult={optimizationResult}
          />
        );
      default:
        return 'Unknown step';
    }
  };
  
  if (loading && !activeStep) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/route-optimization')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {isEditMode ? 'Edit Route Optimization' : 'New Route Optimization'}
        </Typography>
      </Box>
      
      {/* Error and Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      
      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {/* Step Content */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        {getStepContent(activeStep)}
      </Paper>
      
      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        {activeStep > 0 && (
          <Button onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
        )}
        
        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={loading || Boolean(optimizationResult)}
          >
            {loading ? <CircularProgress size={24} /> : 'Optimize Route'}
          </Button>
        )}
      </Box>
    </Box>
  );
};

// Step 1: Vehicle & Driver Selection
interface VehicleDriverSelectionProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  formData: RouteOptimizationRequest;
  onVehicleChange: (event: SelectChangeEvent<string>, child: ReactNode) => void;
  onDriverChange: (event: SelectChangeEvent<string>, child: ReactNode) => void;
  onDepartureTimeChange: (date: Date | null) => void;
}

const VehicleDriverSelection: React.FC<VehicleDriverSelectionProps> = ({
  vehicles,
  drivers,
  formData,
  onVehicleChange,
  onDriverChange,
  onDepartureTimeChange
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Vehicle and Driver
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Vehicle</InputLabel>
            <Select
              value={formData.vehicles[0]?.id || ''}
              onChange={onVehicleChange}
              label="Vehicle"
            >
              {vehicles.map((vehicle) => (
                <MenuItem key={vehicle._id} value={vehicle._id}>
                  {vehicle.name} ({vehicle.licensePlate})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Driver (Optional)</InputLabel>
            <Select
              value={formData.drivers?.[0]?.id || ''}
              onChange={onDriverChange}
              label="Driver (Optional)"
            >
              <MenuItem value="">No Driver</MenuItem>
              {drivers.map((driver) => (
                <MenuItem key={driver._id} value={driver._id}>
                  {driver.firstName} {driver.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Departure Time"
              value={new Date(formData.departureTime || new Date())}
              onChange={onDepartureTimeChange}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RouteOptimizationForm;
