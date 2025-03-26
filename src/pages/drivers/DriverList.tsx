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
import { 
  DataGrid, 
  GridToolbar, 
  GridColDef, 
  GridRenderCellParams, 
  GridValueGetterParams,
  GridPaginationModel 
} from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import apiService from '../../utils/api';
import { toast } from 'react-toastify';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

interface AssignedVehicle {
  name: string;
  licensePlate: string;
}

interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  driverId?: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: string;
  assignedVehicle?: AssignedVehicle;
  vehicle?: string;
}

interface DriverParams {
  page: number;
  limit: number;
  sort?: string;
  search?: string;
  status?: string;
  assigned?: boolean;
}

const DriverList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assignmentFilter, setAssignmentFilter] = useState<string>('all');
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState<number>(0);

  // Fetch drivers
  const fetchDrivers = async (): Promise<void> => {
    try {
      setLoading(true);
      const params: DriverParams = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sort: 'lastName'
      };

      // Add search term if present
      if (searchTerm) {
        params.search = searchTerm;
      }

      // Add status filter if not 'all'
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      // Add assignment filter if not 'all'
      if (assignmentFilter === 'assigned') {
        params.assigned = true;
      } else if (assignmentFilter === 'unassigned') {
        params.assigned = false;
      }

      const response = await apiService.getDrivers(params);
      setDrivers(response.data.data);
      setTotalRows(response.data.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [paginationModel.page, paginationModel.pageSize, statusFilter, assignmentFilter]);

  // Handle search
  const handleSearch = (): void => {
    setPaginationModel({ ...paginationModel, page: 0 });
    fetchDrivers();
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle filter menu
  const handleStatusFilterClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
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

  const handleAssignmentFilterChange = (assignment: string): void => {
    setAssignmentFilter(assignment);
    setPaginationModel({ ...paginationModel, page: 0 });
  };

  // Handle action menu
  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>, driver: Driver): void => {
    event.stopPropagation();
    setSelectedDriver(driver);
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
    if (!selectedDriver) return;
    
    try {
      setDeleteLoading(true);
      await apiService.deleteDriver(selectedDriver._id);
      toast.success('Driver deleted successfully');
      fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('Failed to delete driver');
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    { 
      field: 'name', 
      headerName: 'Driver', 
      flex: 1, 
      minWidth: 180,
      valueGetter: (params: GridValueGetterParams<Driver>) => 
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
      renderCell: (params: GridRenderCellParams<Driver>) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ ml: 1 }}>
            <Typography variant="body2">{params.value}</Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {params.row.driverId || params.row._id.substring(0, 8)}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { 
      field: 'contact', 
      headerName: 'Contact', 
      flex: 1, 
      minWidth: 200,
      valueGetter: (params: GridValueGetterParams<Driver>) => params.row.phone,
      renderCell: (params: GridRenderCellParams<Driver>) => (
        <Box>
          <Typography variant="body2">{params.row.phone}</Typography>
          <Typography variant="caption" color="text.secondary">{params.row.email}</Typography>
        </Box>
      ),
    },
    { 
      field: 'licenseNumber', 
      headerName: 'License', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<Driver>) => (
        <Box>
          <Typography variant="body2">{params.row.licenseNumber}</Typography>
          <Typography variant="caption" color="text.secondary">
            Expires: {new Date(params.row.licenseExpiry).toLocaleDateString()}
          </Typography>
        </Box>
      ),
    },
    { 
      field: 'assignedVehicle', 
      headerName: 'Vehicle', 
      flex: 1, 
      minWidth: 150,
      valueGetter: (params: GridValueGetterParams<Driver>) => params.row.assignedVehicle?.name || 'Not assigned',
      renderCell: (params: GridRenderCellParams<Driver>) => (
        <Typography variant="body2">
          {params.row.assignedVehicle ? (
            <>
              {params.row.assignedVehicle.name}
              <Typography variant="caption" display="block" color="text.secondary">
                {params.row.assignedVehicle.licensePlate}
              </Typography>
            </>
          ) : (
            'Not assigned'
          )}
        </Typography>
      ),
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params: GridRenderCellParams<Driver>) => (
        <Chip 
          label={params.value} 
          color={params.value === 'active' ? 'success' : 'default'}
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
      renderCell: (params: GridRenderCellParams<Driver>) => (
        <IconButton
          onClick={(event) => handleActionClick(event as React.MouseEvent<HTMLButtonElement>, params.row)}
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
        <Typography variant="h4">Drivers</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={() => navigate('/drivers/new')}
        >
          Add Driver
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            placeholder="Search drivers..."
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
                        fetchDrivers();
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
            onClick={handleStatusFilterClick}
            color={statusFilter !== 'all' ? 'primary' : 'inherit'}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchDrivers}
          >
            Refresh
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant={assignmentFilter === 'all' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => handleAssignmentFilterChange('all')}
          >
            All Drivers
          </Button>
          <Button
            variant={assignmentFilter === 'assigned' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => handleAssignmentFilterChange('assigned')}
          >
            Assigned
          </Button>
          <Button
            variant={assignmentFilter === 'unassigned' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => handleAssignmentFilterChange('unassigned')}
          >
            Unassigned
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
            onClick={() => handleStatusFilterChange('active')}
            selected={statusFilter === 'active'}
          >
            <ListItemIcon>
              <Chip label="Active" color="success" size="small" />
            </ListItemIcon>
            <ListItemText>Active</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleStatusFilterChange('inactive')}
            selected={statusFilter === 'inactive'}
          >
            <ListItemIcon>
              <Chip label="Inactive" size="small" />
            </ListItemIcon>
            <ListItemText>Inactive</ListItemText>
          </MenuItem>
        </Menu>

        {/* Data grid */}
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={drivers}
            columns={columns}
            getRowId={(row) => row._id}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50]}
            rowCount={totalRows}
            paginationMode="server"
            loading={loading}
            disableRowSelectionOnClick
            onRowClick={(params) => navigate(`/drivers/${params.id}`)}
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
          if (selectedDriver) {
            navigate(`/drivers/${selectedDriver._id}`);
          }
        }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleActionClose();
          if (selectedDriver) {
            navigate(`/drivers/${selectedDriver._id}/edit`);
          }
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <Divider />
        {selectedDriver?.assignedVehicle ? (
          <MenuItem onClick={() => {
            handleActionClose();
            // Implement unassign vehicle functionality
            toast.info('Unassign vehicle functionality will be implemented soon');
          }}>
            <ListItemIcon>
              <PersonRemoveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Unassign Vehicle</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => {
            handleActionClose();
            // Implement assign vehicle functionality
            toast.info('Assign vehicle functionality will be implemented soon');
          }}>
            <ListItemIcon>
              <DirectionsCarIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Assign Vehicle</ListItemText>
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
        <DialogTitle>Delete Driver</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the driver "{selectedDriver?.firstName} {selectedDriver?.lastName}"? This action cannot be undone.
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

export default DriverList;
