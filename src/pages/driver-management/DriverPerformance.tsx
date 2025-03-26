import React from 'react';
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
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Rating,
  LinearProgress,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import TimelineIcon from '@mui/icons-material/Timeline';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BuildIcon from '@mui/icons-material/Build';
import SpeedIcon from '@mui/icons-material/Speed';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

interface Driver {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  safetyScore: number;
  fuelEfficiency: number;
  complianceStatus: 'compliant' | 'warning' | 'non-compliant';
  lastTrip: string;
  totalTrips: number;
  totalHours: number;
}

const mockDrivers: Driver[] = [
  {
    id: 'd1',
    name: 'John Doe',
    rating: 4.8,
    safetyScore: 95,
    fuelEfficiency: 92,
    complianceStatus: 'compliant',
    lastTrip: '2 hours ago',
    totalTrips: 342,
    totalHours: 1245
  },
  {
    id: 'd2',
    name: 'Jane Smith',
    rating: 4.5,
    safetyScore: 88,
    fuelEfficiency: 90,
    complianceStatus: 'compliant',
    lastTrip: '5 hours ago',
    totalTrips: 289,
    totalHours: 1056
  },
  {
    id: 'd3',
    name: 'Robert Johnson',
    rating: 3.9,
    safetyScore: 75,
    fuelEfficiency: 82,
    complianceStatus: 'warning',
    lastTrip: '1 day ago',
    totalTrips: 178,
    totalHours: 876
  },
  {
    id: 'd4',
    name: 'Sarah Williams',
    rating: 4.7,
    safetyScore: 93,
    fuelEfficiency: 88,
    complianceStatus: 'compliant',
    lastTrip: '3 hours ago',
    totalTrips: 267,
    totalHours: 1122
  },
];

const DriverPerformance: React.FC = () => {
  const features: FeatureCard[] = [
    {
      title: 'Driver Scorecards',
      description: 'Comprehensive performance metrics for each driver',
      icon: <AssessmentIcon fontSize="large" color="primary" />,
      path: '/driver-management/scorecards'
    },
    {
      title: 'Fatigue Detection',
      description: 'AI-powered fatigue and distraction detection system',
      icon: <AirlineSeatReclineNormalIcon fontSize="large" color="primary" />,
      path: '/driver-management/fatigue-detection'
    },
    {
      title: 'Driving Patterns',
      description: 'Analyze driving patterns and behavior trends',
      icon: <TimelineIcon fontSize="large" color="primary" />,
      path: '/driver-management/driving-patterns'
    },
    {
      title: 'Distracted Driving',
      description: 'Monitor and prevent distracted driving incidents',
      icon: <VisibilityOffIcon fontSize="large" color="primary" />,
      path: '/driver-management/distracted-driving'
    },
    {
      title: 'Maintenance Scheduling',
      description: 'Schedule and track vehicle maintenance tasks',
      icon: <BuildIcon fontSize="large" color="primary" />,
      path: '/driver-management/maintenance-scheduling'
    },
    {
      title: 'Tire Monitoring',
      description: 'Real-time tire pressure and wear monitoring',
      icon: <SpeedIcon fontSize="large" color="primary" />,
      path: '/driver-management/tire-monitoring'
    },
    {
      title: 'Fuel Card Integration',
      description: 'Integrate and manage fuel cards for your fleet',
      icon: <CreditCardIcon fontSize="large" color="primary" />,
      path: '/driver-management/fuel-card'
    },
    {
      title: 'Vehicle Inspection',
      description: 'Digital vehicle inspection reports and tracking',
      icon: <DirectionsCarIcon fontSize="large" color="primary" />,
      path: '/driver-management/vehicle-inspection'
    },
  ];

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'success';
      case 'warning': return 'warning';
      case 'non-compliant': return 'error';
      default: return 'default';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success.main';
    if (score >= 75) return 'warning.main';
    return 'error.main';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Driver Management & Performance
            </Typography>
            <Typography variant="body1" paragraph>
              Comprehensive tools to monitor, analyze, and improve driver performance and safety across your fleet.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Top Performing Drivers</Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {mockDrivers.map((driver) => (
                <ListItem key={driver.id} alignItems="flex-start" sx={{ mb: 1 }}>
                  <ListItemAvatar>
                    <Avatar alt={driver.name} src={driver.avatar}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">{driver.name}</Typography>
                        <Chip 
                          label={driver.complianceStatus.toUpperCase()} 
                          color={getComplianceColor(driver.complianceStatus)} 
                          size="small" 
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" component="span" sx={{ minWidth: 120 }}>
                            Driver Rating:
                          </Typography>
                          <Rating value={driver.rating} precision={0.1} readOnly size="small" />
                          <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                            {driver.rating.toFixed(1)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" component="span" sx={{ minWidth: 120 }}>
                            Safety Score:
                          </Typography>
                          <Box sx={{ width: '60%', mr: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={driver.safetyScore} 
                              sx={{ height: 8, borderRadius: 5, bgcolor: 'grey.300', '& .MuiLinearProgress-bar': { bgcolor: getScoreColor(driver.safetyScore) } }}
                            />
                          </Box>
                          <Typography variant="body2" component="span">
                            {driver.safetyScore}%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" component="span" sx={{ minWidth: 120 }}>
                            Fuel Efficiency:
                          </Typography>
                          <Box sx={{ width: '60%', mr: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={driver.fuelEfficiency} 
                              sx={{ height: 8, borderRadius: 5, bgcolor: 'grey.300', '& .MuiLinearProgress-bar': { bgcolor: getScoreColor(driver.fuelEfficiency) } }}
                            />
                          </Box>
                          <Typography variant="body2" component="span">
                            {driver.fuelEfficiency}%
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button component={Link} to="/drivers" variant="outlined">View All Drivers</Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Quick Actions</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="contained" component={Link} to="/driver-management/scorecards">
                View Driver Scorecards
              </Button>
              <Button variant="outlined" component={Link} to="/driver-management/fatigue-detection">
                Check Fatigue Alerts
              </Button>
              <Button variant="outlined" component={Link} to="/driver-management/driving-patterns">
                Analyze Driving Patterns
              </Button>
              <Button variant="outlined" component={Link} to="/driver-management/maintenance-scheduling">
                Schedule Maintenance
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Driver Management Features
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

export default DriverPerformance;
