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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import BuildIcon from '@mui/icons-material/Build';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

interface AnalyticsSummary {
  title: string;
  value: string;
  change: number;
  changeText: string;
  icon: React.ReactNode;
  color: string;
}

interface InsightItem {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'maintenance' | 'fuel' | 'safety' | 'operations';
  dateGenerated: string;
  recommendation?: string;
}

const mockInsights: InsightItem[] = [
  {
    id: 'i1',
    title: 'Preventive Maintenance Opportunity',
    description: '5 vehicles are due for maintenance in the next 7 days. Scheduling them now could prevent future breakdowns.',
    impact: 'high',
    category: 'maintenance',
    dateGenerated: '2025-03-19T10:30:00',
    recommendation: 'Schedule maintenance for vehicles #1005, #1008, #1012, #1015, and #1023 within the next week.'
  },
  {
    id: 'i2',
    title: 'Fuel Efficiency Decline',
    description: 'Fleet fuel efficiency has decreased by 8% in the last month. Primary contributors are vehicles in the delivery division.',
    impact: 'medium',
    category: 'fuel',
    dateGenerated: '2025-03-18T14:15:00',
    recommendation: 'Inspect vehicles #2003, #2007, and #2015 for potential maintenance issues affecting fuel efficiency.'
  },
  {
    id: 'i3',
    title: 'Driver Safety Alert',
    description: 'Three drivers have shown increased harsh braking events in the past week, indicating potential safety concerns.',
    impact: 'high',
    category: 'safety',
    dateGenerated: '2025-03-17T09:45:00',
    recommendation: 'Schedule safety refresher training for drivers John Doe, Sarah Williams, and Robert Johnson.'
  },
  {
    id: 'i4',
    title: 'Route Optimization Potential',
    description: 'Analysis shows that optimizing delivery routes could save approximately 120 miles per day across the fleet.',
    impact: 'medium',
    category: 'operations',
    dateGenerated: '2025-03-16T16:20:00',
    recommendation: 'Implement suggested route changes for the Chicago and Milwaukee delivery zones.'
  },
  {
    id: 'i5',
    title: 'Idle Time Reduction',
    description: 'Excessive idle time detected across multiple vehicles, resulting in approximately $450 in wasted fuel costs this month.',
    impact: 'medium',
    category: 'fuel',
    dateGenerated: '2025-03-15T11:10:00',
    recommendation: 'Enable idle shutdown timers and conduct driver training on idle reduction practices.'
  },
];

const FleetAnalytics: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  
  const features: FeatureCard[] = [
    {
      title: 'Predictive Maintenance',
      description: 'AI-powered maintenance predictions and alerts',
      icon: <BuildIcon fontSize="large" color="primary" />,
      path: '/analytics/predictive-maintenance'
    },
    {
      title: 'Fuel Efficiency',
      description: 'Detailed fuel consumption and efficiency analytics',
      icon: <LocalGasStationIcon fontSize="large" color="primary" />,
      path: '/analytics/fuel-efficiency'
    },
    {
      title: 'Driver Behavior',
      description: 'Analyze driver performance and safety metrics',
      icon: <PersonIcon fontSize="large" color="primary" />,
      path: '/analytics/driver-behavior'
    },
    {
      title: 'Route Analysis',
      description: 'Optimize routes and analyze delivery performance',
      icon: <TimelineIcon fontSize="large" color="primary" />,
      path: '/analytics/route-analysis'
    },
    {
      title: 'Vehicle Utilization',
      description: 'Track and optimize vehicle usage and downtime',
      icon: <DirectionsCarIcon fontSize="large" color="primary" />,
      path: '/analytics/vehicle-utilization'
    },
    {
      title: 'Custom Reports',
      description: 'Create and schedule custom analytics reports',
      icon: <AssessmentIcon fontSize="large" color="primary" />,
      path: '/analytics/custom-reports'
    },
    {
      title: 'Alert Configuration',
      description: 'Set up custom alerts based on analytics thresholds',
      icon: <NotificationsIcon fontSize="large" color="primary" />,
      path: '/analytics/alerts'
    },
    {
      title: 'Data Export',
      description: 'Export analytics data for external analysis',
      icon: <DownloadIcon fontSize="large" color="primary" />,
      path: '/analytics/data-export'
    },
  ];

  const analyticsSummaries: AnalyticsSummary[] = [
    {
      title: 'Fleet Utilization',
      value: '78%',
      change: 5.2,
      changeText: 'vs last month',
      icon: <DirectionsCarIcon />,
      color: 'primary.main'
    },
    {
      title: 'Avg. Fuel Economy',
      value: '12.4 mpg',
      change: -2.1,
      changeText: 'vs last month',
      icon: <LocalGasStationIcon />,
      color: 'error.main'
    },
    {
      title: 'Maintenance Costs',
      value: '$12,450',
      change: -8.3,
      changeText: 'vs last month',
      icon: <BuildIcon />,
      color: 'success.main'
    },
    {
      title: 'On-Time Delivery',
      value: '94.2%',
      change: 1.7,
      changeText: 'vs last month',
      icon: <ScheduleIcon />,
      color: 'primary.main'
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance': return <BuildIcon fontSize="small" />;
      case 'fuel': return <LocalGasStationIcon fontSize="small" />;
      case 'safety': return <SpeedIcon fontSize="small" />;
      case 'operations': return <AssessmentIcon fontSize="small" />;
      default: return <AssessmentIcon fontSize="small" />;
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
          Fleet Analytics & Insights
        </Typography>
        <Typography variant="body1" paragraph>
          Comprehensive analytics and data-driven insights to optimize your fleet operations and reduce costs.
        </Typography>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {analyticsSummaries.map((summary, index) => (
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
                <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                  {summary.value}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mt: 1,
                  color: summary.change >= 0 ? 'success.main' : 'error.main'
                }}>
                  {summary.change >= 0 ? 
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
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
                <Tab label="AI Insights" />
                <Tab label="Performance" />
                <Tab label="Trends" />
                <Tab label="Reports" />
              </Tabs>
            </Box>
            <Box sx={{ p: 3 }}>
              {tabValue === 0 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">AI-Generated Insights</Typography>
                    <Box>
                      <IconButton size="small" title="Download insights">
                        <DownloadIcon />
                      </IconButton>
                      <IconButton size="small" title="Share insights">
                        <ShareIcon />
                      </IconButton>
                      <IconButton size="small" title="Settings">
                        <SettingsIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <List>
                    {mockInsights.map((insight) => (
                      <ListItem 
                        key={insight.id} 
                        alignItems="flex-start"
                        sx={{ 
                          mb: 2, 
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          p: 2
                        }}
                      >
                        <ListItemIcon sx={{ mt: 0 }}>
                          <Box sx={{ 
                            bgcolor: `${getImpactColor(insight.impact)}.light`, 
                            p: 1, 
                            borderRadius: '50%',
                            color: `${getImpactColor(insight.impact)}.main`
                          }}>
                            {getCategoryIcon(insight.category)}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1">{insight.title}</Typography>
                              <Chip 
                                label={`${insight.impact.toUpperCase()} IMPACT`} 
                                color={getImpactColor(insight.impact)} 
                                size="small" 
                              />
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {insight.description}
                              </Typography>
                              {insight.recommendation && (
                                <Box sx={{ mt: 1, bgcolor: 'background.default', p: 1, borderRadius: 1 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    <strong>Recommendation:</strong> {insight.recommendation}
                                  </Typography>
                                </Box>
                              )}
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Generated on {formatDate(insight.dateGenerated)}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              {tabValue === 1 && (
                <Typography variant="body1">Performance analytics content would be displayed here.</Typography>
              )}
              {tabValue === 2 && (
                <Typography variant="body1">Trend analysis content would be displayed here.</Typography>
              )}
              {tabValue === 3 && (
                <Typography variant="body1">Reports content would be displayed here.</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Analytics Features
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

export default FleetAnalytics;
