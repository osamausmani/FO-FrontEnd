import React, { useState } from 'react';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  TextField,
  MenuItem,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import { Link } from 'react-router-dom';
import RouteIcon from '@mui/icons-material/Route';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import DirectionsIcon from '@mui/icons-material/Directions';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

interface Route {
  id: string;
  name: string;
  status: 'planned' | 'in-progress' | 'completed' | 'delayed';
  startLocation: string;
  endLocation: string;
  stops: {
    id: string;
    location: string;
    arrivalTime: string;
    departureTime: string;
    status: 'pending' | 'completed' | 'skipped';
  }[];
  distance: string;
  duration: string;
  driver: {
    id: string;
    name: string;
  };
  vehicle: {
    id: string;
    name: string;
  };
  fuelConsumption: string;
  co2Emissions: string;
}

const mockRoutes: Route[] = [
  {
    id: 'r1',
    name: 'Daily Delivery Route #1',
    status: 'in-progress',
    startLocation: 'Warehouse A, Chicago, IL',
    endLocation: 'Distribution Center, Milwaukee, WI',
    stops: [
      {
        id: 's1',
        location: 'Customer Site 1, Evanston, IL',
        arrivalTime: '2025-03-19T09:30:00',
        departureTime: '2025-03-19T10:00:00',
        status: 'completed'
      },
      {
        id: 's2',
        location: 'Customer Site 2, Waukegan, IL',
        arrivalTime: '2025-03-19T11:15:00',
        departureTime: '2025-03-19T11:45:00',
        status: 'completed'
      },
      {
        id: 's3',
        location: 'Customer Site 3, Kenosha, WI',
        arrivalTime: '2025-03-19T13:00:00',
        departureTime: '2025-03-19T13:30:00',
        status: 'pending'
      },
      {
        id: 's4',
        location: 'Customer Site 4, Racine, WI',
        arrivalTime: '2025-03-19T14:45:00',
        departureTime: '2025-03-19T15:15:00',
        status: 'pending'
      }
    ],
    distance: '142 miles',
    duration: '3h 45m',
    driver: {
      id: 'd1',
      name: 'John Doe'
    },
    vehicle: {
      id: 'v1',
      name: 'Fleet Truck 001'
    },
    fuelConsumption: '18.5 gallons',
    co2Emissions: '167 kg'
  },
  {
    id: 'r2',
    name: 'Weekly Supply Route #5',
    status: 'planned',
    startLocation: 'Distribution Center, Chicago, IL',
    endLocation: 'Regional Hub, Indianapolis, IN',
    stops: [
      {
        id: 's5',
        location: 'Supplier A, Gary, IN',
        arrivalTime: '2025-03-20T08:00:00',
        departureTime: '2025-03-20T09:00:00',
        status: 'pending'
      },
      {
        id: 's6',
        location: 'Warehouse B, South Bend, IN',
        arrivalTime: '2025-03-20T11:30:00',
        departureTime: '2025-03-20T12:30:00',
        status: 'pending'
      },
      {
        id: 's7',
        location: 'Distribution Point C, Kokomo, IN',
        arrivalTime: '2025-03-20T14:00:00',
        departureTime: '2025-03-20T14:30:00',
        status: 'pending'
      }
    ],
    distance: '189 miles',
    duration: '4h 15m',
    driver: {
      id: 'd2',
      name: 'Jane Smith'
    },
    vehicle: {
      id: 'v2',
      name: 'Fleet Truck 002'
    },
    fuelConsumption: '22.3 gallons',
    co2Emissions: '201 kg'
  }
];

const RouteOptimization: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(mockRoutes[0]);
  
  const features: FeatureCard[] = [
    {
      title: 'Load Planning',
      description: 'Optimize load distribution and cargo planning',
      icon: <LocalShippingIcon fontSize="large" color="primary" />,
      path: '/dispatch-logistics/load-planning'
    },
    {
      title: 'Inventory Management',
      description: 'Track and manage inventory across your fleet',
      icon: <InventoryIcon fontSize="large" color="primary" />,
      path: '/dispatch-logistics/inventory'
    },
    {
      title: 'Work Orders',
      description: 'Create and manage work orders for your fleet',
      icon: <AssignmentIcon fontSize="large" color="primary" />,
      path: '/dispatch-logistics/work-orders'
    },
    {
      title: 'Appointment Scheduling',
      description: 'Schedule and manage appointments and deliveries',
      icon: <EventNoteIcon fontSize="large" color="primary" />,
      path: '/dispatch-logistics/scheduling'
    },
    {
      title: 'Delivery Notifications',
      description: 'Automated delivery notifications and updates',
      icon: <NotificationsIcon fontSize="large" color="primary" />,
      path: '/dispatch-logistics/notifications'
    },
    {
      title: 'Performance Analytics',
      description: 'Analyze delivery performance and metrics',
      icon: <BarChartIcon fontSize="large" color="primary" />,
      path: '/dispatch-logistics/analytics'
    },
    {
      title: 'Route Settings',
      description: 'Configure route optimization parameters',
      icon: <SettingsIcon fontSize="large" color="primary" />,
      path: '/dispatch-logistics/settings'
    },
  ];

  const handleRouteSelect = (route: Route) => {
    setSelectedRoute(route);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'info';
      case 'in-progress': return 'warning';
      case 'completed': return 'success';
      case 'delayed': return 'error';
      case 'pending': return 'default';
      case 'skipped': return 'secondary';
      default: return 'default';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dispatch & Logistics Management
        </Typography>
        <Typography variant="body1" paragraph>
          Optimize routes, manage dispatching, and streamline logistics operations for maximum efficiency.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Active Routes</Typography>
              <Button 
                variant="contained" 
                size="small" 
                startIcon={<AddIcon />}
                component={Link}
                to="/dispatch-logistics/routes/new"
              >
                New Route
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ maxHeight: '60vh', overflow: 'auto' }}>
              {mockRoutes.map((route) => (
                <ListItem 
                  key={route.id} 
                  button 
                  selected={selectedRoute?.id === route.id}
                  onClick={() => handleRouteSelect(route)}
                  sx={{ 
                    mb: 1, 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      }
                    }
                  }}
                >
                  <ListItemIcon>
                    <RouteIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2">{route.name}</Typography>
                        <Chip 
                          label={route.status.toUpperCase()} 
                          color={getStatusColor(route.status)} 
                          size="small" 
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          {route.startLocation} → {route.endLocation}
                        </Typography>
                        <br />
                        <Typography variant="body2" component="span" color="text.secondary">
                          {route.distance} • {route.duration} • {route.stops.length} stops
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, mb: 3, minHeight: '60vh' }}>
            {selectedRoute ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{selectedRoute.name}</Typography>
                  <Box>
                    <IconButton size="small" component={Link} to={`/dispatch-logistics/routes/${selectedRoute.id}/edit`}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>Route Details</Typography>
                      <Box sx={{ display: 'flex', mb: 1 }}>
                        <DirectionsIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          <strong>Distance:</strong> {selectedRoute.distance}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', mb: 1 }}>
                        <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          <strong>Duration:</strong> {selectedRoute.duration}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', mb: 1 }}>
                        <PersonIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          <strong>Driver:</strong> {selectedRoute.driver.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', mb: 1 }}>
                        <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          <strong>Vehicle:</strong> {selectedRoute.vehicle.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>Environmental Impact</Typography>
                      <Box sx={{ display: 'flex', mb: 1 }}>
                        <Typography variant="body2">
                          <strong>Fuel Consumption:</strong> {selectedRoute.fuelConsumption}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', mb: 1 }}>
                        <Typography variant="body2">
                          <strong>CO2 Emissions:</strong> {selectedRoute.co2Emissions}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Button variant="outlined" size="small" component={Link} to="/dispatch-logistics/eco-routing">
                          Optimize for Eco-Routing
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Typography variant="subtitle1" gutterBottom>Route Timeline</Typography>
                <Stepper orientation="vertical" sx={{ mt: 2 }}>
                  <Step completed={true}>
                    <StepLabel>
                      <Typography variant="subtitle2">{selectedRoute.startLocation}</Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2">Starting point</Typography>
                    </StepContent>
                  </Step>
                  
                  {selectedRoute.stops.map((stop, index) => (
                    <Step key={stop.id} completed={stop.status === 'completed'}>
                      <StepLabel>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <Typography variant="subtitle2">{stop.location}</Typography>
                          <Chip 
                            label={stop.status.toUpperCase()} 
                            color={getStatusColor(stop.status)} 
                            size="small" 
                          />
                        </Box>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2">
                          Arrival: {formatTime(stop.arrivalTime)} | Departure: {formatTime(stop.departureTime)}
                        </Typography>
                      </StepContent>
                    </Step>
                  ))}
                  
                  <Step>
                    <StepLabel>
                      <Typography variant="subtitle2">{selectedRoute.endLocation}</Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2">Final destination</Typography>
                    </StepContent>
                  </Step>
                </Stepper>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    component={Link} 
                    to={`/dispatch-logistics/routes/${selectedRoute.id}/navigate`}
                    startIcon={<MyLocationIcon />}
                  >
                    Start Navigation
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="h6" color="text.secondary">
                  Select a route to view details
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Dispatch & Logistics Features
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

export default RouteOptimization;
