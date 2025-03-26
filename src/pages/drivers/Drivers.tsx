import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  SelectChangeEvent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiService from '../../utils/api';
import { toast } from 'react-toastify';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  dateOfHire: string;
  status: string;
  vehicle?: string;
}

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  licensePlate: string;
}

interface DriverParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

const Drivers: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    fetchDrivers();
    fetchVehicles();
  }, [page, rowsPerPage, searchQuery, filterStatus]);

  const fetchDrivers = async (): Promise<void> => {
    setLoading(true);
    try {
      const params: DriverParams = {
        page: page + 1,
        limit: rowsPerPage,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }

      const response = await apiService.getDrivers(params);
      setDrivers(response.data.data);
      setTotalCount(response.data.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error('Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async (): Promise<void> => {
    try {
      const response = await apiService.getVehicles();
      setVehicles(response.data.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event: SelectChangeEvent): void => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  const handleClearFilters = (): void => {
    setSearchQuery('');
    setFilterStatus('all');
    setPage(0);
  };

  const handleDeleteClick = (driver: Driver): void => {
    setDriverToDelete(driver);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!driverToDelete) return;
    
    try {
      await apiService.deleteDriver(driverToDelete._id);
      toast.success('Driver deleted successfully');
      fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('Failed to delete driver');
    } finally {
      setDeleteDialogOpen(false);
      setDriverToDelete(null);
    }
  };

  const handleDeleteCancel = (): void => {
    setDeleteDialogOpen(false);
    setDriverToDelete(null);
  };

  const getVehicleForDriver = (driverId: string): string => {
    const driver = drivers.find(d => d._id === driverId);
    if (driver && driver.vehicle) {
      const vehicle = vehicles.find(v => v._id === driver.vehicle);
      return vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})` : 'Unknown Vehicle';
    }
    return 'No Vehicle Assigned';
  };

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'on_leave':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Drivers</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/drivers/add')}
        >
          Add Driver
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search Drivers"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchQuery('')} edge="end">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={filterStatus}
                onChange={handleFilterChange}
                label="Status"
                startAdornment={<FilterListIcon sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="on_leave">On Leave</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              disabled={!searchQuery && filterStatus === 'all'}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        {loading && drivers.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>License</TableCell>
                    <TableCell>Vehicle</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {drivers.length > 0 ? (
                    drivers.map((driver) => (
                      <TableRow key={driver._id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Box>
                              <Typography variant="body1">
                                {driver.firstName} {driver.lastName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(driver.dateOfHire).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">{driver.phone}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">{driver.email}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <BadgeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">{driver.licenseNumber}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                Exp: {new Date(driver.licenseExpiry).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <DirectionsCarIcon sx={{ mr: 1, color: driver.vehicle ? 'primary.main' : 'text.disabled' }} />
                            <Typography variant="body2">
                              {getVehicleForDriver(driver._id)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={driver.status.replace('_', ' ')}
                            color={getStatusColor(driver.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit Driver">
                            <IconButton
                              color="primary"
                              onClick={() => navigate(`/drivers/${driver._id}/edit`)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Driver">
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteClick(driver)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body1" sx={{ py: 2 }}>
                          No drivers found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Driver</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {driverToDelete?.firstName} {driverToDelete?.lastName}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Drivers;
