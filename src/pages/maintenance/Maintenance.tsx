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
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import apiService from '../../utils/api';
import { toast } from 'react-toastify';
import { MaintenanceRecord, MaintenanceStats, PaginationModel, Vehicle } from '../../types/maintenance';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BuildIcon from '@mui/icons-material/Build';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventIcon from '@mui/icons-material/Event';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AssignmentIcon from '@mui/icons-material/Assignment';

const Maintenance: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('');
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState<number>(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState<MaintenanceStats>({
    total: 0,
    scheduled: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  });

  // Fetch maintenance records
  const fetchMaintenanceRecords = async (): Promise<void> => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sort: 'scheduledDate'
      };

      // Add search term if present
      if (searchTerm) {
        params.search = searchTerm;
      }

      // Add filters if not default
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (typeFilter !== 'all') {
        params.type = typeFilter;
      }

      if (priorityFilter !== 'all') {
        params.priority = priorityFilter;
      }

      if (vehicleFilter) {
        params.vehicle = vehicleFilter;
      }

      const response = await apiService.getMaintenanceRecords(params);
      setMaintenanceRecords(response.data.data);
      setTotalRows(response.data.pagination?.total || 0);
      
      // Calculate stats
      const allRecords = await apiService.getMaintenanceRecords({ limit: 1000 });
      const records = allRecords.data.data;
      
      setStats({
        total: records.length,
        scheduled: records.filter(r => r.status === 'scheduled').length,
        inProgress: records.filter(r => r.status === 'in_progress').length,
        completed: records.filter(r => r.status === 'completed').length,
        overdue: records.filter(r => r.status === 'overdue').length
      });
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      toast.error('Failed to load maintenance records');
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async (): Promise<void> => {
    try {
      const response = await apiService.getVehicles({ limit: 100 });
      setVehicles(response.data.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  useEffect(() => {
    fetchMaintenanceRecords();
    fetchVehicles();
  }, [paginationModel.page, paginationModel.pageSize]);

  // Handle search
  const handleSearch = (): void => {
    setPaginationModel({ ...paginationModel, page: 0 });
    fetchMaintenanceRecords();
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle filter menu
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>): void => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterClose = (): void => {
    setFilterMenuAnchor(null);
  };

  const handleStatusFilterChange = (status: string): void => {
    setStatusFilter(status);
    setPaginationModel({ ...paginationModel, page: 0 });
    fetchMaintenanceRecords();
  };

  const handleTypeFilterChange = (type: string): void => {
    setTypeFilter(type);
    setPaginationModel({ ...paginationModel, page: 0 });
    fetchMaintenanceRecords();
  };

  const handlePriorityFilterChange = (priority: string): void => {
    setPriorityFilter(priority);
    setPaginationModel({ ...paginationModel, page: 0 });
    fetchMaintenanceRecords();
  };

  const handleVehicleFilterChange = (vehicle: string): void => {
    setVehicleFilter(vehicle);
    setPaginationModel({ ...paginationModel, page: 0 });
    fetchMaintenanceRecords();
  };

  const handleClearFilters = (): void => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setPriorityFilter('all');
    setVehicleFilter('');
    setPaginationModel({ ...paginationModel, page: 0 });
    fetchMaintenanceRecords();
  };

  // Handle action menu
  const handleActionClick = (event: React.MouseEvent<HTMLElement>, record: MaintenanceRecord): void => {
    event.stopPropagation();
    setSelectedRecord(record);
    setActionMenuAnchor(event.currentTarget);
  };

  const handleActionClose = (): void => {
    setActionMenuAnchor(null);
  };

  // Handle delete
  const handleDeleteClick = (): void => {
    handleActionClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = (): void => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!selectedRecord) return;
    
    try {
      setDeleteLoading(true);
      await apiService.deleteMaintenanceRecord(selectedRecord._id);
      toast.success('Maintenance record deleted successfully');
      fetchMaintenanceRecords();
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
      toast.error('Failed to delete maintenance record');
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  // Helper functions for rendering
  const getStatusColor = (status: string): 'info' | 'primary' | 'success' | 'default' | 'error' => {
    switch (status) {
      case 'scheduled':
        return 'info';
      case 'in_progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'default';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string): 'success' | 'info' | 'warning' | 'error' | 'default' => {
    switch (priority) {
      case 'low':
        return 'success';
      case 'medium':
        return 'info';
      case 'high':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: string): JSX.Element => {
    switch (type) {
      case 'routine':
        return <ScheduleIcon fontSize="small" />;
      case 'repair':
        return <BuildIcon fontSize="small" />;
      case 'inspection':
        return <AssignmentIcon fontSize="small" />;
      case 'emergency':
        return <WarningIcon fontSize="small" />;
      case 'recall':
        return <WarningIcon fontSize="small" />;
      default:
        return <BuildIcon fontSize="small" />;
    }
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    { 
      field: 'title', 
      headerName: 'Maintenance Info', 
      flex: 1, 
      minWidth: 200,
      renderCell: (params: GridRenderCellParams<MaintenanceRecord>) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ mr: 1, color: 'primary.main' }}>
            {getTypeIcon(params.row.type)}
          </Box>
          <Box>
            <Typography variant="body2">{params.row.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.type.charAt(0).toUpperCase() + params.row.type.slice(1)}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { 
      field: 'vehicle', 
      headerName: 'Vehicle', 
      flex: 1, 
      minWidth: 180,
      renderCell: (params: GridRenderCellParams<MaintenanceRecord>) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DirectionsCarIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 'small' }} />
          <Box>
            <Typography variant="body2">
              {params.row.vehicle ? `${params.row.vehicle.make} ${params.row.vehicle.model}` : 'Unknown'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.vehicle ? params.row.vehicle.licensePlate : ''}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { 
      field: 'scheduledDate', 
      headerName: 'Schedule', 
      width: 180,
      renderCell: (params: GridRenderCellParams<MaintenanceRecord>) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">
              {new Date(params.row.scheduledDate).toLocaleDateString()}
            </Typography>
          </Box>
          {params.row.completedDate && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="caption">
                Completed: {new Date(params.row.completedDate).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </Box>
      ),
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      renderCell: (params: GridRenderCellParams<MaintenanceRecord>) => (
        <Chip
          label={params.value.replace('_', ' ')}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    { 
      field: 'priority', 
      headerName: 'Priority', 
      width: 120,
      renderCell: (params: GridRenderCellParams<MaintenanceRecord>) => (
        <Chip
          icon={<PriorityHighIcon />}
          label={params.value}
          color={getPriorityColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<MaintenanceRecord>) => (
        <IconButton
          onClick={(event) => handleActionClick(event, params.row)}
          size="small"
        >
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Maintenance</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/maintenance/new')}
        >
          Add Maintenance Record
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total
              </Typography>
              <Typography variant="h4">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" color="info.main" gutterBottom>
                Scheduled
              </Typography>
              <Typography variant="h4">{stats.scheduled}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" color="primary.main" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h4">{stats.inProgress}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" color="success.main" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4">{stats.completed}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" color="error.main" gutterBottom>
                Overdue
              </Typography>
              <Typography variant="h4">{stats.overdue}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            placeholder="Search maintenance records..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchTerm('');
                      if (searchTerm) {
                        setPaginationModel({ ...paginationModel, page: 0 });
                        fetchMaintenanceRecords();
                      }
                    }}
                  >
                    ×
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            color={statusFilter !== 'all' || typeFilter !== 'all' || priorityFilter !== 'all' || vehicleFilter ? 'primary' : 'inherit'}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchMaintenanceRecords}
          >
            Refresh
          </Button>
        </Box>

        {/* Filter buttons for quick filtering */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant={statusFilter === 'all' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => handleStatusFilterChange('all')}
          >
            All Statuses
          </Button>
          <Button
            variant={statusFilter === 'scheduled' ? 'contained' : 'outlined'}
            size="small"
            color="info"
            onClick={() => handleStatusFilterChange('scheduled')}
          >
            Scheduled
          </Button>
          <Button
            variant={statusFilter === 'in_progress' ? 'contained' : 'outlined'}
            size="small"
            color="primary"
            onClick={() => handleStatusFilterChange('in_progress')}
          >
            In Progress
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'contained' : 'outlined'}
            size="small"
            color="success"
            onClick={() => handleStatusFilterChange('completed')}
          >
            Completed
          </Button>
          <Button
            variant={statusFilter === 'overdue' ? 'contained' : 'outlined'}
            size="small"
            color="error"
            onClick={() => handleStatusFilterChange('overdue')}
          >
            Overdue
          </Button>
        </Box>

        {/* Data grid */}
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={maintenanceRecords}
            columns={columns}
            getRowId={(row) => row._id}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50]}
            rowCount={totalRows}
            paginationMode="server"
            loading={loading}
            disableRowSelectionOnClick
            onRowClick={(params) => navigate(`/maintenance/${params.id}`)}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: false,
                printOptions: { disableToolbarButton: true },
              },
            }}
            sx={{
              '& .MuiDataGrid-row:hover': {
                cursor: 'pointer',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          />
        </Box>
      </Paper>

      {/* Filter menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleFilterClose}
      >
        <MenuItem>
          <Typography variant="subtitle1">Filter by Type</Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => handleTypeFilterChange('all')}
          selected={typeFilter === 'all'}
        >
          <ListItemText>All Types</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleTypeFilterChange('routine')}
          selected={typeFilter === 'routine'}
        >
          <ListItemIcon>
            <ScheduleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Routine</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleTypeFilterChange('repair')}
          selected={typeFilter === 'repair'}
        >
          <ListItemIcon>
            <BuildIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Repair</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleTypeFilterChange('inspection')}
          selected={typeFilter === 'inspection'}
        >
          <ListItemIcon>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Inspection</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handleTypeFilterChange('emergency')}
          selected={typeFilter === 'emergency'}
        >
          <ListItemIcon>
            <WarningIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Emergency</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Typography variant="subtitle1">Filter by Priority</Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => handlePriorityFilterChange('all')}
          selected={priorityFilter === 'all'}
        >
          <ListItemText>All Priorities</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handlePriorityFilterChange('low')}
          selected={priorityFilter === 'low'}
        >
          <ListItemIcon>
            <Chip label="Low" color="success" size="small" />
          </ListItemIcon>
          <ListItemText>Low</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handlePriorityFilterChange('medium')}
          selected={priorityFilter === 'medium'}
        >
          <ListItemIcon>
            <Chip label="Medium" color="info" size="small" />
          </ListItemIcon>
          <ListItemText>Medium</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handlePriorityFilterChange('high')}
          selected={priorityFilter === 'high'}
        >
          <ListItemIcon>
            <Chip label="High" color="warning" size="small" />
          </ListItemIcon>
          <ListItemText>High</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => handlePriorityFilterChange('critical')}
          selected={priorityFilter === 'critical'}
        >
          <ListItemIcon>
            <Chip label="Critical" color="error" size="small" />
          </ListItemIcon>
          <ListItemText>Critical</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Typography variant="subtitle1">Filter by Vehicle</Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => handleVehicleFilterChange('')}
          selected={vehicleFilter === ''}
        >
          <ListItemText>All Vehicles</ListItemText>
        </MenuItem>
        {vehicles.map((vehicle) => (
          <MenuItem 
            key={vehicle._id} 
            onClick={() => handleVehicleFilterChange(vehicle._id)}
            selected={vehicleFilter === vehicle._id}
          >
            <ListItemIcon>
              <DirectionsCarIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{vehicle.make} {vehicle.model} ({vehicle.licensePlate})</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleClearFilters}>
          <ListItemIcon>
            <RefreshIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Clear All Filters</ListItemText>
        </MenuItem>
      </Menu>

      {/* Action menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionClose}
      >
        <MenuItem onClick={() => {
          handleActionClose();
          if (selectedRecord) {
            navigate(`/maintenance/${selectedRecord._id}`);
          }
        }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleActionClose();
          if (selectedRecord) {
            navigate(`/maintenance/${selectedRecord._id}/edit`);
          }
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          handleActionClose();
          if (selectedRecord?.vehicle?._id) {
            navigate(`/vehicles/${selectedRecord.vehicle._id}`);
          } else {
            toast.info('No vehicle associated with this record');
          }
        }}>
          <ListItemIcon>
            <DirectionsCarIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Vehicle</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Maintenance Record</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the maintenance record "{selectedRecord?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Maintenance;
