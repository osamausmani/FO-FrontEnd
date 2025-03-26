import React, { useState, ReactElement } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Box,
  Paper,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { Link } from 'react-router-dom';
import NatureIcon from '@mui/icons-material/Nature';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import EvStationIcon from '@mui/icons-material/EvStation';
import RecyclingIcon from '@mui/icons-material/Recycling';
import WaterIcon from '@mui/icons-material/Water';
import Co2Icon from '@mui/icons-material/Co2';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import InfoIcon from '@mui/icons-material/Info';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

interface EmissionsSummary {
  title: string;
  value: string;
  unit: string;
  change: number;
  changeText: string;
  icon: React.ReactNode;
  color: string;
}

interface SustainabilityGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  category: 'emissions' | 'fuel' | 'energy' | 'waste' | 'water';
  status: 'on_track' | 'at_risk' | 'behind';
}

interface VehicleEmission {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType: string;
  fuelType: string;
  co2Emissions: number;
  emissionsPerMile: number;
  milesDriven: number;
  efficiency: number;
  lastUpdated: string;
}

const mockEmissionsSummaries: EmissionsSummary[] = [
  {
    title: 'Total CO₂ Emissions',
    value: '156.8',
    unit: 'metric tons',
    change: -12.5,
    changeText: 'vs last quarter',
    icon: <Co2Icon />,
    color: 'success.main'
  },
  {
    title: 'Fuel Consumption',
    value: '12,450',
    unit: 'gallons',
    change: -8.3,
    changeText: 'vs last quarter',
    icon: <LocalGasStationIcon />,
    color: 'success.main'
  },
  {
    title: 'Electric Usage',
    value: '4,280',
    unit: 'kWh',
    change: 15.2,
    changeText: 'vs last quarter',
    icon: <BatteryChargingFullIcon />,
    color: 'primary.main'
  },
  {
    title: 'Waste Recycled',
    value: '78',
    unit: '%',
    change: 5.7,
    changeText: 'vs last quarter',
    icon: <RecyclingIcon />,
    color: 'primary.main'
  },
];

const mockSustainabilityGoals: SustainabilityGoal[] = [
  {
    id: 'g1',
    title: 'Reduce CO₂ Emissions',
    description: 'Reduce fleet-wide CO₂ emissions by 30% compared to 2023 baseline',
    target: 30,
    current: 12.5,
    unit: '%',
    deadline: '2025-12-31',
    category: 'emissions',
    status: 'on_track'
  },
  {
    id: 'g2',
    title: 'Increase Electric Vehicles',
    description: 'Convert 25% of fleet to electric or hybrid vehicles',
    target: 25,
    current: 8,
    unit: '%',
    deadline: '2026-06-30',
    category: 'energy',
    status: 'at_risk'
  },
  {
    id: 'g3',
    title: 'Optimize Fuel Efficiency',
    description: 'Improve average fleet fuel efficiency by 15%',
    target: 15,
    current: 9.2,
    unit: '%',
    deadline: '2025-09-30',
    category: 'fuel',
    status: 'on_track'
  },
  {
    id: 'g4',
    title: 'Reduce Waste Generation',
    description: 'Reduce maintenance-related waste by 40%',
    target: 40,
    current: 12,
    unit: '%',
    deadline: '2026-12-31',
    category: 'waste',
    status: 'behind'
  },
  {
    id: 'g5',
    title: 'Water Conservation',
    description: 'Reduce water usage in vehicle washing by 20%',
    target: 20,
    current: 15,
    unit: '%',
    deadline: '2025-12-31',
    category: 'water',
    status: 'on_track'
  },
];

const mockVehicleEmissions: VehicleEmission[] = [
  {
    id: 've1',
    vehicleId: 'V001',
    vehicleName: '2023 Ford F-150',
    vehicleType: 'Pickup Truck',
    fuelType: 'Gasoline',
    co2Emissions: 5.2,
    emissionsPerMile: 0.42,
    milesDriven: 12500,
    efficiency: 18.5,
    lastUpdated: '2025-03-15T10:30:00'
  },
  {
    id: 've2',
    vehicleId: 'V002',
    vehicleName: '2024 Tesla Model Y',
    vehicleType: 'SUV',
    fuelType: 'Electric',
    co2Emissions: 0.8,
    emissionsPerMile: 0.07,
    milesDriven: 11200,
    efficiency: 123.0,
    lastUpdated: '2025-03-18T14:15:00'
  },
  {
    id: 've3',
    vehicleId: 'V003',
    vehicleName: '2022 Toyota Prius',
    vehicleType: 'Sedan',
    fuelType: 'Hybrid',
    co2Emissions: 2.1,
    emissionsPerMile: 0.18,
    milesDriven: 15800,
    efficiency: 52.0,
    lastUpdated: '2025-03-17T09:45:00'
  },
  {
    id: 've4',
    vehicleId: 'V004',
    vehicleName: '2023 Chevrolet Express',
    vehicleType: 'Van',
    fuelType: 'Diesel',
    co2Emissions: 7.8,
    emissionsPerMile: 0.56,
    milesDriven: 14200,
    efficiency: 16.0,
    lastUpdated: '2025-03-16T16:20:00'
  },
  {
    id: 've5',
    vehicleId: 'V005',
    vehicleName: '2024 Rivian R1T',
    vehicleType: 'Pickup Truck',
    fuelType: 'Electric',
    co2Emissions: 1.2,
    emissionsPerMile: 0.09,
    milesDriven: 9800,
    efficiency: 105.0,
    lastUpdated: '2025-03-19T11:10:00'
  },
];

const SustainabilityDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [timeframe, setTimeframe] = useState('quarter');
  
  const features: FeatureCard[] = [
    {
      title: 'Carbon Footprint',
      description: 'Track and analyze your fleet\'s carbon emissions',
      icon: <Co2Icon fontSize="large" color="primary" />,
      path: '/sustainability/carbon-footprint'
    },
    {
      title: 'Electric Vehicles',
      description: 'Manage and monitor your electric vehicle fleet',
      icon: <EvStationIcon fontSize="large" color="primary" />,
      path: '/sustainability/electric-vehicles'
    },
    {
      title: 'Fuel Optimization',
      description: 'Strategies to reduce fuel consumption and emissions',
      icon: <LocalGasStationIcon fontSize="large" color="primary" />,
      path: '/sustainability/fuel-optimization'
    },
    {
      title: 'Waste Management',
      description: 'Track and reduce waste from fleet operations',
      icon: <RecyclingIcon fontSize="large" color="primary" />,
      path: '/sustainability/waste-management'
    },
    {
      title: 'Water Conservation',
      description: 'Monitor and reduce water usage in fleet operations',
      icon: <WaterIcon fontSize="large" color="primary" />,
      path: '/sustainability/water-conservation'
    },
    {
      title: 'Sustainability Goals',
      description: 'Set and track sustainability targets and goals',
      icon: <NatureIcon fontSize="large" color="primary" />,
      path: '/sustainability/goals'
    },
    {
      title: 'Green Energy',
      description: 'Integrate renewable energy into your fleet operations',
      icon: <SolarPowerIcon fontSize="large" color="primary" />,
      path: '/sustainability/green-energy'
    },
    {
      title: 'Sustainability Reports',
      description: 'Generate detailed sustainability reports',
      icon: <BarChartIcon fontSize="large" color="primary" />,
      path: '/sustainability/reports'
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTimeframeChange = (event: SelectChangeEvent<string>) => {
    setTimeframe(event.target.value as string);
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'primary' => {
    switch (status) {
      case 'on_track': return 'success';
      case 'at_risk': return 'warning';
      case 'behind': return 'error';
      default: return 'primary';
    }
  };

  const getStatusIcon = (status: string): ReactElement => {
    switch (status) {
      case 'on_track': return <CheckCircleIcon fontSize="small" />;
      case 'at_risk': return <WarningIcon fontSize="small" />;
      case 'behind': return <WarningIcon fontSize="small" color="error" />;
      default: return <InfoIcon fontSize="small" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emissions': return <Co2Icon fontSize="small" />;
      case 'fuel': return <LocalGasStationIcon fontSize="small" />;
      case 'energy': return <BatteryChargingFullIcon fontSize="small" />;
      case 'waste': return <RecyclingIcon fontSize="small" />;
      case 'water': return <WaterIcon fontSize="small" />;
      default: return <NatureIcon fontSize="small" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sustainability Dashboard
        </Typography>
        <Typography variant="body1" paragraph>
          Monitor and improve your fleet's environmental impact with comprehensive sustainability tracking and reporting.
        </Typography>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {mockEmissionsSummaries.map((summary, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {summary.title}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    bgcolor: `${summary.color}15`,
                    p: 1,
                    borderRadius: '50%'
                  }}>
                    <Box sx={{ color: summary.color }}>
                      {summary.icon}
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                  <Typography variant="h4" component="div">
                    {summary.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {summary.unit}
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mt: 1,
                  color: summary.change >= 0 ? 
                    (summary.title.includes('Emissions') || summary.title.includes('Consumption') ? 
                      (summary.change > 0 ? 'error.main' : 'success.main') : 
                      (summary.change > 0 ? 'success.main' : 'error.main')) : 
                    (summary.title.includes('Emissions') || summary.title.includes('Consumption') ? 
                      'success.main' : 'error.main')
                }}>
                  {((summary.title.includes('Emissions') || summary.title.includes('Consumption')) && summary.change < 0) || 
                   (!(summary.title.includes('Emissions') || summary.title.includes('Consumption')) && summary.change > 0) ? 
                    <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} /> : 
                    <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />
                  }
                  <Typography variant="body2" component="span">
                    {Math.abs(summary.change)}% {summary.changeText}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="sustainability tabs">
                <Tab label="Overview" />
                <Tab label="Emissions" />
                <Tab label="Goals" />
                <Tab label="Reports" />
              </Tabs>
            </Box>
            <Box sx={{ p: 3 }}>
              {tabValue === 0 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">Sustainability Goals</Typography>
                    <Box>
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Timeframe</InputLabel>
                        <Select
                          value={timeframe}
                          label="Timeframe"
                          onChange={handleTimeframeChange}
                        >
                          <MenuItem value="month">This Month</MenuItem>
                          <MenuItem value="quarter">This Quarter</MenuItem>
                          <MenuItem value="year">This Year</MenuItem>
                          <MenuItem value="all">All Time</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                  
                  <Grid container spacing={3}>
                    {mockSustainabilityGoals.map((goal) => (
                      <Grid item xs={12} md={6} key={goal.id}>
                        <Card sx={{ mb: 2 }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ 
                                  p: 1, 
                                  borderRadius: '50%', 
                                  bgcolor: `${getStatusColor(goal.status)}.light`,
                                  color: `${getStatusColor(goal.status)}.main`,
                                  mr: 2
                                }}>
                                  {getCategoryIcon(goal.category)}
                                </Box>
                                <Typography variant="h6">{goal.title}</Typography>
                              </Box>
                              <Chip 
                                icon={getStatusIcon(goal.status)}
                                label={goal.status.replace('_', ' ').toUpperCase()} 
                                color={getStatusColor(goal.status)} 
                                size="small" 
                              />
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {goal.description}
                            </Typography>
                            
                            <Box sx={{ mt: 2, mb: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="body2">
                                  Progress: {goal.current}/{goal.target}{goal.unit}
                                </Typography>
                                <Typography variant="body2">
                                  {Math.round((goal.current / goal.target) * 100)}%
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={(goal.current / goal.target) * 100} 
                                color={getStatusColor(goal.status)}
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                            </Box>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                              <Typography variant="caption" color="text.secondary">
                                Category: {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Target Date: {formatDate(goal.deadline)}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
              
              {tabValue === 1 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">Emissions by Vehicle</Typography>
                    <Box>
                      <IconButton size="small" title="Download data">
                        <DownloadIcon />
                      </IconButton>
                      <IconButton size="small" title="Print report">
                        <PrintIcon />
                      </IconButton>
                      <IconButton size="small" title="Share report">
                        <ShareIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <TableContainer component={Paper} variant="outlined">
                    <Table sx={{ minWidth: 650 }} size="medium">
                      <TableHead>
                        <TableRow>
                          <TableCell>Vehicle</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Fuel Type</TableCell>
                          <TableCell align="right">CO₂ Emissions (tons)</TableCell>
                          <TableCell align="right">Emissions/Mile (kg)</TableCell>
                          <TableCell align="right">Miles Driven</TableCell>
                          <TableCell align="right">Efficiency</TableCell>
                          <TableCell>Last Updated</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockVehicleEmissions.map((vehicle) => (
                          <TableRow key={vehicle.id}>
                            <TableCell component="th" scope="row">
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <DirectionsCarIcon sx={{ mr: 1, color: 'primary.main' }} />
                                {vehicle.vehicleName}
                              </Box>
                            </TableCell>
                            <TableCell>{vehicle.vehicleType}</TableCell>
                            <TableCell>
                              <Chip 
                                label={vehicle.fuelType} 
                                size="small" 
                                color={vehicle.fuelType === 'Electric' ? 'success' : 
                                       vehicle.fuelType === 'Hybrid' ? 'info' : 
                                       vehicle.fuelType === 'Diesel' ? 'error' : 'warning'} 
                              />
                            </TableCell>
                            <TableCell align="right">{vehicle.co2Emissions.toFixed(1)}</TableCell>
                            <TableCell align="right">{vehicle.emissionsPerMile.toFixed(2)}</TableCell>
                            <TableCell align="right">{vehicle.milesDriven.toLocaleString()}</TableCell>
                            <TableCell align="right">
                              {vehicle.fuelType === 'Electric' ? 
                                `${vehicle.efficiency.toFixed(1)} MPGe` : 
                                `${vehicle.efficiency.toFixed(1)} MPG`}
                            </TableCell>
                            <TableCell>{formatDate(vehicle.lastUpdated)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
              
              {tabValue === 2 && (
                <Typography variant="body1">Sustainability goals content would be displayed here.</Typography>
              )}
              
              {tabValue === 3 && (
                <Typography variant="body1">Sustainability reports content would be displayed here.</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Sustainability Features
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography gutterBottom variant="h6" component="h2" align="center">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button 
                      component={Link} 
                      to={feature.path} 
                      variant="outlined" 
                      size="small"
                      sx={{ borderRadius: 2 }}
                    >
                      Explore
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SustainabilityDashboard;
