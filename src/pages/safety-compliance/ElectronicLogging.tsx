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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Alert,
  AlertTitle
} from '@mui/material';
import { Link } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import VideocamIcon from '@mui/icons-material/Videocam';
import WarningIcon from '@mui/icons-material/Warning';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

interface LogEntry {
  id: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehicleName: string;
  status: 'driving' | 'on-duty' | 'off-duty' | 'sleeper';
  startTime: string;
  endTime: string;
  duration: string;
  location: string;
  notes?: string;
  violations?: string[];
}

const mockLogEntries: LogEntry[] = [
  {
    id: 'log1',
    driverId: 'd1',
    driverName: 'John Doe',
    vehicleId: 'v1',
    vehicleName: 'Fleet Car 001',
    status: 'driving',
    startTime: '2025-03-19T08:00:00',
    endTime: '2025-03-19T12:30:00',
    duration: '4h 30m',
    location: 'Route 66, Springfield, IL',
    notes: 'Regular delivery route'
  },
  {
    id: 'log2',
    driverId: 'd1',
    driverName: 'John Doe',
    vehicleId: 'v1',
    vehicleName: 'Fleet Car 001',
    status: 'on-duty',
    startTime: '2025-03-19T12:30:00',
    endTime: '2025-03-19T13:30:00',
    duration: '1h 0m',
    location: 'Distribution Center, Springfield, IL',
    notes: 'Loading cargo'
  },
  {
    id: 'log3',
    driverId: 'd2',
    driverName: 'Jane Smith',
    vehicleId: 'v2',
    vehicleName: 'Fleet Truck 002',
    status: 'driving',
    startTime: '2025-03-19T07:00:00',
    endTime: '2025-03-19T14:00:00',
    duration: '7h 0m',
    location: 'Interstate 80, Joliet, IL',
    violations: ['Exceeded maximum driving hours']
  },
  {
    id: 'log4',
    driverId: 'd3',
    driverName: 'Robert Johnson',
    vehicleId: 'v3',
    vehicleName: 'Fleet Van 003',
    status: 'off-duty',
    startTime: '2025-03-19T14:00:00',
    endTime: '2025-03-19T22:00:00',
    duration: '8h 0m',
    location: 'Rest Stop, Bloomington, IL'
  },
  {
    id: 'log5',
    driverId: 'd4',
    driverName: 'Sarah Williams',
    vehicleId: 'v4',
    vehicleName: 'Fleet Car 004',
    status: 'sleeper',
    startTime: '2025-03-19T22:00:00',
    endTime: '2025-03-20T06:00:00',
    duration: '8h 0m',
    location: 'Truck Stop, Champaign, IL'
  },
];

const ElectronicLogging: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const features: FeatureCard[] = [
    {
      title: 'Compliance Tracking',
      description: 'Track and manage regulatory compliance across your fleet',
      icon: <VerifiedUserIcon fontSize="large" color="primary" />,
      path: '/safety-compliance/tracking'
    },
    {
      title: 'Fuel Tax Reporting',
      description: 'Automated IFTA fuel tax reporting and management',
      icon: <ReceiptIcon fontSize="large" color="primary" />,
      path: '/safety-compliance/fuel-tax'
    },
    {
      title: 'Incident Reporting',
      description: 'Document and analyze safety incidents and accidents',
      icon: <ReportProblemIcon fontSize="large" color="primary" />,
      path: '/safety-compliance/incidents'
    },
    {
      title: 'Dashcam Analytics',
      description: 'AI-powered dashcam video analysis for safety insights',
      icon: <VideocamIcon fontSize="large" color="primary" />,
      path: '/safety-compliance/dashcam'
    },
    {
      title: 'Collision Avoidance',
      description: 'Advanced collision detection and prevention systems',
      icon: <WarningIcon fontSize="large" color="primary" />,
      path: '/safety-compliance/collision'
    },
    {
      title: 'Emergency Alerts',
      description: 'Real-time emergency notification and response system',
      icon: <NotificationsActiveIcon fontSize="large" color="primary" />,
      path: '/safety-compliance/emergency'
    },
    {
      title: 'Cabin Alerts',
      description: 'In-cabin monitoring and driver alert systems',
      icon: <AirlineSeatReclineNormalIcon fontSize="large" color="primary" />,
      path: '/safety-compliance/cabin-alerts'
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'driving': return 'success';
      case 'on-duty': return 'warning';
      case 'off-duty': return 'info';
      case 'sleeper': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'driving': return 'Driving';
      case 'on-duty': return 'On Duty (Not Driving)';
      case 'off-duty': return 'Off Duty';
      case 'sleeper': return 'Sleeper Berth';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Safety & Compliance Management
        </Typography>
        <Typography variant="body1" paragraph>
          Comprehensive tools to ensure your fleet meets all regulatory requirements and maintains the highest safety standards.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="electronic logging tabs">
                <Tab label="Electronic Logging" />
                <Tab label="Hours of Service" />
                <Tab label="Violations" />
                <Tab label="Reports" />
              </Tabs>
            </Box>
            <Box sx={{ p: 3 }}>
              {tabValue === 0 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Driver Logs - Today</Typography>
                    <Box>
                      <IconButton size="small" title="Print logs">
                        <PrintIcon />
                      </IconButton>
                      <IconButton size="small" title="Download logs">
                        <DownloadIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Driver</TableCell>
                          <TableCell>Vehicle</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Start Time</TableCell>
                          <TableCell>End Time</TableCell>
                          <TableCell>Duration</TableCell>
                          <TableCell>Location</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockLogEntries.map((log) => (
                          <TableRow key={log.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>{log.driverName}</TableCell>
                            <TableCell>{log.vehicleName}</TableCell>
                            <TableCell>
                              <Chip 
                                label={getStatusLabel(log.status)} 
                                color={getStatusColor(log.status)} 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell>{formatDate(log.startTime)}</TableCell>
                            <TableCell>{formatDate(log.endTime)}</TableCell>
                            <TableCell>{log.duration}</TableCell>
                            <TableCell>{log.location}</TableCell>
                            <TableCell>
                              <IconButton size="small" title="View details">
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
              {tabValue === 1 && (
                <Typography variant="body1">Hours of Service content would be displayed here.</Typography>
              )}
              {tabValue === 2 && (
                <>
                  <Typography variant="h6" gutterBottom>Compliance Violations</Typography>
                  {mockLogEntries.filter(log => log.violations && log.violations.length > 0).length > 0 ? (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Driver</TableCell>
                            <TableCell>Vehicle</TableCell>
                            <TableCell>Violation</TableCell>
                            <TableCell>Date/Time</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {mockLogEntries
                            .filter(log => log.violations && log.violations.length > 0)
                            .map((log) => (
                              log.violations?.map((violation, index) => (
                                <TableRow key={`${log.id}-${index}`}>
                                  <TableCell>{log.driverName}</TableCell>
                                  <TableCell>{log.vehicleName}</TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <ReportProblemIcon color="error" fontSize="small" sx={{ mr: 1 }} />
                                      {violation}
                                    </Box>
                                  </TableCell>
                                  <TableCell>{new Date(log.endTime).toLocaleString()}</TableCell>
                                  <TableCell>
                                    <IconButton size="small" title="View details">
                                      <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity="success">
                      <AlertTitle>No Violations</AlertTitle>
                      There are no compliance violations to report.
                    </Alert>
                  )}
                </>
              )}
              {tabValue === 3 && (
                <Typography variant="body1">Reports content would be displayed here.</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Safety & Compliance Features
          </Typography>
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

export default ElectronicLogging;
