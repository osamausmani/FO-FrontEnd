import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Box,
  Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import MapIcon from '@mui/icons-material/Map';
import RouteIcon from '@mui/icons-material/Route';
import HistoryIcon from '@mui/icons-material/History';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BuildIcon from '@mui/icons-material/Build';
import PlaceIcon from '@mui/icons-material/Place';
import LayersIcon from '@mui/icons-material/Layers';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const GPSTracking: React.FC = () => {
  const features: FeatureCard[] = [
    {
      title: 'Live Tracking',
      description: 'Real-time GPS tracking of all your vehicles on an interactive map',
      icon: <MapIcon fontSize="large" color="primary" />,
      path: '/gps-tracking/live'
    },
    {
      title: 'Geofencing Alerts',
      description: 'Set up virtual boundaries and receive alerts when vehicles enter or exit',
      icon: <PlaceIcon fontSize="large" color="primary" />,
      path: '/gps-tracking/geofencing-alerts'
    },
    {
      title: 'Route Optimization',
      description: 'AI-powered route planning to minimize distance and fuel consumption',
      icon: <RouteIcon fontSize="large" color="primary" />,
      path: '/gps-tracking/route-optimization'
    },
    {
      title: 'Trip History',
      description: 'View detailed history of all vehicle trips with playback functionality',
      icon: <HistoryIcon fontSize="large" color="primary" />,
      path: '/gps-tracking/trip-history'
    },
    {
      title: 'Custom Map Overlays',
      description: 'Customize map views with traffic, weather, and other data layers',
      icon: <LayersIcon fontSize="large" color="primary" />,
      path: '/gps-tracking/map-overlays'
    },
    {
      title: 'Speed Monitoring',
      description: 'Monitor vehicle speeds and receive alerts for speeding violations',
      icon: <SpeedIcon fontSize="large" color="primary" />,
      path: '/gps-tracking/speed-monitoring'
    },
    {
      title: 'Idle Time Tracking',
      description: 'Track and analyze vehicle idle times to reduce fuel waste',
      icon: <AccessTimeIcon fontSize="large" color="primary" />,
      path: '/gps-tracking/idle-time'
    },
    {
      title: 'Cargo Monitoring',
      description: 'Monitor cargo status and conditions during transport',
      icon: <LocalShippingIcon fontSize="large" color="primary" />,
      path: '/gps-tracking/cargo-monitoring'
    },
    {
      title: 'Engine Diagnostics',
      description: 'Real-time engine diagnostics and performance monitoring',
      icon: <BuildIcon fontSize="large" color="primary" />,
      path: '/gps-tracking/engine-diagnostics'
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          GPS Tracking & Monitoring
        </Typography>
        <Typography variant="body1" paragraph>
          Our comprehensive GPS tracking system provides real-time location data, route optimization, 
          and detailed analytics to help you manage your fleet efficiently.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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
                <Typography gutterBottom variant="h5" component="h2" align="center">
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
                  variant="contained" 
                  color="primary"
                  sx={{ borderRadius: 2 }}
                >
                  Explore
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default GPSTracking;
