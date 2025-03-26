import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// Chart components
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// Icons
import SpeedIcon from '@mui/icons-material/Speed';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import WarningIcon from '@mui/icons-material/Warning';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import TimerIcon from '@mui/icons-material/Timer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Types
import { DriverScorecard, DriverBehaviorEvent } from '../../types/tracking';

// API
import apiService from '../../utils/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`driver-performance-tabpanel-${index}`}
      aria-labelledby={`driver-performance-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

interface DriverPerformanceProps {
  driverId?: string; // Optional, if not provided, will show all drivers
}

const DriverPerformance: React.FC<DriverPerformanceProps> = ({ driverId }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [tabValue, setTabValue] = useState(0);
  const [scorecard, setScorecard] = useState<DriverScorecard | null>(null);
  const [events, setEvents] = useState<DriverBehaviorEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  
  // Use the driverId from props or from params
  const effectiveDriverId = driverId || id;

  // Fetch driver performance data
  const fetchDriverPerformance = async () => {
    try {
      setLoading(true);
      
      // Fetch the scorecard
      const scorecardRes = await apiService.getDriverScorecard(
        effectiveDriverId || '',
        { period }
      );
      setScorecard(scorecardRes.data.data);
      
      // Fetch recent events
      const eventsRes = await apiService.getDriverBehaviorEvents(
        effectiveDriverId || ''
      );
      setEvents(eventsRes.data.data);
      
      // Fetch historical data
      const historyRes = await apiService.getDriverPerformanceHistory(
        effectiveDriverId || '', 
        { period }
      );
      setHistoricalData(historyRes.data.data);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching driver performance data:', err);
      setError('Failed to fetch driver performance data. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (effectiveDriverId) {
      fetchDriverPerformance();
    }
  }, [effectiveDriverId, period]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePeriodChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPeriod(event.target.value as 'daily' | 'weekly' | 'monthly');
  };

  // Calculate score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 90) return theme.palette.success.main;
    if (score >= 70) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  // Get severity color for events
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return theme.palette.info.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'high':
        return theme.palette.error.main;
      case 'critical':
        return '#d32f2f'; // dark red
      default:
        return theme.palette.info.main;
    }
  };

  // Format event type for display
  const formatEventType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
    '#8884d8'
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!scorecard) {
    return <Alert severity="info">No performance data available for this driver.</Alert>;
  }

  // Prepare data for charts
  const eventsPieData = [
    { name: 'Harsh Acceleration', value: scorecard.events.harsh_acceleration },
    { name: 'Harsh Braking', value: scorecard.events.harsh_braking },
    { name: 'Harsh Cornering', value: scorecard.events.harsh_cornering },
    { name: 'Speeding', value: scorecard.events.speeding },
    { name: 'Distraction', value: scorecard.events.distraction },
    { name: 'Fatigue', value: scorecard.events.fatigue },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Driver Performance
      </Typography>
      
      {/* Period selector */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="subtitle1">Time Period:</Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth variant="outlined" size="small">
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Button 
            variant="outlined" 
            startIcon={<CalendarTodayIcon />}
            onClick={fetchDriverPerformance}
          >
            Refresh Data
          </Button>
        </Grid>
      </Grid>
      
      {/* Scorecard summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Score
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
                <CircularProgress 
                  variant="determinate" 
                  value={scorecard.scores.overall} 
                  size={120}
                  thickness={8}
                  sx={{ 
                    color: getScoreColor(scorecard.scores.overall),
                    marginBottom: 2
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" component="div" color={getScoreColor(scorecard.scores.overall)}>
                    {Math.round(scorecard.scores.overall)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="textSecondary" align="center">
                {scorecard.period} score for {scorecard.driverName}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Score Breakdown */}
        <Grid item xs={12} md={9}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Score Breakdown
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body1">Safety Score</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={scorecard.scores.safety} 
                        sx={{ 
                          height: 10, 
                          borderRadius: 5,
                          backgroundColor: theme.palette.grey[300],
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getScoreColor(scorecard.scores.safety),
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="textSecondary">
                        {Math.round(scorecard.scores.safety)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="body1">Efficiency Score</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={scorecard.scores.efficiency} 
                        sx={{ 
                          height: 10, 
                          borderRadius: 5,
                          backgroundColor: theme.palette.grey[300],
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getScoreColor(scorecard.scores.efficiency),
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="textSecondary">
                        {Math.round(scorecard.scores.efficiency)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="body1">Compliance Score</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={scorecard.scores.compliance} 
                        sx={{ 
                          height: 10, 
                          borderRadius: 5,
                          backgroundColor: theme.palette.grey[300],
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getScoreColor(scorecard.scores.compliance),
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="textSecondary">
                        {Math.round(scorecard.scores.compliance)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabs for different performance metrics */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Driving Behavior" />
          <Tab label="Trends" />
          <Tab label="Events" />
        </Tabs>
        
        {/* Driving Behavior Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Driving Events Breakdown
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={eventsPieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {eventsPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Driver Statistics
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <DirectionsCarIcon sx={{ mr: 1 }} />
                              Total Distance
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            {scorecard.totalDistance.toLocaleString()} km
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TimerIcon sx={{ mr: 1 }} />
                              Total Driving Time
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            {Math.floor(scorecard.totalDrivingTime / 3600)} hours {Math.floor((scorecard.totalDrivingTime % 3600) / 60)} minutes
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocalGasStationIcon sx={{ mr: 1 }} />
                              Fuel Consumption
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            {scorecard.fuelConsumption.total.toLocaleString()} L
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <SpeedIcon sx={{ mr: 1 }} />
                              Fuel Efficiency
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            {scorecard.fuelConsumption.efficiency.toFixed(2)} L/100km
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <WarningIcon sx={{ mr: 1 }} />
                              Total Events
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            {Object.values(scorecard.events).reduce((sum, val) => sum + val, 0)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Trends Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Trend
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={historicalData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="overall" name="Overall Score" stroke={theme.palette.primary.main} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="safety" name="Safety Score" stroke={theme.palette.error.main} />
                        <Line type="monotone" dataKey="efficiency" name="Efficiency Score" stroke={theme.palette.success.main} />
                        <Line type="monotone" dataKey="compliance" name="Compliance Score" stroke={theme.palette.info.main} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Events Over Time
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={historicalData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="harsh_acceleration" name="Harsh Acceleration" fill={theme.palette.error.main} />
                        <Bar dataKey="harsh_braking" name="Harsh Braking" fill={theme.palette.warning.main} />
                        <Bar dataKey="speeding" name="Speeding" fill={theme.palette.info.main} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Events Tab */}
        <TabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event Type</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Speed</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No events recorded for this period
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow key={event.timestamp} hover>
                      <TableCell>
                        {formatEventType(event.eventType)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={event.severity.toUpperCase()}
                          size="small"
                          sx={{ 
                            backgroundColor: getSeverityColor(event.severity),
                            color: '#fff'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(event.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {event.speed ? `${event.speed} km/h` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {`${event.position.latitude.toFixed(6)}, ${event.position.longitude.toFixed(6)}`}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default DriverPerformance;
