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
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
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
import DirectionsIcon from '@mui/icons-material/Directions';
import BuildIcon from '@mui/icons-material/Build';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

interface Odometer {
  value: number;
  unit: string;
  date: string;
}

interface Vehicle {
  _id: string;
  name: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  status: 'active' | 'maintenance' | 'inactive' | 'retired';
  currentOdometer: Odometer | number;
  fuelType: string;
  tankCapacity: number;
  createdAt: string;
  updatedAt: string;
}

interface PaginationModel {
  page: number;
  pageSize: number;
}

const VehicleList: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<HTMLElement | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionMenuAnchor, setActionMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState<number>(0);

  // Fetch vehicles
  const fetchVehicles = async (): Promise<void> => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sort: 'name'
      };

      // Add search term if present
      if (searchTerm) {
        params.search = searchTerm;
      }

      // Add status filter if not 'all'
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await apiService.getVehicles(params);
      setVehicles(response.data.data);
      setTotalRows(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [paginationModel.page, paginationModel.pageSize, statusFilter]);

  // Handle search
  const handleSearch = (): void => {
    setPaginationModel({ ...paginationModel, page: 0 });
    fetchVehicles();
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
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

  const handleFilterChange = (status: string): void => {
    setStatusFilter(status);
    handleFilterClose();
    setPaginationModel({ ...paginationModel, page: 0 });
  };

  // Handle action menu
  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>, vehicle: Vehicle): void => {
    event.stopPropagation();
    setSelectedVehicle(vehicle);
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
    if (!selectedVehicle) return;
    
    try {
      setDeleteLoading(true);
      await apiService.deleteVehicle(selectedVehicle._id);
      toast.success('Vehicle deleted successfully');
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Failed to delete vehicle');
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'licensePlate', headerName: 'License Plate', flex: 1, minWidth: 120 },
    { 
      field: 'make', 
      headerName: 'Make/Model', 
      flex: 1, 
      minWidth: 150,
      valueGetter: (params: GridValueGetterParams) => `${params.row.make || ''} ${params.row.model || ''}`,
    },
    { 
      field: 'year', 
      headerName: 'Year', 
      width: 100,
      type: 'number'
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.value} 
          color={
            params.value === 'active' ? 'success' :
            params.value === 'maintenance' ? 'warning' :
            params.value === 'inactive' ? 'default' :
            'error' // retired
          }
          size="small"
        />
      ),
    },
    {
      field: 'currentOdometer',
      headerName: 'Odometer',
      width: 120,
      type: 'number',
      valueGetter: (params: GridValueGetterParams) => {
        // Handle both currentOdometer object and direct value
        if (typeof params.row.currentOdometer === 'object' && params.row.currentOdometer?.value !== undefined) {
          return params.row.currentOdometer.value;
        }
        return typeof params.row.currentOdometer === 'number' ? params.row.currentOdometer : 0;
      },
      valueFormatter: (params: { value: number }) => {
        return `${params.value.toLocaleString()} km`;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
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
        <Typography variant="h4">Vehicles</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/vehicles/new')}
        >
          Add Vehicle
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            placeholder="Search vehicles..."
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
                        fetchVehicles();
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
            onClick={fetchVehicles}
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
            onClick={() => handleFilterChange('all')}
            selected={statusFilter === 'all'}
          >
            <ListItemText>All Statuses</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleFilterChange('active')}
            selected={statusFilter === 'active'}
          >
            <ListItemIcon>
              <Chip label="Active" color="success" size="small" />
            </ListItemIcon>
            <ListItemText>Active</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleFilterChange('maintenance')}
            selected={statusFilter === 'maintenance'}
          >
            <ListItemIcon>
              <Chip label="Maintenance" color="warning" size="small" />
            </ListItemIcon>
            <ListItemText>Maintenance</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleFilterChange('inactive')}
            selected={statusFilter === 'inactive'}
          >
            <ListItemIcon>
              <Chip label="Inactive" size="small" />
            </ListItemIcon>
            <ListItemText>Inactive</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleFilterChange('retired')}
            selected={statusFilter === 'retired'}
          >
            <ListItemIcon>
              <Chip label="Retired" color="error" size="small" />
            </ListItemIcon>
            <ListItemText>Retired</ListItemText>
          </MenuItem>
        </Menu>

        {/* Data grid */}
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={vehicles}
            columns={columns}
            getRowId={(row) => row._id}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50]}
            rowCount={totalRows}
            paginationMode="server"
            loading={loading}
            disableRowSelectionOnClick
            onRowClick={(params) => navigate(`/vehicles/${params.id}`)}
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
          if (selectedVehicle) navigate(`/vehicles/${selectedVehicle._id}`);
        }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleActionClose();
          if (selectedVehicle) navigate(`/vehicles/${selectedVehicle._id}/edit`);
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          handleActionClose();
          if (selectedVehicle) navigate(`/maintenance/new`, { state: { vehicleId: selectedVehicle._id } });
        }}>
          <ListItemIcon>
            <BuildIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Maintenance</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleActionClose();
          if (selectedVehicle) navigate(`/fuel/new`, { state: { vehicleId: selectedVehicle._id } });
        }}>
          <ListItemIcon>
            <LocalGasStationIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Fuel Record</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleActionClose();
          if (selectedVehicle) navigate(`/routes/new`, { state: { vehicleId: selectedVehicle._id } });
        }}>
          <ListItemIcon>
            <DirectionsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Create Route</ListItemText>
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
        <DialogTitle>Delete Vehicle</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the vehicle "{selectedVehicle?.name}"? This action cannot be undone.
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

export default VehicleList;
