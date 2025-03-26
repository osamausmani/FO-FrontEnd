import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  IconButton,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  CircularProgress,
  SelectChangeEvent,
  Tooltip,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

// Icons
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import ClearIcon from '@mui/icons-material/Clear';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import RouteIcon from '@mui/icons-material/Route';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import DatasetIcon from '@mui/icons-material/Dataset';

import apiService from '../../utils/api';
import { LogEntry, LogEntityType, LogActionType, LogFilterParams } from '../../types/logs';
import { toast } from 'react-toastify';

// Helper function to get icon for entity type
const getEntityIcon = (entityType: LogEntityType) => {
  switch (entityType) {
    case 'vehicle':
      return <DirectionsCarIcon />;
    case 'driver':
      return <PersonIcon />;
    case 'maintenance':
      return <BuildIcon />;
    case 'fuel':
      return <LocalGasStationIcon />;
    case 'route':
      return <RouteIcon />;
    case 'notification':
      return <NotificationsIcon />;
    case 'user':
      return <PersonIcon />;
    case 'setting':
      return <SettingsIcon />;
    case 'report':
      return <AssessmentIcon />;
    default:
      return <InfoIcon />;
  }
};

// Helper function to get icon for action type
const getActionIcon = (action: LogActionType) => {
  switch (action) {
    case 'create':
      return <AddCircleIcon />;
    case 'update':
      return <EditIcon />;
    case 'delete':
      return <DeleteIcon />;
    case 'view':
      return <VisibilityIcon />;
    case 'assign':
      return <AssignmentIcon />;
    case 'complete':
      return <CheckCircleIcon />;
    case 'cancel':
      return <CancelIcon />;
    case 'login':
      return <LoginIcon />;
    case 'logout':
      return <LogoutIcon />;
    case 'export':
      return <DownloadIcon />;
    default:
      return <InfoIcon />;
  }
};

// Helper function to get color for action type
const getActionColor = (action: LogActionType) => {
  switch (action) {
    case 'create':
      return 'success';
    case 'update':
      return 'info';
    case 'delete':
      return 'error';
    case 'view':
      return 'default';
    case 'assign':
      return 'primary';
    case 'complete':
      return 'success';
    case 'cancel':
      return 'warning';
    case 'login':
      return 'primary';
    case 'logout':
      return 'default';
    case 'export':
      return 'info';
    default:
      return 'default';
  }
};

const ActivityLogs: React.FC = () => {
  // State for logs data
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  
  // State for pagination
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  
  // State for filters
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<LogFilterParams>({
    page: 1,
    limit: 25
  });
  
  // State for date range
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  // Fetch logs from API
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await apiService.getLogs(filters);
      if (response.data && response.data.data) {
        setLogs(response.data.data);
        setTotal(response.data.total || 0);
      } else {
        setLogs([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to fetch logs');
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };
  
  // Handle page change
  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage + 1); // Convert from 0-based to 1-based for API
    handleFilterChange('page', newPage + 1);
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: pageSize
    });
    setStartDate(null);
    setEndDate(null);
  };
  
  // Handle export logs
  const handleExport = async () => {
    try {
      const response = await apiService.exportLogs(filters);
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `activity_logs_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };
  
  // Handle seeding the database with logs
  const handleSeedDatabase = async () => {
    setLoading(true);
    try {
      await apiService.seedLogs();
      toast.success('Successfully seeded database with logs');
      fetchLogs(); // Refresh logs after seeding
    } catch (error) {
      console.error('Error seeding database:', error);
      toast.error('Failed to seed database with logs');
    } finally {
      setLoading(false);
    }
  };
  
  // Effect to fetch logs when filters change
  useEffect(() => {
    fetchLogs();
  }, [filters]);
  
  // Effect to update date filters when date range changes
  useEffect(() => {
    if (startDate) {
      handleFilterChange('startDate', format(startDate, 'yyyy-MM-dd'));
    }
    
    if (endDate) {
      handleFilterChange('endDate', format(endDate, 'yyyy-MM-dd'));
    }
  }, [startDate, endDate]);
  
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Activity Logs
          </Typography>
          
          <Box>
            <Tooltip title="Toggle Filters">
              <IconButton onClick={() => setShowFilters(!showFilters)}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton onClick={() => fetchLogs()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export">
              <IconButton onClick={handleExport}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Seed Database">
              <IconButton onClick={handleSeedDatabase}>
                <DatasetIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {showFilters && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Search"
                  fullWidth
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search by entity name or details"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Entity Type</InputLabel>
                  <Select
                    value={filters.entityType || ''}
                    label="Entity Type"
                    onChange={(e: SelectChangeEvent) => handleFilterChange('entityType', e.target.value)}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="vehicle">Vehicle</MenuItem>
                    <MenuItem value="driver">Driver</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="fuel">Fuel</MenuItem>
                    <MenuItem value="route">Route</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="notification">Notification</MenuItem>
                    <MenuItem value="setting">Setting</MenuItem>
                    <MenuItem value="report">Report</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Action</InputLabel>
                  <Select
                    value={filters.action || ''}
                    label="Action"
                    onChange={(e: SelectChangeEvent) => handleFilterChange('action', e.target.value)}
                  >
                    <MenuItem value="">All Actions</MenuItem>
                    <MenuItem value="create">Create</MenuItem>
                    <MenuItem value="update">Update</MenuItem>
                    <MenuItem value="delete">Delete</MenuItem>
                    <MenuItem value="view">View</MenuItem>
                    <MenuItem value="assign">Assign</MenuItem>
                    <MenuItem value="complete">Complete</MenuItem>
                    <MenuItem value="cancel">Cancel</MenuItem>
                    <MenuItem value="login">Login</MenuItem>
                    <MenuItem value="logout">Logout</MenuItem>
                    <MenuItem value="export">Export</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small"
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small"
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                  fullWidth
                  sx={{ height: '40px' }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Entity Type</TableCell>
                    <TableCell>Entity Name</TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell>IP Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log._id || log.id}>
                      <TableCell>{format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon sx={{ mr: 1, fontSize: 18 }} />
                          <Typography variant="body2">
                            {log.user?.name || 'System'}
                            {log.user?.role && (
                              <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                                ({log.user.role})
                              </Typography>
                            )}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={getActionIcon(log.action as LogActionType)}
                          label={log.action.replace('_', ' ')}
                          size="small"
                          color={getActionColor(log.action as LogActionType) as any}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={getEntityIcon(log.entityType as LogEntityType)}
                          label={log.entityType.replace('_', ' ')}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{log.entityName || log.entityId}</TableCell>
                      <TableCell>{log.details || '-'}</TableCell>
                      <TableCell>{log.ipAddress || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, px: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {logs.length} of {total} results
              </Typography>
              
              <TablePagination
                component="div"
                count={total}
                page={page - 1}
                onPageChange={handlePageChange}
                rowsPerPage={pageSize}
                onRowsPerPageChange={(e) => {
                  setPageSize(parseInt(e.target.value, 10));
                  handleFilterChange('limit', parseInt(e.target.value, 10));
                  setPage(1);
                }}
                rowsPerPageOptions={[10, 25, 50, 100]}
              />
            </Box>
          </>
        )}
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Activity Summary
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Most Active Users
                </Typography>
                {/* Add user activity chart or list here */}
                <Typography variant="body2" color="text.secondary">
                  User activity data will be displayed here
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Activity by Entity Type
                </Typography>
                {/* Add entity type chart here */}
                <Typography variant="body2" color="text.secondary">
                  Entity type distribution will be displayed here
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Activity Timeline
                </Typography>
                {/* Add timeline chart here */}
                <Typography variant="body2" color="text.secondary">
                  Activity timeline will be displayed here
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ActivityLogs;
