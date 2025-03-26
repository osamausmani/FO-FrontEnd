import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  LinearProgress,
  useTheme,
  alpha,
  Container,
  Skeleton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  SelectChangeEvent,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiService from "../../utils/api";
import NotificationList from "../../components/notifications/NotificationList";

// Icons
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import BuildIcon from "@mui/icons-material/Build";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import RouteIcon from "@mui/icons-material/Route";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MarkAsUnreadIcon from "@mui/icons-material/MarkAsUnread";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import SpeedIcon from "@mui/icons-material/Speed";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EvStationIcon from "@mui/icons-material/EvStation";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// Charts
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Pie, Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  Filler
);

interface Vehicle {
  active: number;
  maintenance: number;
  inactive: number;
  retired: number;
  total: number;
}

interface Driver {
  active: number;
  inactive: number;
  on_leave: number;
  terminated: number;
  total: number;
}

interface Maintenance {
  scheduled: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  overdue: number;
  total: number;
}

interface Route {
  total: number;
  active: number;
  completed: number;
  planned: number;
}

interface MonthlyData {
  fuelCost: number;
  maintenanceCost: number;
  month: string;
}

interface FleetSummary {
  vehicles: Vehicle;
  drivers: Driver;
  maintenance: Maintenance;
  routes: Route;
  currentMonth?: MonthlyData;
  fuelEfficiency?: number;
  totalDistance?: number;
  costPerMile?: number;
  monthlyData?: MonthlyData[];
}

interface Location {
  name: string;
  coordinates?: [number, number];
}

interface ActiveVehicle {
  _id: string;
  name: string;
  status: string;
  fuelLevel: number;
  odometer: number;
  lastLocation?: {
    name: string;
    coordinates: [number, number];
  };
  image: string;
}

interface MaintenanceAlert {
  _id: string;
  type: string;
  status: string;
  scheduledDate: string;
  vehicle?: ActiveVehicle;
  estimatedCost?: number;
  priority?: "low" | "medium" | "high";
}

interface Route {
  _id: string;
  name: string;
  status: string;
  startLocation?: Location;
  endLocation?: Location;
  distance?: number;
  estimatedDuration?: number;
  driver?: {
    _id: string;
    name: string;
  };
  vehicle?: ActiveVehicle;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "alert" | "warning" | "success" | "info";
  read: boolean;
  createdAt: string;
  updatedAt?: string;
  relatedEntity?: {
    type: string;
    id: string;
  };
}

interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change?: number;
}

interface VehicleLocation {
  vehicleId: string;
  vehicleName: string;
  location: [number, number];
  status: string;
  lastUpdated: string;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<FleetSummary | null>(null);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState<MaintenanceAlert[]>([]);
  const [recentRoutes, setRecentRoutes] = useState<Route[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeVehicles, setActiveVehicles] = useState<ActiveVehicle[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [vehicleLocations, setVehicleLocations] = useState<VehicleLocation[]>([]);
  const [fuelTrends, setFuelTrends] = useState<{labels: string[], data: number[]}>({ labels: [], data: [] });
  const [maintenanceTrends, setMaintenanceTrends] = useState<{labels: string[], data: number[]}>({ labels: [], data: [] });
  const [timeRange, setTimeRange] = useState('week');
  const [recentMaintenance, setRecentMaintenance] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async (): Promise<void> => {
      try {
        setLoading(true);

        // Fetch fleet summary
        const summaryRes = await apiService.getFleetSummary();
        setSummary(summaryRes.data.data);

        // Fetch recent maintenance alerts
        const maintenanceRes = await apiService.getMaintenanceRecords({
          sort: '-scheduledDate',
          limit: 5
        });
        // Convert MaintenanceRecord[] to MaintenanceAlert[]
        const mockAlerts = maintenanceRes.data.data.map((record: any) => ({
          _id: record._id,
          type: record.type,
          status: record.status,
          scheduledDate: record.scheduledDate,
          estimatedCost: record.estimatedCost,
          priority: record.priority || 'medium',
          vehicle: record.vehicle ? {
            _id: record.vehicle._id,
            name: record.vehicle.name || 'Unknown Vehicle',
            status: record.vehicle.status || 'active',
            fuelLevel: record.vehicle.fuelLevel || 75,
            odometer: record.vehicle.odometer || 25000,
            image: `/vehicles/vehicle-${(parseInt(record.vehicle._id.slice(-1)) % 6) + 1}.jpg`
          } : undefined
        })) || [];
        setMaintenanceAlerts(mockAlerts);

        // Fetch recent routes
        const routesRes = await apiService.getRoutes({
          sort: '-actualStartTime',
          limit: 5
        });

        // Enhance routes with additional data for demo
        const enhancedRoutes = routesRes.data.data.map((route: any) => ({
          ...route,
          distance: route.distance || Math.floor(Math.random() * 100) + 10,
          estimatedDuration: route.estimatedDuration || Math.floor(Math.random() * 120) + 30,
          driver: route.driver || {
            _id: `driver-${Math.floor(Math.random() * 1000)}`,
            name: `Driver ${Math.floor(Math.random() * 100)}`
          },
          vehicle: route.vehicle || {
            _id: `vehicle-${Math.floor(Math.random() * 1000)}`,
            name: `Vehicle ${Math.floor(Math.random() * 100)}`
          }
        }));
        setRecentRoutes(enhancedRoutes);

        // Fetch notifications
        const notificationsRes = await apiService.getNotifications({
          limit: 5
        });
        setNotifications(notificationsRes.data.data || []);

        // Mock active vehicles data
        const mockVehicles = Array(6).fill(0).map((_, i) => ({
          _id: `vehicle-${i}`,
          name: `${['Toyota', 'Ford', 'Honda', 'Chevrolet', 'Nissan', 'BMW'][i % 6]} ${['Camry', 'F-150', 'Civic', 'Silverado', 'Altima', 'X5'][i % 6]}`,
          status: ['active', 'active', 'active', 'maintenance', 'active', 'inactive'][i % 6],
          fuelLevel: Math.floor(Math.random() * 100),
          odometer: Math.floor(Math.random() * 50000) + 10000,
          lastLocation: {
            name: `Location ${i + 1}`,
            coordinates: [Math.random() * 10 + 30, Math.random() * 10 + 70] as [number, number]
          },
          image: `/vehicles/vehicle-${(i % 6) + 1}.jpg`
        }));
        setActiveVehicles(mockVehicles);

        // Mock performance metrics
        const mockMetrics = [
          {
            name: 'Fuel Efficiency',
            value: 28.5,
            target: 30,
            unit: 'mpg',
            trend: 'up' as const,
            change: 2.3
          },
          {
            name: 'Maintenance Cost',
            value: 0.12,
            target: 0.10,
            unit: '$/mile',
            trend: 'down' as const,
            change: -1.5
          },
          {
            name: 'Driver Performance',
            value: 87,
            target: 90,
            unit: '%',
            trend: 'up' as const,
            change: 3.2
          },
          {
            name: 'Vehicle Utilization',
            value: 76,
            target: 80,
            unit: '%',
            trend: 'stable' as const,
            change: 0.5
          }
        ];
        setPerformanceMetrics(mockMetrics);

        // Mock vehicle locations
        const mockLocations = mockVehicles.map(v => ({
          vehicleId: v._id,
          vehicleName: v.name,
          location: v.lastLocation?.coordinates || [0, 0] as [number, number],
          status: v.status || 'active',
          lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString()
        }));
        setVehicleLocations(mockLocations);

        // Mock fuel trends
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        setFuelTrends({
          labels: months,
          data: months.map(() => Math.floor(Math.random() * 2000) + 3000)
        });

        // Mock maintenance trends
        setMaintenanceTrends({
          labels: months,
          data: months.map(() => Math.floor(Math.random() * 1000) + 1000)
        });

        // Mock recent maintenance
        const mockMaintenance = Array(5).fill(0).map((_, i) => ({
          _id: `maintenance-${i}`,
          vehicle: `Vehicle ${i + 1}`,
          type: ['Oil Change', 'Tire Rotation', 'Brake Pads', 'Battery Replacement', 'Air Filter'][i % 5],
          date: new Date(Date.now() - Math.floor(Math.random() * 604800000)).toISOString(),
          status: ['completed', 'scheduled', 'in progress', 'cancelled', 'overdue'][i % 5],
          cost: Math.floor(Math.random() * 1000) + 100
        }));
        setRecentMaintenance(mockMaintenance);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper functions for metrics
  const getMetricColor = (trend: string): string => {
    switch (trend) {
      case 'up':
        return theme.palette.success.main;
      case 'down':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getMetricIcon = (name: string): React.ReactNode => {
    switch (name) {
      case 'Fuel Efficiency':
        return <LocalGasStationIcon />;
      case 'Cost Per Mile':
        return <AttachMoneyIcon />;
      case 'Vehicle Utilization':
        return <DirectionsCarIcon />;
      case 'Driver Performance':
        return <PersonIcon />;
      default:
        return <SpeedIcon />;
    }
  };

  // Prepare vehicle status chart data
  const vehicleChartData = {
    labels: ['Active', 'Maintenance', 'Inactive', 'Retired'],
    datasets: [
      {
        data: summary ? [summary.vehicles.active, summary.vehicles.maintenance, summary.vehicles.inactive, summary.vehicles.retired] : [0, 0, 0, 0],
        backgroundColor: ['#4ade80', '#60a5fa', '#94a3b8', '#f87171'],
        borderWidth: 0,
        borderRadius: 4,
        hoverOffset: 5,
      },
    ],
  };

  // Prepare driver status chart data
  const driverChartData = {
    labels: ['Active', 'Inactive', 'On Leave', 'Terminated'],
    datasets: [
      {
        data: summary ? [summary.drivers.active, summary.drivers.inactive, summary.drivers.on_leave, summary.drivers.terminated] : [0, 0, 0, 0],
        backgroundColor: ['#4ade80', '#94a3b8', '#60a5fa', '#f87171'],
        borderWidth: 0,
        borderRadius: 4,
        hoverOffset: 5,
      },
    ],
  };

  // Prepare maintenance status chart data
  const maintenanceChartData = {
    labels: ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Overdue'],
    datasets: [
      {
        data: summary ? [summary.maintenance.scheduled, summary.maintenance.in_progress, summary.maintenance.completed, summary.maintenance.cancelled, summary.maintenance.overdue] : [0, 0, 0, 0, 0],
        backgroundColor: ['#60a5fa', '#fbbf24', '#4ade80', '#94a3b8', '#f87171'],
        borderWidth: 0,
        borderRadius: 4,
        hoverOffset: 5,
      },
    ],
  };

  // Cost comparison data
  const costData = {
    labels: fuelTrends.labels,
    datasets: [
      {
        label: 'Fuel Cost',
        data: fuelTrends.data,
        backgroundColor: alpha(theme.palette.primary.main, 0.7),
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        borderRadius: 4,
        barThickness: 12,
      },
      {
        label: 'Maintenance Cost',
        data: maintenanceTrends.data,
        backgroundColor: alpha(theme.palette.warning.main, 0.7),
        borderColor: theme.palette.warning.main,
        borderWidth: 2,
        borderRadius: 4,
        barThickness: 12,
      },
    ],
  };

  // Line chart data for fuel efficiency trends
  const fuelEfficiencyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'MPG',
        data: [26.3, 26.8, 27.2, 27.9, 28.3, 28.5],
        borderColor: theme.palette.success.main,
        backgroundColor: alpha(theme.palette.success.main, 0.1),
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: theme.palette.success.main,
        pointBorderColor: theme.palette.background.paper,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        display: true,
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          color: theme.palette.text.secondary,
          font: {
            family: theme.typography.fontFamily,
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        boxPadding: 6,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'rectRounded',
          padding: 15,
          color: theme.palette.text.secondary,
          font: {
            family: theme.typography.fontFamily,
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: alpha(theme.palette.divider, 0.1),
          drawBorder: false,
          lineWidth: 1
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 12
          },
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw} mpg`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: alpha(theme.palette.divider, 0.1),
          drawBorder: false,
          lineWidth: 1
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 12
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Fleet Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Overview of your fleet performance and status
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
            sx={{ borderRadius: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{ borderRadius: 2 }}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Key Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {performanceMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 20px -10px ${alpha(theme.palette.primary.main, 0.2)}`,
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {metric.name}
                </Typography>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: alpha(getMetricColor(metric.trend), 0.1),
                    color: getMetricColor(metric.trend),
                  }}
                >
                  {getMetricIcon(metric.name)}
                </Avatar>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                <Typography variant="h4" component="span">
                  {metric.value}
                </Typography>
                <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                  {metric.unit}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: getMetricColor(metric.trend),
                    mr: 1,
                  }}
                >
                  {metric.trend === 'up' ? <TrendingUpIcon fontSize="small" /> : 
                   metric.trend === 'down' ? <TrendingDownIcon fontSize="small" /> : 
                   <TrendingFlatIcon fontSize="small" />}
                  <Typography variant="body2" component="span" sx={{ ml: 0.5 }}>
                    {metric.change ? `${metric.change}%` : '0%'}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  vs target: {metric.target}{metric.unit}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Active Vehicles Section */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Active Vehicles
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {activeVehicles.slice(0, 4).map((vehicle, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 20px -10px ${alpha(theme.palette.primary.main, 0.2)}`,
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={vehicle.image}
                  variant="rounded"
                  sx={{ width: 48, height: 48, borderRadius: 2, mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1" noWrap>
                    {vehicle.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      component="span"
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 
                          vehicle.status === 'active' ? 'success.main' : 
                          vehicle.status === 'maintenance' ? 'warning.main' : 'error.main',
                        mr: 1
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Fuel Level
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LinearProgress
                      variant="determinate"
                      value={vehicle.fuelLevel}
                      sx={{
                        width: '100%',
                        height: 6,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          bgcolor: vehicle.fuelLevel > 20 ? 'primary.main' : 'error.main'
                        }
                      }}
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {vehicle.fuelLevel}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Odometer
                  </Typography>
                  <Typography variant="body2">
                    {vehicle.odometer.toLocaleString()} mi
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Last Location
                </Typography>
                <Typography variant="body2" noWrap>
                  {vehicle.lastLocation?.name || 'Unknown'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Fleet Summary Charts */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Fleet Summary
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 340,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
          >
            <Typography variant="h6" gutterBottom>
              Vehicle Status
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut data={vehicleChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 340,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
          >
            <Typography variant="h6" gutterBottom>
              Driver Status
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut data={driverChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 340,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
          >
            <Typography variant="h6" gutterBottom>
              Maintenance Status
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut data={maintenanceChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Cost Analysis and Trends */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 380,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Cost Analysis
              </Typography>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="time-range-label">Time Range</InputLabel>
                <Select
                  labelId="time-range-label"
                  id="time-range-select"
                  value={timeRange}
                  label="Time Range"
                  onChange={(e) => setTimeRange(e.target.value)}
                  displayEmpty
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="quarter">This Quarter</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Bar data={costData} options={barOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 380,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
          >
            <Typography variant="h6" gutterBottom>
              Fuel Efficiency Trend
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Line data={fuelEfficiencyData} options={lineOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Maintenance */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Recent Maintenance
      </Typography>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          mb: 4
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Vehicle</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentMaintenance.map((record) => (
                <TableRow key={record._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={`/vehicles/vehicle-${(parseInt(record._id.slice(-1)) % 6) + 1}.jpg`}
                        variant="rounded"
                        sx={{ width: 40, height: 40, borderRadius: 1, mr: 2 }}
                      />
                      <Typography variant="body2">{record.vehicle}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.status}
                      size="small"
                      sx={{
                        backgroundColor: 
                          record.status === 'completed' ? alpha(theme.palette.success.main, 0.1) :
                          record.status === 'scheduled' ? alpha(theme.palette.info.main, 0.1) :
                          record.status === 'in progress' ? alpha(theme.palette.warning.main, 0.1) :
                          alpha(theme.palette.error.main, 0.1),
                        color: 
                          record.status === 'completed' ? theme.palette.success.main :
                          record.status === 'scheduled' ? theme.palette.info.main :
                          record.status === 'in progress' ? theme.palette.warning.main :
                          theme.palette.error.main,
                        borderRadius: 1,
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  <TableCell>${record.cost.toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <Button
            variant="text"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/maintenance')}
          >
            View All Maintenance Records
          </Button>
        </Box>
      </Paper>

      {/* Recent Notifications */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Recent Notifications
      </Typography>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          mb: 4
        }}
      >
        <List sx={{ p: 0 }}>
          {notifications.map((notification) => (
            <React.Fragment key={notification._id}>
              <ListItem
                alignItems="flex-start"
                sx={{ py: 2 }}
                secondaryAction={
                  <IconButton edge="end" size="small">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: 
                        notification.type === 'alert' ? alpha(theme.palette.error.main, 0.1) :
                        notification.type === 'warning' ? alpha(theme.palette.warning.main, 0.1) :
                        alpha(theme.palette.info.main, 0.1),
                      color: 
                        notification.type === 'alert' ? theme.palette.error.main :
                        notification.type === 'warning' ? theme.palette.warning.main :
                        theme.palette.info.main
                    }}
                  >
                    {notification.type === 'alert' ? <ErrorOutlineIcon /> :
                     notification.type === 'warning' ? <WarningAmberIcon /> :
                     <InfoOutlinedIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2">
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <Button
            variant="text"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/notifications')}
          >
            View All Notifications
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;
