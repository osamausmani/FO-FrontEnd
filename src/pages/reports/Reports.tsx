import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  TextField,
  Tab,
  Tabs,
  SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, subMonths } from 'date-fns';
import apiService from '../../utils/api';
import { toast } from 'react-toastify';

// Chart components
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Icons
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import BuildIcon from '@mui/icons-material/Build';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import RouteIcon from '@mui/icons-material/Route';
import BarChartIcon from '@mui/icons-material/BarChart';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
);

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface Vehicle {
  _id: string;
  name: string;
  status?: string;
  assignedVehicle?: string;
}

interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
  status?: string;
  assignedVehicle?: string;
}

interface VehicleStats {
  total: number;
  active: number;
  maintenance: number;
  inactive: number;
}

interface DriverStats {
  total: number;
  active: number;
  inactive: number;
  assigned: number;
}

interface MaintenanceStats {
  total: number;
  pending: number;
  completed: number;
  totalCost: number;
}

interface FuelStats {
  totalRecords: number;
  totalLiters: number;
  totalCost: number;
  avgEfficiency: number;
}

interface ReportData {
  vehicleStats?: VehicleStats;
  driverStats?: DriverStats;
  maintenance?: MaintenanceStats;
  fuel?: FuelStats;
  [key: string]: any;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill?: boolean;
    borderColor?: string;
    backgroundColor?: string | string[];
    tension?: number;
    borderWidth?: number;
  }[];
}

const Reports: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: subMonths(new Date(), 1),
    endDate: new Date()
  });
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [driverFilter, setDriverFilter] = useState<string>('all');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  // Fetch vehicles and drivers for filter dropdowns
  useEffect(() => {
    const fetchFilterData = async (): Promise<void> => {
      try {
        const vehiclesResponse = await apiService.getVehicles({ limit: 100 });
        setVehicles(vehiclesResponse.data.data);
        
        const driversResponse = await apiService.getDrivers({ limit: 100 });
        setDrivers(driversResponse.data.data);
      } catch (error) {
        console.error('Error fetching filter data:', error);
        toast.error('Failed to load filter data');
      }
    };
    
    fetchFilterData();
  }, []);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue);
    // Reset report data when changing tabs
    setReportData(null);
  };

  // Generate report based on current tab and filters
  const generateReport = async (): Promise<void> => {
    setLoading(true);
    try {
      const params = {
        startDate: format(dateRange.startDate, 'yyyy-MM-dd'),
        endDate: format(dateRange.endDate, 'yyyy-MM-dd'),
        vehicle: vehicleFilter !== 'all' ? vehicleFilter : undefined,
        driver: driverFilter !== 'all' ? driverFilter : undefined
      };
      
      let response;
      switch (tabValue) {
        case 0: // Vehicle Utilization
          response = await apiService.getVehicleUtilization(params);
          break;
        case 1: // Fuel Consumption
          response = await apiService.getFuelConsumption(params);
          break;
        case 2: // Maintenance Cost
          response = await apiService.getMaintenanceCost(params);
          break;
        case 3: // Driver Performance
          response = await apiService.getDriverPerformance(params);
          break;
        case 4: // Fleet Summary
          // For Fleet Summary, we need to fetch multiple datasets
          const summaryResponse = await apiService.getFleetSummary();
          const driverStatsResponse = await apiService.getDriverStats();
          
          // Combine the responses
          response = {
            data: {
              ...summaryResponse.data,
              driverStats: driverStatsResponse.data
            }
          };
          break;
        default:
          response = await apiService.getFleetSummary();
      }
      
      setReportData(response.data);
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  // Download report (placeholder function)
  const downloadReport = (): void => {
    toast.info('Report download functionality will be implemented soon');
  };

  // Sample chart data (placeholder)
  const sampleLineChartData: ChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Vehicle Usage',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const sampleBarChartData: ChartData = {
    labels: ['Vehicle 1', 'Vehicle 2', 'Vehicle 3', 'Vehicle 4', 'Vehicle 5'],
    datasets: [
      {
        label: 'Fuel Consumption (L)',
        data: [120, 190, 30, 50, 200],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Distance (km)',
        data: [200, 300, 100, 150, 400],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const samplePieChartData: ChartData = {
    labels: ['Maintenance', 'Fuel', 'Insurance', 'Other'],
    datasets: [
      {
        label: 'Expenses',
        data: [300, 500, 200, 100],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Reports & Analytics</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={generateReport}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Generate Report
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadReport}
            disabled={loading || !reportData}
          >
            Download
          </Button>
        </Box>
      </Box>

      {/* Report Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={dateRange.startDate}
                onChange={(newValue: Date | null) => newValue && setDateRange({ ...dateRange, startDate: newValue })}
                slots={{
                  textField: (params: any) => <TextField {...params} fullWidth />
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={dateRange.endDate}
                onChange={(newValue: Date | null) => newValue && setDateRange({ ...dateRange, endDate: newValue })}
                slots={{
                  textField: (params: any) => <TextField {...params} fullWidth />
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="vehicle-filter-label">Vehicle</InputLabel>
              <Select
                labelId="vehicle-filter-label"
                value={vehicleFilter}
                label="Vehicle"
                onChange={(e: SelectChangeEvent) => setVehicleFilter(e.target.value)}
              >
                <MenuItem value="all">All Vehicles</MenuItem>
                {vehicles.map((vehicle) => (
                  <MenuItem key={vehicle._id} value={vehicle._id}>
                    {vehicle.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="driver-filter-label">Driver</InputLabel>
              <Select
                labelId="driver-filter-label"
                value={driverFilter}
                label="Driver"
                onChange={(e: SelectChangeEvent) => setDriverFilter(e.target.value)}
              >
                <MenuItem value="all">All Drivers</MenuItem>
                {drivers.map((driver) => (
                  <MenuItem key={driver._id} value={driver._id}>
                    {driver.firstName} {driver.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Report Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<DirectionsCarIcon />} label="Vehicle Utilization" />
          <Tab icon={<LocalGasStationIcon />} label="Fuel Consumption" />
          <Tab icon={<BuildIcon />} label="Maintenance Cost" />
          <Tab icon={<PersonIcon />} label="Driver Performance" />
          <Tab icon={<BarChartIcon />} label="Fleet Summary" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {/* Tab content */}
              {tabValue === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Vehicle Utilization Report</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      This report shows how your vehicles are being utilized over time, including distance traveled, hours of operation, and idle time.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Card>
                      <CardHeader title="Distance Traveled Over Time" />
                      <Divider />
                      <CardContent>
                        <Box sx={{ height: 300 }}>
                          <Line 
                            data={sampleLineChartData} 
                            options={{ maintainAspectRatio: false }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                      <CardHeader title="Utilization by Vehicle" />
                      <Divider />
                      <CardContent>
                        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Pie 
                            data={samplePieChartData} 
                            options={{ maintainAspectRatio: false }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {tabValue === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Fuel Consumption Report</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      This report analyzes fuel consumption patterns, costs, and efficiency metrics for your fleet.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="Fuel Consumption vs Distance" />
                      <Divider />
                      <CardContent>
                        <Box sx={{ height: 400 }}>
                          <Bar 
                            data={sampleBarChartData} 
                            options={{ maintainAspectRatio: false }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {tabValue === 2 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Maintenance Cost Report</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      This report tracks maintenance expenses, service history, and identifies potential cost-saving opportunities.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardHeader title="Maintenance Costs Over Time" />
                      <Divider />
                      <CardContent>
                        <Box sx={{ height: 300 }}>
                          <Line 
                            data={sampleLineChartData} 
                            options={{ maintainAspectRatio: false }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardHeader title="Maintenance Cost Breakdown" />
                      <Divider />
                      <CardContent>
                        <Box sx={{ height: 300 }}>
                          <Pie 
                            data={samplePieChartData} 
                            options={{ maintainAspectRatio: false }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {tabValue === 3 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Driver Performance Report</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      This report evaluates driver behavior, efficiency, and safety metrics to optimize fleet operations.
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="Driver Performance Comparison" />
                      <Divider />
                      <CardContent>
                        <Box sx={{ height: 400 }}>
                          <Bar 
                            data={sampleBarChartData} 
                            options={{ maintainAspectRatio: false }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {tabValue === 4 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Fleet Summary Report</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      This report provides a comprehensive overview of your entire fleet's performance, costs, and utilization.
                    </Typography>
                  </Grid>
                  
                  {/* Summary Stats Cards */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Fleet Overview</Typography>
                    <Grid container spacing={3}>
                      {/* Vehicles Stats */}
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h3" color="primary" sx={{ mb: 1 }}>
                            {reportData?.vehicleStats?.total || vehicles.length}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Total Vehicles
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h3" color="success.main" sx={{ mb: 1 }}>
                            {reportData?.vehicleStats?.active || vehicles.filter(v => v.status === 'active').length}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Active Vehicles
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h3" color="error.main" sx={{ mb: 1 }}>
                            {reportData?.vehicleStats?.maintenance || vehicles.filter(v => v.status === 'maintenance').length}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            In Maintenance
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h3" color="warning.main" sx={{ mb: 1 }}>
                            {reportData?.vehicleStats?.inactive || vehicles.filter(v => v.status === 'inactive').length}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Inactive Vehicles
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Driver Stats */}
                  <Grid item xs={12} sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Driver Overview</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h3" color="primary" sx={{ mb: 1 }}>
                            {reportData?.driverStats?.total || drivers.length}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Total Drivers
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h3" color="success.main" sx={{ mb: 1 }}>
                            {reportData?.driverStats?.active || drivers.filter(d => d.status === 'active').length}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Active Drivers
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h3" color="error.main" sx={{ mb: 1 }}>
                            {reportData?.driverStats?.inactive || drivers.filter(d => d.status === 'inactive').length}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Inactive Drivers
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h3" color="info.main" sx={{ mb: 1 }}>
                            {reportData?.driverStats?.assigned || drivers.filter(d => d.assignedVehicle).length}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Assigned Drivers
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Maintenance Stats */}
                  <Grid item xs={12} sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Maintenance Overview</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h3" color="primary" sx={{ mb: 1 }}>
                            {reportData?.maintenance?.total || 0}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Total Maintenance Records
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h3" color="warning.main" sx={{ mb: 1 }}>
                            {reportData?.maintenance?.pending || 0}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Pending Maintenance
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h3" color="success.main" sx={{ mb: 1 }}>
                            {reportData?.maintenance?.completed || 0}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Completed Maintenance
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h3" color="error.main" sx={{ mb: 1 }}>
                            ${reportData?.maintenance?.totalCost?.toLocaleString() || 0}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Total Maintenance Cost
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Fuel Stats */}
                  <Grid item xs={12} sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Fuel Overview</Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h3" color="primary" sx={{ mb: 1 }}>
                            {reportData?.fuel?.totalRecords || 0}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Total Fuel Records
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h3" color="info.main" sx={{ mb: 1 }}>
                            {reportData?.fuel?.totalLiters || 0} L
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Total Fuel Consumed
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h3" color="error.main" sx={{ mb: 1 }}>
                            ${reportData?.fuel?.totalCost?.toLocaleString() || 0}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Total Fuel Cost
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="h3" color="success.main" sx={{ mb: 1 }}>
                            {reportData?.fuel?.avgEfficiency || 0} km/L
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Average Fuel Efficiency
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={6} sx={{ mt: 3 }}>
                    <Card>
                      <CardHeader title="Fleet Expenses Breakdown" />
                      <Divider />
                      <CardContent>
                        <Box sx={{ height: 300 }}>
                          <Pie 
                            data={samplePieChartData} 
                            options={{ maintainAspectRatio: false }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ mt: 3 }}>
                    <Card>
                      <CardHeader title="Monthly Fleet Costs" />
                      <Divider />
                      <CardContent>
                        <Box sx={{ height: 300 }}>
                          <Line 
                            data={sampleLineChartData} 
                            options={{ maintainAspectRatio: false }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
              {!reportData && !loading && tabValue !== 4 && (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <Typography variant="body1" color="text.secondary">
                    Select your filters and click "Generate Report" to view data
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Reports;
