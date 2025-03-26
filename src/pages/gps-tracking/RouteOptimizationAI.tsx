import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Divider,
  LinearProgress,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import RouteIcon from '@mui/icons-material/Route';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedIcon from '@mui/icons-material/Speed';
import FuelIcon from '@mui/icons-material/LocalGasStation';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface OptimizationParams {
  vehicleCount: number;
  priorityType: 'time' | 'distance' | 'fuel' | 'balanced';
  includeTraffic: boolean;
  avoidTolls: boolean;
  maxStopsPerVehicle: number;
  timeWindows: boolean;
}

interface OptimizationResult {
  id: string;
  status: 'running' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  params: OptimizationParams;
  metrics?: {
    totalDistance: number;
    totalTime: number;
    fuelConsumption: number;
    co2Reduction: number;
    costSavings: number;
  };
}

const RouteOptimizationAI: React.FC = () => {
  const [optimizationParams, setOptimizationParams] = useState<OptimizationParams>({
    vehicleCount: 5,
    priorityType: 'balanced',
    includeTraffic: true,
    avoidTolls: false,
    maxStopsPerVehicle: 15,
    timeWindows: true
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);

  const handleParamChange = (param: keyof OptimizationParams, value: any) => {
    setOptimizationParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    
    // Simulate API call for optimization
    setTimeout(() => {
      const result: OptimizationResult = {
        id: `opt-${Date.now()}`,
        status: 'completed',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        params: optimizationParams,
        metrics: {
          totalDistance: 287.5,
          totalTime: 345,
          fuelConsumption: 42.3,
          co2Reduction: 18.7,
          costSavings: 523.45
        }
      };
      
      setOptimizationResult(result);
      setIsOptimizing(false);
      setOptimizationComplete(true);
    }, 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        AI-Powered Route Optimization
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Alert severity="info">
          Optimize delivery routes using advanced AI algorithms to minimize time, distance, and fuel consumption.
        </Alert>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Optimization Parameters
            </Typography>
            
            <Box component="form" sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Number of Vehicles"
                    type="number"
                    value={optimizationParams.vehicleCount}
                    onChange={(e) => handleParamChange('vehicleCount', parseInt(e.target.value))}
                    InputProps={{ inputProps: { min: 1, max: 50 } }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Optimization Priority</InputLabel>
                    <Select
                      value={optimizationParams.priorityType}
                      label="Optimization Priority"
                      onChange={(e: SelectChangeEvent) => handleParamChange('priorityType', e.target.value)}
                    >
                      <MenuItem value="time">Minimize Time</MenuItem>
                      <MenuItem value="distance">Minimize Distance</MenuItem>
                      <MenuItem value="fuel">Minimize Fuel Consumption</MenuItem>
                      <MenuItem value="balanced">Balanced Approach</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Max Stops Per Vehicle"
                    type="number"
                    value={optimizationParams.maxStopsPerVehicle}
                    onChange={(e) => handleParamChange('maxStopsPerVehicle', parseInt(e.target.value))}
                    InputProps={{ inputProps: { min: 1, max: 100 } }}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Include Traffic</InputLabel>
                    <Select
                      value={optimizationParams.includeTraffic ? 'yes' : 'no'}
                      label="Include Traffic"
                      onChange={(e) => handleParamChange('includeTraffic', e.target.value === 'yes')}
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Avoid Tolls</InputLabel>
                    <Select
                      value={optimizationParams.avoidTolls ? 'yes' : 'no'}
                      label="Avoid Tolls"
                      onChange={(e) => handleParamChange('avoidTolls', e.target.value === 'yes')}
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Consider Time Windows</InputLabel>
                    <Select
                      value={optimizationParams.timeWindows ? 'yes' : 'no'}
                      label="Consider Time Windows"
                      onChange={(e) => handleParamChange('timeWindows', e.target.value === 'yes')}
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<PlayArrowIcon />}
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                  >
                    {isOptimizing ? 'Optimizing...' : 'Start Optimization'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
            
            {isOptimizing && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" gutterBottom>Analyzing routes and calculating optimal paths...</Typography>
                <LinearProgress />
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            {!optimizationComplete ? (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                <MapIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" align="center">
                  Route optimization results will appear here
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  Configure parameters and start optimization to see the results
                </Typography>
              </Box>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  <RouteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Optimization Results
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Card>
                        <CardContent>
                          <Typography color="text.secondary" gutterBottom>
                            <AccessTimeIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
                            Total Time Saved
                          </Typography>
                          <Typography variant="h5" component="div">
                            {optimizationResult?.metrics?.totalTime} min
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Card>
                        <CardContent>
                          <Typography color="text.secondary" gutterBottom>
                            <RouteIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
                            Total Distance
                          </Typography>
                          <Typography variant="h5" component="div">
                            {optimizationResult?.metrics?.totalDistance} km
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Card>
                        <CardContent>
                          <Typography color="text.secondary" gutterBottom>
                            <FuelIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
                            Fuel Consumption
                          </Typography>
                          <Typography variant="h5" component="div">
                            {optimizationResult?.metrics?.fuelConsumption} L
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Card>
                        <CardContent>
                          <Typography color="text.secondary" gutterBottom>
                            <SpeedIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
                            Cost Savings
                          </Typography>
                          <Typography variant="h5" component="div">
                            ${optimizationResult?.metrics?.costSavings}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    <LocalShippingIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
                    Vehicle Assignment
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    The AI has optimally assigned routes to {optimizationParams.vehicleCount} vehicles, with each vehicle handling up to {optimizationParams.maxStopsPerVehicle} stops.
                  </Typography>
                  
                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {Array.from({ length: optimizationParams.vehicleCount }).map((_, idx) => (
                      <Chip 
                        key={idx}
                        icon={<LocalShippingIcon />}
                        label={`Vehicle ${idx + 1}`}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RouteOptimizationAI;
