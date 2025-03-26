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
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WaterIcon from '@mui/icons-material/Water';
import ShieldIcon from '@mui/icons-material/Shield';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface CargoStatus {
  id: string;
  vehicleId: string;
  vehicleName: string;
  cargoType: string;
  cargoDescription: string;
  temperature: number;
  humidity: number;
  securityStatus: 'secured' | 'alert' | 'breach';
  loadStatus: 'loading' | 'in-transit' | 'unloading' | 'delivered';
  loadWeight: number;
  loadCapacity: number;
  lastUpdated: string;
  location: string;
  estimatedDelivery: string;
  temperatureRange: {
    min: number;
    max: number;
  };
  humidityRange: {
    min: number;
    max: number;
  };
}

const mockCargoStatus: CargoStatus[] = [
  {
    id: 'c1',
    vehicleId: 'v1',
    vehicleName: 'Refrigerated Truck 101',
    cargoType: 'Perishable',
    cargoDescription: 'Dairy products and fresh produce',
    temperature: 38,
    humidity: 85,
    securityStatus: 'secured',
    loadStatus: 'in-transit',
    loadWeight: 12500,
    loadCapacity: 15000,
    lastUpdated: new Date().toISOString(),
    location: 'Highway 101, San Francisco',
    estimatedDelivery: '2025-03-19T16:30:00',
    temperatureRange: {
      min: 35,
      max: 40
    },
    humidityRange: {
      min: 80,
      max: 90
    }
  },
  {
    id: 'c2',
    vehicleId: 'v2',
    vehicleName: 'Box Truck 202',
    cargoType: 'General',
    cargoDescription: 'Electronics and household goods',
    temperature: 72,
    humidity: 45,
    securityStatus: 'secured',
    loadStatus: 'in-transit',
    loadWeight: 8500,
    loadCapacity: 10000,
    lastUpdated: new Date().toISOString(),
    location: 'Interstate 280, Palo Alto',
    estimatedDelivery: '2025-03-19T15:45:00',
    temperatureRange: {
      min: 65,
      max: 80
    },
    humidityRange: {
      min: 30,
      max: 60
    }
  },
  {
    id: 'c3',
    vehicleId: 'v3',
    vehicleName: 'Freezer Truck 303',
    cargoType: 'Frozen',
    cargoDescription: 'Frozen seafood and ice cream',
    temperature: 5,
    humidity: 75,
    securityStatus: 'alert',
    loadStatus: 'in-transit',
    loadWeight: 9800,
    loadCapacity: 12000,
    lastUpdated: new Date().toISOString(),
    location: 'Route 85, Mountain View',
    estimatedDelivery: '2025-03-19T17:15:00',
    temperatureRange: {
      min: 0,
      max: 10
    },
    humidityRange: {
      min: 70,
      max: 80
    }
  },
  {
    id: 'c4',
    vehicleId: 'v4',
    vehicleName: 'Tanker 404',
    cargoType: 'Liquid',
    cargoDescription: 'Milk and liquid dairy',
    temperature: 42,
    humidity: 60,
    securityStatus: 'secured',
    loadStatus: 'loading',
    loadWeight: 15000,
    loadCapacity: 20000,
    lastUpdated: new Date().toISOString(),
    location: 'Dairy Farm, Petaluma',
    estimatedDelivery: '2025-03-20T09:30:00',
    temperatureRange: {
      min: 38,
      max: 45
    },
    humidityRange: {
      min: 55,
      max: 65
    }
  },
  {
    id: 'c5',
    vehicleId: 'v5',
    vehicleName: 'Flatbed 505',
    cargoType: 'Construction',
    cargoDescription: 'Building materials and equipment',
    temperature: 75,
    humidity: 40,
    securityStatus: 'breach',
    loadStatus: 'unloading',
    loadWeight: 18000,
    loadCapacity: 22000,
    lastUpdated: new Date().toISOString(),
    location: 'Construction Site, Oakland',
    estimatedDelivery: '2025-03-19T14:00:00',
    temperatureRange: {
      min: 0,
      max: 100
    },
    humidityRange: {
      min: 0,
      max: 100
    }
  }
];

const CargoMonitoring: React.FC = () => {
  const [cargoFilter, setCargoFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCargo, setSelectedCargo] = useState<CargoStatus | null>(null);
  
  const handleCargoFilterChange = (event: SelectChangeEvent) => {
    setCargoFilter(event.target.value as string);
  };
  
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value as string);
  };
  
  const handleSelectCargo = (cargo: CargoStatus) => {
    setSelectedCargo(cargo);
  };
  
  const handleRefresh = () => {
    // In a real application, this would fetch updated data
    console.log('Refreshing cargo data');
  };
  
  const handleResolveAlert = () => {
    // In a real application, this would update the security status
    console.log('Resolving security alert');
  };
  
  // Filter cargo based on selected filters
  const filteredCargo = mockCargoStatus.filter(cargo => {
    if (cargoFilter !== 'all' && cargo.cargoType !== cargoFilter) return false;
    if (statusFilter !== 'all' && cargo.loadStatus !== statusFilter) return false;
    return true;
  });
  
  // Calculate temperature status
  const getTemperatureStatus = (cargo: CargoStatus) => {
    if (cargo.temperature < cargo.temperatureRange.min) return 'below';
    if (cargo.temperature > cargo.temperatureRange.max) return 'above';
    return 'normal';
  };
  
  // Calculate humidity status
  const getHumidityStatus = (cargo: CargoStatus) => {
    if (cargo.humidity < cargo.humidityRange.min) return 'below';
    if (cargo.humidity > cargo.humidityRange.max) return 'above';
    return 'normal';
  };
  
  // Calculate load percentage
  const getLoadPercentage = (cargo: CargoStatus) => {
    return (cargo.loadWeight / cargo.loadCapacity) * 100;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cargo Monitoring
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Alert severity="info">
          Monitor cargo conditions in real-time to ensure proper handling and delivery of goods.
        </Alert>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Active Cargo Shipments
              </Typography>
              
              <Box>
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  size="small"
                >
                  Refresh
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Cargo Type</InputLabel>
                    <Select
                      value={cargoFilter}
                      label="Cargo Type"
                      onChange={handleCargoFilterChange}
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      <MenuItem value="Perishable">Perishable</MenuItem>
                      <MenuItem value="Frozen">Frozen</MenuItem>
                      <MenuItem value="General">General</MenuItem>
                      <MenuItem value="Liquid">Liquid</MenuItem>
                      <MenuItem value="Construction">Construction</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Load Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Load Status"
                      onChange={handleStatusFilterChange}
                    >
                      <MenuItem value="all">All Statuses</MenuItem>
                      <MenuItem value="loading">Loading</MenuItem>
                      <MenuItem value="in-transit">In Transit</MenuItem>
                      <MenuItem value="unloading">Unloading</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Vehicle</TableCell>
                    <TableCell>Cargo</TableCell>
                    <TableCell>Temperature</TableCell>
                    <TableCell>Humidity</TableCell>
                    <TableCell>Security</TableCell>
                    <TableCell>Load Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCargo.map((cargo) => (
                    <TableRow 
                      key={cargo.id}
                      onClick={() => handleSelectCargo(cargo)}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' },
                        bgcolor: selectedCargo?.id === cargo.id ? 'action.selected' : 'inherit'
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <LocalShippingIcon fontSize="small" sx={{ mr: 1 }} />
                          {cargo.vehicleName}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {cargo.cargoType}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {cargo.cargoDescription}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <ThermostatIcon 
                            fontSize="small" 
                            sx={{ 
                              mr: 1,
                              color: getTemperatureStatus(cargo) === 'normal' ? 'success.main' :
                                    getTemperatureStatus(cargo) === 'below' ? 'info.main' : 'error.main'
                            }} 
                          />
                          <Typography 
                            variant="body2"
                            color={getTemperatureStatus(cargo) === 'normal' ? 'text.primary' :
                                  getTemperatureStatus(cargo) === 'below' ? 'info.main' : 'error.main'}
                          >
                            {cargo.temperature}°F
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <WaterIcon 
                            fontSize="small" 
                            sx={{ 
                              mr: 1,
                              color: getHumidityStatus(cargo) === 'normal' ? 'success.main' :
                                    getHumidityStatus(cargo) === 'below' ? 'warning.main' : 'error.main'
                            }} 
                          />
                          <Typography 
                            variant="body2"
                            color={getHumidityStatus(cargo) === 'normal' ? 'text.primary' :
                                  getHumidityStatus(cargo) === 'below' ? 'warning.main' : 'error.main'}
                          >
                            {cargo.humidity}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<ShieldIcon />}
                          label={cargo.securityStatus}
                          color={
                            cargo.securityStatus === 'secured' ? 'success' :
                            cargo.securityStatus === 'alert' ? 'warning' : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={cargo.loadStatus.replace('-', ' ')}
                          color={
                            cargo.loadStatus === 'in-transit' ? 'primary' :
                            cargo.loadStatus === 'loading' ? 'secondary' :
                            cargo.loadStatus === 'unloading' ? 'warning' : 'success'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary" 
                          aria-label="view details"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCargo(cargo);
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        {cargo.securityStatus !== 'secured' && (
                          <IconButton 
                            color="warning" 
                            aria-label="security alert"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResolveAlert();
                            }}
                          >
                            <NotificationsIcon fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {selectedCargo ? (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Cargo Details
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1">{selectedCargo.vehicleName}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {selectedCargo.cargoType} - {selectedCargo.cargoDescription}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      <LocationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      Location
                    </Typography>
                    <Typography variant="body1">{selectedCargo.location}</Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      Est. Delivery
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedCargo.estimatedDelivery).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>Temperature</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ThermostatIcon 
                    fontSize="small" 
                    sx={{ 
                      mr: 1,
                      color: getTemperatureStatus(selectedCargo) === 'normal' ? 'success.main' :
                            getTemperatureStatus(selectedCargo) === 'below' ? 'info.main' : 'error.main'
                    }} 
                  />
                  <Typography variant="h6" component="span">
                    {selectedCargo.temperature}°F
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    Range: {selectedCargo.temperatureRange.min}°F - {selectedCargo.temperatureRange.max}°F
                  </Typography>
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>Humidity</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WaterIcon 
                    fontSize="small" 
                    sx={{ 
                      mr: 1,
                      color: getHumidityStatus(selectedCargo) === 'normal' ? 'success.main' :
                            getHumidityStatus(selectedCargo) === 'below' ? 'warning.main' : 'error.main'
                    }} 
                  />
                  <Typography variant="h6" component="span">
                    {selectedCargo.humidity}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    Range: {selectedCargo.humidityRange.min}% - {selectedCargo.humidityRange.max}%
                  </Typography>
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>Load Status</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    {selectedCargo.loadWeight.toLocaleString()} lbs / {selectedCargo.loadCapacity.toLocaleString()} lbs
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={getLoadPercentage(selectedCargo)} 
                    color={getLoadPercentage(selectedCargo) > 90 ? 'error' : 'primary'}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {getLoadPercentage(selectedCargo).toFixed(1)}% of capacity
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>Security Status</Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    icon={<ShieldIcon />}
                    label={selectedCargo.securityStatus}
                    color={
                      selectedCargo.securityStatus === 'secured' ? 'success' :
                      selectedCargo.securityStatus === 'alert' ? 'warning' : 'error'
                    }
                  />
                  
                  {selectedCargo.securityStatus !== 'secured' && (
                    <Button
                      variant="outlined"
                      color="warning"
                      size="small"
                      onClick={handleResolveAlert}
                      sx={{ ml: 1 }}
                    >
                      Resolve Alert
                    </Button>
                  )}
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>Last Updated</Typography>
                <Typography variant="body2">
                  {new Date(selectedCargo.lastUpdated).toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          ) : (
            <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <InventoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" align="center">
                Select a cargo shipment
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Click on any row to view detailed information
              </Typography>
            </Paper>
          )}
          
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      Active Shipments
                    </Typography>
                    <Typography variant="h5">
                      {mockCargoStatus.filter(c => c.loadStatus === 'in-transit').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      Security Alerts
                    </Typography>
                    <Typography variant="h5" color="error.main">
                      {mockCargoStatus.filter(c => c.securityStatus !== 'secured').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      Temperature Alerts
                    </Typography>
                    <Typography variant="h5" color="warning.main">
                      {mockCargoStatus.filter(c => 
                        c.temperature < c.temperatureRange.min || 
                        c.temperature > c.temperatureRange.max
                      ).length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CargoMonitoring;
