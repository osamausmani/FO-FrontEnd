import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Divider,
  Alert,
  TextField,
  LinearProgress,
  SelectChangeEvent
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SettingsIcon from '@mui/icons-material/Settings';
import WarningIcon from '@mui/icons-material/Warning';
import BuildIcon from '@mui/icons-material/Build';
import OilBarrelIcon from '@mui/icons-material/OilBarrel';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import SpeedIcon from '@mui/icons-material/Speed';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import HistoryIcon from '@mui/icons-material/History';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

interface DiagnosticData {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType: string;
  engineStatus: 'normal' | 'warning' | 'critical';
  oilLevel: number; // percentage
  oilPressure: number; // PSI
  coolantTemp: number; // degrees F
  batteryVoltage: number; // volts
  fuelLevel: number; // percentage
  engineLoad: number; // percentage
  mileage: number; // miles
  lastServiceMileage: number; // miles
  nextServiceDue: number; // miles
  diagnosticCodes: DiagnosticCode[];
  lastUpdated: string;
}

interface DiagnosticCode {
  code: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  status: 'active' | 'pending' | 'resolved';
}

const mockDiagnosticData: DiagnosticData[] = [
  {
    id: 'd1',
    vehicleId: 'v1',
    vehicleName: 'Truck 101',
    vehicleType: 'Heavy Duty Truck',
    engineStatus: 'normal',
    oilLevel: 85,
    oilPressure: 45,
    coolantTemp: 195,
    batteryVoltage: 12.8,
    fuelLevel: 65,
    engineLoad: 42,
    mileage: 45678,
    lastServiceMileage: 40000,
    nextServiceDue: 5000,
    diagnosticCodes: [],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'd2',
    vehicleId: 'v2',
    vehicleName: 'Van 202',
    vehicleType: 'Delivery Van',
    engineStatus: 'warning',
    oilLevel: 60,
    oilPressure: 38,
    coolantTemp: 210,
    batteryVoltage: 12.2,
    fuelLevel: 30,
    engineLoad: 65,
    mileage: 78945,
    lastServiceMileage: 75000,
    nextServiceDue: 0,
    diagnosticCodes: [
      {
        code: 'P0300',
        description: 'Random/Multiple Cylinder Misfire Detected',
        severity: 'medium',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'active'
      }
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'd3',
    vehicleId: 'v3',
    vehicleName: 'Truck 303',
    vehicleType: 'Heavy Duty Truck',
    engineStatus: 'critical',
    oilLevel: 25,
    oilPressure: 20,
    coolantTemp: 245,
    batteryVoltage: 11.5,
    fuelLevel: 45,
    engineLoad: 85,
    mileage: 102345,
    lastServiceMileage: 95000,
    nextServiceDue: 0,
    diagnosticCodes: [
      {
        code: 'P0115',
        description: 'Engine Coolant Temperature Circuit Malfunction',
        severity: 'high',
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        status: 'active'
      },
      {
        code: 'P0521',
        description: 'Engine Oil Pressure Sensor/Switch Range/Performance',
        severity: 'high',
        timestamp: new Date(Date.now() - 21600000).toISOString(),
        status: 'active'
      }
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'd4',
    vehicleId: 'v4',
    vehicleName: 'Van 404',
    vehicleType: 'Delivery Van',
    engineStatus: 'normal',
    oilLevel: 90,
    oilPressure: 48,
    coolantTemp: 190,
    batteryVoltage: 13.1,
    fuelLevel: 80,
    engineLoad: 35,
    mileage: 32456,
    lastServiceMileage: 30000,
    nextServiceDue: 8000,
    diagnosticCodes: [
      {
        code: 'P0456',
        description: 'Evaporative Emission System Leak Detected (very small leak)',
        severity: 'low',
        timestamp: new Date(Date.now() - 604800000).toISOString(),
        status: 'pending'
      }
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'd5',
    vehicleId: 'v5',
    vehicleName: 'Truck 505',
    vehicleType: 'Medium Duty Truck',
    engineStatus: 'warning',
    oilLevel: 70,
    oilPressure: 40,
    coolantTemp: 205,
    batteryVoltage: 12.4,
    fuelLevel: 25,
    engineLoad: 60,
    mileage: 65432,
    lastServiceMileage: 60000,
    nextServiceDue: 0,
    diagnosticCodes: [
      {
        code: 'P0420',
        description: 'Catalyst System Efficiency Below Threshold',
        severity: 'medium',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        status: 'active'
      }
    ],
    lastUpdated: new Date().toISOString()
  }
];

const EngineDiagnostics: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<DiagnosticData | null>(null);
  
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value as string);
  };
  
  const handleSelectVehicle = (vehicle: DiagnosticData) => {
    setSelectedVehicle(vehicle);
  };
  
  const handleRefresh = () => {
    // In a real application, this would fetch updated data
    console.log('Refreshing diagnostic data');
  };
  
  // Filter vehicles based on selected filters
  const filteredVehicles = mockDiagnosticData.filter(vehicle => {
    if (statusFilter !== 'all' && vehicle.engineStatus !== statusFilter) return false;
    return true;
  });
  
  // Calculate service status
  const getServiceStatus = (vehicle: DiagnosticData) => {
    if (vehicle.nextServiceDue <= 0) return 'overdue';
    if (vehicle.nextServiceDue < 1000) return 'due-soon';
    return 'ok';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Engine Diagnostics
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Alert severity="info">
          Monitor engine health and diagnostics in real-time to prevent breakdowns and optimize maintenance schedules.
        </Alert>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Vehicle Diagnostics
              </Typography>
              
              <Box>
                <FormControl size="small" sx={{ minWidth: 150, mr: 2 }}>
                  <InputLabel>Engine Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Engine Status"
                    onChange={handleStatusFilterChange}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="warning">Warning</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>
                </FormControl>
                
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  size="small"
                >
                  Refresh
                </Button>
              </Box>
            </Box>
            
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Vehicle</TableCell>
                    <TableCell>Engine Status</TableCell>
                    <TableCell>Oil</TableCell>
                    <TableCell>Coolant</TableCell>
                    <TableCell>Battery</TableCell>
                    <TableCell>Service</TableCell>
                    <TableCell>Codes</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow 
                      key={vehicle.id}
                      onClick={() => handleSelectVehicle(vehicle)}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                        bgcolor: selectedVehicle?.id === vehicle.id ? 'action.selected' : 'inherit'
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <LocalShippingIcon fontSize="small" sx={{ mr: 1 }} />
                          <Box>
                            <Typography variant="body2">{vehicle.vehicleName}</Typography>
                            <Typography variant="caption" color="text.secondary">{vehicle.vehicleType}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={vehicle.engineStatus}
                          color={
                            vehicle.engineStatus === 'normal' ? 'success' :
                            vehicle.engineStatus === 'warning' ? 'warning' : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" display="flex" alignItems="center">
                            <OilBarrelIcon 
                              fontSize="small" 
                              sx={{ 
                                mr: 0.5,
                                color: vehicle.oilLevel < 30 ? 'error.main' : 
                                       vehicle.oilLevel < 60 ? 'warning.main' : 'success.main'
                              }} 
                            />
                            {vehicle.oilLevel}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {vehicle.oilPressure} PSI
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2"
                          color={
                            vehicle.coolantTemp > 230 ? 'error.main' :
                            vehicle.coolantTemp > 210 ? 'warning.main' : 'text.primary'
                          }
                        >
                          {vehicle.coolantTemp}°F
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <BatteryChargingFullIcon 
                            fontSize="small" 
                            sx={{ 
                              mr: 0.5,
                              color: vehicle.batteryVoltage < 12.0 ? 'error.main' : 
                                    vehicle.batteryVoltage < 12.5 ? 'warning.main' : 'success.main'
                            }} 
                          />
                          {vehicle.batteryVoltage}V
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Chip
                            label={getServiceStatus(vehicle) === 'ok' ? 'OK' : 
                                  getServiceStatus(vehicle) === 'due-soon' ? 'Due Soon' : 'Overdue'}
                            color={
                              getServiceStatus(vehicle) === 'ok' ? 'success' :
                              getServiceStatus(vehicle) === 'due-soon' ? 'warning' : 'error'
                            }
                            size="small"
                          />
                          <Typography variant="caption" display="block" color="text.secondary">
                            {vehicle.nextServiceDue <= 0 ? 
                              'Overdue' : 
                              `Due in ${vehicle.nextServiceDue} mi`}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {vehicle.diagnosticCodes.length > 0 ? (
                          <Chip
                            label={`${vehicle.diagnosticCodes.length} codes`}
                            color={
                              vehicle.diagnosticCodes.some(code => code.severity === 'high') ? 'error' :
                              vehicle.diagnosticCodes.some(code => code.severity === 'medium') ? 'warning' : 'default'
                            }
                            size="small"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">None</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary" 
                          aria-label="view details"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectVehicle(vehicle);
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      Total Vehicles
                    </Typography>
                    <Typography variant="h5">
                      {mockDiagnosticData.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      Critical Issues
                    </Typography>
                    <Typography variant="h5" color="error.main">
                      {mockDiagnosticData.filter(v => v.engineStatus === 'critical').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      Warnings
                    </Typography>
                    <Typography variant="h5" color="warning.main">
                      {mockDiagnosticData.filter(v => v.engineStatus === 'warning').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      Service Due
                    </Typography>
                    <Typography variant="h5" color="info.main">
                      {mockDiagnosticData.filter(v => v.nextServiceDue <= 1000).length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {selectedVehicle ? (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Detailed Diagnostics
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">{selectedVehicle.vehicleName}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {selectedVehicle.vehicleType}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>Engine Status</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={selectedVehicle.engineStatus}
                    color={
                      selectedVehicle.engineStatus === 'normal' ? 'success' :
                      selectedVehicle.engineStatus === 'warning' ? 'warning' : 'error'
                    }
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    Last updated: {new Date(selectedVehicle.lastUpdated).toLocaleString()}
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>Oil Level</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="body2">{selectedVehicle.oilLevel}%</Typography>
                        <OilBarrelIcon 
                          fontSize="small" 
                          sx={{ 
                            color: selectedVehicle.oilLevel < 30 ? 'error.main' : 
                                  selectedVehicle.oilLevel < 60 ? 'warning.main' : 'success.main'
                          }} 
                        />
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={selectedVehicle.oilLevel} 
                        color={
                          selectedVehicle.oilLevel < 30 ? 'error' : 
                          selectedVehicle.oilLevel < 60 ? 'warning' : 'success'
                        }
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      Oil Pressure: {selectedVehicle.oilPressure} PSI
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>Fuel Level</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="body2">{selectedVehicle.fuelLevel}%</Typography>
                        <LocalGasStationIcon 
                          fontSize="small" 
                          sx={{ 
                            color: selectedVehicle.fuelLevel < 20 ? 'error.main' : 
                                  selectedVehicle.fuelLevel < 40 ? 'warning.main' : 'success.main'
                          }} 
                        />
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={selectedVehicle.fuelLevel} 
                        color={
                          selectedVehicle.fuelLevel < 20 ? 'error' : 
                          selectedVehicle.fuelLevel < 40 ? 'warning' : 'success'
                        }
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" gutterBottom>Coolant Temperature</Typography>
                      <Typography 
                        variant="body1"
                        color={
                          selectedVehicle.coolantTemp > 230 ? 'error.main' :
                          selectedVehicle.coolantTemp > 210 ? 'warning.main' : 'text.primary'
                        }
                      >
                        {selectedVehicle.coolantTemp}°F
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" gutterBottom>Battery Voltage</Typography>
                      <Box display="flex" alignItems="center">
                        <BatteryChargingFullIcon 
                          fontSize="small" 
                          sx={{ 
                            mr: 0.5,
                            color: selectedVehicle.batteryVoltage < 12.0 ? 'error.main' : 
                                  selectedVehicle.batteryVoltage < 12.5 ? 'warning.main' : 'success.main'
                          }} 
                        />
                        <Typography variant="body1">
                          {selectedVehicle.batteryVoltage}V
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" gutterBottom>Engine Load</Typography>
                      <Box sx={{ mb: 1 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography variant="body2">{selectedVehicle.engineLoad}%</Typography>
                          <SpeedIcon 
                            fontSize="small" 
                            sx={{ 
                              color: selectedVehicle.engineLoad > 80 ? 'error.main' : 
                                    selectedVehicle.engineLoad > 60 ? 'warning.main' : 'success.main'
                            }} 
                          />
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedVehicle.engineLoad} 
                          color={
                            selectedVehicle.engineLoad > 80 ? 'error' : 
                            selectedVehicle.engineLoad > 60 ? 'warning' : 'success'
                          }
                          sx={{ height: 8, borderRadius: 1 }}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" gutterBottom>Mileage</Typography>
                      <Typography variant="body1">
                        {selectedVehicle.mileage.toLocaleString()} mi
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>Maintenance Status</Typography>
                <Box sx={{ mb: 2 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2">
                      {getServiceStatus(selectedVehicle) === 'ok' ? 
                        `Next service in ${selectedVehicle.nextServiceDue} miles` : 
                        getServiceStatus(selectedVehicle) === 'due-soon' ? 
                        `Service due soon (${selectedVehicle.nextServiceDue} miles)` : 
                        'Service overdue'}
                    </Typography>
                    <Chip
                      label={getServiceStatus(selectedVehicle) === 'ok' ? 'OK' : 
                            getServiceStatus(selectedVehicle) === 'due-soon' ? 'Due Soon' : 'Overdue'}
                      color={
                        getServiceStatus(selectedVehicle) === 'ok' ? 'success' :
                        getServiceStatus(selectedVehicle) === 'due-soon' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Last service: {selectedVehicle.lastServiceMileage.toLocaleString()} miles
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>Diagnostic Trouble Codes</Typography>
                {selectedVehicle.diagnosticCodes.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No active diagnostic codes
                  </Typography>
                ) : (
                  <Box>
                    {selectedVehicle.diagnosticCodes.map((code, index) => (
                      <Card key={index} variant="outlined" sx={{ mb: 1, bgcolor: 'background.default' }}>
                        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" fontWeight="bold">
                              {code.code}
                            </Typography>
                            <Chip
                              label={code.severity}
                              color={
                                code.severity === 'high' ? 'error' :
                                code.severity === 'medium' ? 'warning' : 'info'
                              }
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2">{code.description}</Typography>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                            <Typography variant="caption" color="text.secondary">
                              <AccessTimeIcon fontSize="inherit" sx={{ verticalAlign: 'text-bottom', mr: 0.5 }} />
                              {new Date(code.timestamp).toLocaleString()}
                            </Typography>
                            <Chip
                              label={code.status}
                              variant="outlined"
                              size="small"
                              color={
                                code.status === 'active' ? 'error' :
                                code.status === 'pending' ? 'warning' : 'success'
                              }
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    startIcon={<HistoryIcon />}
                    size="small"
                  >
                    History
                  </Button>
                  
                  <Button
                    variant="contained"
                    startIcon={<BuildIcon />}
                    size="small"
                  >
                    Schedule Service
                  </Button>
                </Box>
              </Box>
            </Paper>
          ) : (
            <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <SettingsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" align="center">
                Select a vehicle
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Click on any row to view detailed diagnostics
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default EngineDiagnostics;
