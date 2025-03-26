import React from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Slider,
  Chip,
  FormGroup,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';

// Icons
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedIcon from '@mui/icons-material/Speed';
import BalanceIcon from '@mui/icons-material/Balance';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import BlockIcon from '@mui/icons-material/Block';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import NatureIcon from '@mui/icons-material/Nature';

// Types
import { RouteOptimizationRequest, OptimizationPreference } from '../../../types/routeOptimization';

interface ConstraintsPreferencesProps {
  formData: RouteOptimizationRequest;
  setFormData: React.Dispatch<React.SetStateAction<RouteOptimizationRequest>>;
  onTogglePreference: (type: OptimizationPreference['type']) => void;
  isPreferenceSelected: (type: OptimizationPreference['type']) => boolean;
}

const ConstraintsPreferences: React.FC<ConstraintsPreferencesProps> = ({
  formData,
  setFormData,
  onTogglePreference,
  isPreferenceSelected
}) => {
  // Update preference weight
  const handlePreferenceWeightChange = (type: OptimizationPreference['type'], weight: number) => {
    setFormData(prev => {
      const preferences = [...(prev.preferences || [])];
      const index = preferences.findIndex(p => p.type === type);
      
      if (index >= 0) {
        preferences[index] = { ...preferences[index], weight };
      }
      
      return {
        ...prev,
        preferences
      };
    });
  };

  // Get preference weight
  const getPreferenceWeight = (type: OptimizationPreference['type']) => {
    const preference = formData.preferences?.find(p => p.type === type);
    return preference?.weight || 1;
  };

  // Toggle avoid options
  const handleAvoidToggle = (option: 'avoidTolls' | 'avoidHighways') => {
    setFormData(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Route Optimization Preferences
      </Typography>
      
      <Grid container spacing={3}>
        {/* Optimization Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Optimization Goals" />
            <Divider />
            <CardContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                Select what factors are most important for your route optimization. Adjust the sliders to set their relative importance.
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isPreferenceSelected('minimize_fuel')}
                      onChange={() => onTogglePreference('minimize_fuel')}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalGasStationIcon color="primary" sx={{ mr: 1 }} />
                      <Typography>Minimize Fuel Consumption</Typography>
                    </Box>
                  }
                />
                
                {isPreferenceSelected('minimize_fuel') && (
                  <Box sx={{ px: 3, mt: 1 }}>
                    <Slider
                      value={getPreferenceWeight('minimize_fuel') * 100}
                      onChange={(_, value) => 
                        handlePreferenceWeightChange('minimize_fuel', (value as number) / 100)
                      }
                      valueLabelDisplay="auto"
                      step={10}
                      marks
                      min={10}
                      max={100}
                    />
                  </Box>
                )}
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isPreferenceSelected('minimize_time')}
                      onChange={() => onTogglePreference('minimize_time')}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                      <Typography>Minimize Travel Time</Typography>
                    </Box>
                  }
                />
                
                {isPreferenceSelected('minimize_time') && (
                  <Box sx={{ px: 3, mt: 1 }}>
                    <Slider
                      value={getPreferenceWeight('minimize_time') * 100}
                      onChange={(_, value) => 
                        handlePreferenceWeightChange('minimize_time', (value as number) / 100)
                      }
                      valueLabelDisplay="auto"
                      step={10}
                      marks
                      min={10}
                      max={100}
                    />
                  </Box>
                )}
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isPreferenceSelected('minimize_distance')}
                      onChange={() => onTogglePreference('minimize_distance')}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SpeedIcon color="primary" sx={{ mr: 1 }} />
                      <Typography>Minimize Distance</Typography>
                    </Box>
                  }
                />
                
                {isPreferenceSelected('minimize_distance') && (
                  <Box sx={{ px: 3, mt: 1 }}>
                    <Slider
                      value={getPreferenceWeight('minimize_distance') * 100}
                      onChange={(_, value) => 
                        handlePreferenceWeightChange('minimize_distance', (value as number) / 100)
                      }
                      valueLabelDisplay="auto"
                      step={10}
                      marks
                      min={10}
                      max={100}
                    />
                  </Box>
                )}
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isPreferenceSelected('balance')}
                      onChange={() => onTogglePreference('balance')}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BalanceIcon color="primary" sx={{ mr: 1 }} />
                      <Typography>Balanced (Time/Distance/Fuel)</Typography>
                    </Box>
                  }
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Route Constraints */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Route Constraints" />
            <Divider />
            <CardContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                Select additional constraints for your route optimization.
              </Typography>
              
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.avoidTolls}
                      onChange={() => handleAvoidToggle('avoidTolls')}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MoneyOffIcon color="primary" sx={{ mr: 1 }} />
                      <Typography>Avoid Toll Roads</Typography>
                    </Box>
                  }
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.avoidHighways}
                      onChange={() => handleAvoidToggle('avoidHighways')}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BlockIcon color="primary" sx={{ mr: 1 }} />
                      <Typography>Avoid Highways</Typography>
                    </Box>
                  }
                />
              </FormGroup>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Environmental Impact
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <NatureIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Your choices will help us calculate potential environmental impact savings. Avoiding highways and prioritizing fuel minimization typically leads to lower emissions.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConstraintsPreferences;
