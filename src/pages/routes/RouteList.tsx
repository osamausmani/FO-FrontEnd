import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
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
  DialogTitle
} from '@mui/material';
import { DataGrid, GridToolbar, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../../utils/api';
import { toast } from 'react-toastify';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RouteIcon from '@mui/icons-material/Route';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Vehicle {
  _id: string;
  name: string;
}

interface Route {
  _id: string;
  name: string;
  scheduledStartTime: string;
  vehicle?: Vehicle;
  driver?: Driver;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  distance?: number;
}

interface LocationState {
  vehicleId?: string;
}

interface PaginationModel {
  page: number;
  pageSize: number;
}

interface RouteParams {
  page: number;
  limit: number;
  sort: string;
  search?: string;
  status?: string;
  vehicle?: string;
}

const RouteList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<HTMLElement | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>(locationState?.vehicleId || 'all');
  const [actionMenuAnchor, setActionMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState<number>(0);

  // Fetch routes
  const fetchRoutes = async (): Promise<void> => {
    try {
      setLoading(true);
      const params: RouteParams = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sort: '-scheduledStartTime'
      };

      // Add search term if present
      if (searchTerm) {
        params.search = searchTerm;
      }

      // Add status filter if not 'all'
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      // Add vehicle filter if not 'all'
      if (vehicleFilter !== 'all') {
        params.vehicle = vehicleFilter;
      }

      const response = await apiService.getRoutes(params);
      setRoutes(response.data.data);
      setTotalRows(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching routes:', error);
      toast.error('Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [paginationModel.page, paginationModel.pageSize, statusFilter, vehicleFilter]);

  // Handle search
  const handleSearch = (): void => {
    setPaginationModel({ ...paginationModel, page: 0 });
    fetchRoutes();
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle filter menu
  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterClose = (): void => {
    setFilterMenuAnchor(null);
  };

  const handleStatusFilterChange = (status: string): void => {
    setStatusFilter(status);
    handleFilterClose();
    setPaginationModel({ ...paginationModel, page: 0 });
  };

  // Handle action menu
  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>, route: Route): void => {
    event.stopPropagation();
    setSelectedRoute(route);
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
    if (!selectedRoute) return;
    
    try {
      setDeleteLoading(true);
      await apiService.deleteRoute(selectedRoute._id);
      toast.success('Route deleted successfully');
      fetchRoutes();
    } catch (error) {
      console.error('Error deleting route:', error);
      toast.error('Failed to delete route');
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  // Handle route status update
  const handleStatusUpdate = async (id: string, status: string): Promise<void> => {
    try {
      await apiService.updateRoute(id, { status });
      toast.success(`Route marked as ${status}`);
      fetchRoutes();
    } catch (error) {
      console.error('Error updating route status:', error);
      toast.error('Failed to update route status');
    }
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'Route Name', 
      flex: 1.5, 
      minWidth: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <RouteIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    { 
      field: 'scheduledStartTime', 
      headerName: 'Start Time', 
      flex: 1, 
      minWidth: 150,
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleString() : 'Not scheduled',
    },
    { 
      field: 'vehicle', 
      headerName: 'Vehicle', 
      flex: 1, 
      minWidth: 150,
      valueGetter: (params: GridValueGetterParams) => params.row.vehicle?.name || 'N/A',
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DirectionsCarIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
          <Typography variant="body2">{params.row.vehicle?.name || 'N/A'}</Typography>
        </Box>
      ),
    },
    { 
      field: 'driver', 
      headerName: 'Driver', 
      flex: 1, 
      minWidth: 150,
      valueGetter: (params: GridValueGetterParams) => params.row.driver ? `${params.row.driver.firstName} ${params.row.driver.lastName}` : 'N/A',
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
          <Typography variant="body2">
            {params.row.driver ? `${params.row.driver.firstName} ${params.row.driver.lastName}` : 'N/A'}
          </Typography>
        </Box>
      ),
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.value} 
          color={
            params.value === 'completed' ? 'success' :
            params.value === 'in_progress' ? 'info' :
            params.value === 'planned' ? 'primary' :
            'error' // cancelled
          }
          size="small"
        />
      ),
    },
    { 
      field: 'distance', 
      headerName: 'Distance', 
      width: 120,
      valueFormatter: (params) => params.value ? `${params.value.toLocaleString()} km` : 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          onClick={(event) => handleActionClick(event as React.MouseEvent<HTMLButtonElement>, params.row as Route)}
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
        <Typography variant="h4">Routes</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/routes/new')}
        >
          Create Route
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            placeholder="Search routes..."
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
                        fetchRoutes();
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
            color={statusFilter !== 'all' ? 'primary' : 'inherit'}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchRoutes}
          >
            Refresh
          </Button>
        </Box>

        {/* Status filter menu */}
        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={handleFilterClose}
        >
          <MenuItem 
            onClick={() => handleStatusFilterChange('all')}
            selected={statusFilter === 'all'}
          >
            <ListItemText>All Statuses</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleStatusFilterChange('planned')}
            selected={statusFilter === 'planned'}
          >
            <ListItemIcon>
              <Chip label="Planned" color="primary" size="small" />
            </ListItemIcon>
            <ListItemText>Planned</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleStatusFilterChange('in_progress')}
            selected={statusFilter === 'in_progress'}
          >
            <ListItemIcon>
              <Chip label="In Progress" color="info" size="small" />
            </ListItemIcon>
            <ListItemText>In Progress</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleStatusFilterChange('completed')}
            selected={statusFilter === 'completed'}
          >
            <ListItemIcon>
              <Chip label="Completed" color="success" size="small" />
            </ListItemIcon>
            <ListItemText>Completed</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleStatusFilterChange('cancelled')}
            selected={statusFilter === 'cancelled'}
          >
            <ListItemIcon>
              <Chip label="Cancelled" color="error" size="small" />
            </ListItemIcon>
            <ListItemText>Cancelled</ListItemText>
          </MenuItem>
        </Menu>

        {/* Data grid */}
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={routes}
            columns={columns}
            getRowId={(row) => row._id}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50]}
            rowCount={totalRows}
            paginationMode="server"
            loading={loading}
            disableRowSelectionOnClick
            onRowClick={(params) => navigate(`/routes/${params.id}`)}
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

      {/* Action menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionClose}
      >
        <MenuItem onClick={() => {
          handleActionClose();
          if (selectedRoute) navigate(`/routes/${selectedRoute._id}`);
        }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleActionClose();
          if (selectedRoute) navigate(`/routes/${selectedRoute._id}/edit`);
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <Divider />
        {selectedRoute?.status === 'planned' && (
          <MenuItem onClick={() => {
            handleActionClose();
            if (selectedRoute) handleStatusUpdate(selectedRoute._id, 'in_progress');
          }}>
            <ListItemIcon>
              <PlayArrowIcon fontSize="small" color="info" />
            </ListItemIcon>
            <ListItemText>Start Route</ListItemText>
          </MenuItem>
        )}
        {selectedRoute?.status === 'in_progress' && (
          <MenuItem onClick={() => {
            handleActionClose();
            if (selectedRoute) handleStatusUpdate(selectedRoute._id, 'completed');
          }}>
            <ListItemIcon>
              <CheckIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Mark as Completed</ListItemText>
          </MenuItem>
        )}
        {(selectedRoute?.status === 'planned' || selectedRoute?.status === 'in_progress') && (
          <MenuItem onClick={() => {
            handleActionClose();
            if (selectedRoute) handleStatusUpdate(selectedRoute._id, 'cancelled');
          }}>
            <ListItemIcon>
              <CancelIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Cancel Route</ListItemText>
          </MenuItem>
        )}
        <Divider />
        {selectedRoute?.vehicle && (
          <MenuItem onClick={() => {
            handleActionClose();
            if (selectedRoute?.vehicle) navigate(`/vehicles/${selectedRoute.vehicle._id}`);
          }}>
            <ListItemIcon>
              <DirectionsCarIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Vehicle</ListItemText>
          </MenuItem>
        )}
        {selectedRoute?.driver && (
          <MenuItem onClick={() => {
            handleActionClose();
            if (selectedRoute?.driver) navigate(`/drivers/${selectedRoute.driver._id}`);
          }}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Driver</ListItemText>
          </MenuItem>
        )}
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
        <DialogTitle>Delete Route</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the route "{selectedRoute?.name}"? This action cannot be undone.
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

export default RouteList;
