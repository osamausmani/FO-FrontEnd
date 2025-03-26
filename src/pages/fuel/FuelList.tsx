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
  GridValueFormatterParams,
  GridPaginationModel 
} from '@mui/x-data-grid';
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
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';

interface LocationState {
  vehicleId?: string;
}

interface Vehicle {
  _id: string;
  name: string;
}

interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Odometer {
  value: number;
}

interface FuelRecord {
  _id: string;
  date: string;
  vehicle?: Vehicle;
  driver?: Driver;
  quantity: number;
  unit?: string;
  unitOfMeasure?: string;
  totalCost: number;
  odometer?: Odometer;
  odometerReading?: number;
}

interface FuelParams {
  page: number;
  limit: number;
  sort?: string;
  search?: string;
  vehicle?: string;
}

interface ApiResponse {
  data: FuelRecord[];
  pagination: {
    total: number;
  };
}

const FuelList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [vehicleFilter, setVehicleFilter] = useState<string>(locationState?.vehicleId || 'all');
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRecord, setSelectedRecord] = useState<FuelRecord | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState<number>(0);

  // Fetch fuel records
  const fetchFuelRecords = async (): Promise<void> => {
    try {
      setLoading(true);
      const params: FuelParams = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        sort: '-date'
      };

      // Add search term if present
      if (searchTerm) {
        params.search = searchTerm;
      }

      // Add vehicle filter if not 'all'
      if (vehicleFilter !== 'all') {
        params.vehicle = vehicleFilter;
      }

      const response = await apiService.getFuelRecords(params);
      const apiResponse = response.data as ApiResponse;
      setFuelRecords(apiResponse.data);
      setTotalRows(apiResponse.pagination.total);
    } catch (error) {
      console.error('Error fetching fuel records:', error);
      toast.error('Failed to load fuel records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuelRecords();
  }, [paginationModel.page, paginationModel.pageSize, vehicleFilter]);

  // Handle search
  const handleSearch = (): void => {
    setPaginationModel({ ...paginationModel, page: 0 });
    fetchFuelRecords();
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

  const handleFilterChange = (vehicle: string): void => {
    setVehicleFilter(vehicle);
    handleFilterClose();
    setPaginationModel({ ...paginationModel, page: 0 });
  };

  // Handle action menu
  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>, record: FuelRecord): void => {
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
      await apiService.deleteFuelRecord(selectedRecord._id);
      toast.success('Fuel record deleted successfully');
      fetchFuelRecords();
    } catch (error) {
      console.error('Error deleting fuel record:', error);
      toast.error('Failed to delete fuel record');
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    { 
      field: 'date', 
      headerName: 'Date', 
      flex: 1, 
      minWidth: 120,
      valueFormatter: (params: GridValueFormatterParams<string>) => 
        new Date(params.value).toLocaleDateString(),
    },
    { 
      field: 'vehicle', 
      headerName: 'Vehicle', 
      flex: 1.5, 
      minWidth: 180,
      valueGetter: (params: GridValueGetterParams<FuelRecord>) => 
        params.row.vehicle?.name || 'N/A',
      renderCell: (params: GridRenderCellParams<FuelRecord>) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DirectionsCarIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
          <Typography variant="body2">{params.row.vehicle?.name || 'N/A'}</Typography>
        </Box>
      ),
    },
    { 
      field: 'driver', 
      headerName: 'Driver', 
      flex: 1.5, 
      minWidth: 180,
      valueGetter: (params: GridValueGetterParams<FuelRecord>) => 
        params.row.driver ? `${params.row.driver.firstName} ${params.row.driver.lastName}` : 'N/A',
      renderCell: (params: GridRenderCellParams<FuelRecord>) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
          <Typography variant="body2">
            {params.row.driver ? `${params.row.driver.firstName} ${params.row.driver.lastName}` : 'N/A'}
          </Typography>
        </Box>
      ),
    },
    { 
      field: 'quantity', 
      headerName: 'Quantity', 
      width: 120,
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        // Check for both unit and unitOfMeasure
        const row = params.id ? params.api.getRow(params.id) as any : null;
        const unit = row?.unit || row?.unitOfMeasure || 'L';
        return `${params.value} ${unit === 'liters' ? 'L' : unit === 'gallons' ? 'gal' : unit}`;
      },
    },
    { 
      field: 'totalCost', 
      headerName: 'Cost', 
      width: 120,
      valueFormatter: (params: GridValueFormatterParams<number>) => 
        `$${params.value?.toFixed(2) || '0.00'}`,
    },
    { 
      field: 'pricePerUnit', 
      headerName: 'Price/Unit', 
      width: 120,
      valueGetter: (params: GridValueGetterParams<FuelRecord>) => {
        if (!params.row.totalCost || !params.row.quantity) return 0;
        return params.row.totalCost / params.row.quantity;
      },
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        // Check for both unit and unitOfMeasure
        const row = params.id ? params.api.getRow(params.id) as any : null;
        const unit = row?.unit || row?.unitOfMeasure || 'L';
        return `$${params.value.toFixed(2)}/${unit === 'liters' ? 'L' : unit === 'gallons' ? 'gal' : unit}`;
      },
    },
    { 
      field: 'odometer', 
      headerName: 'Odometer', 
      width: 120,
      valueGetter: (params: GridValueGetterParams<FuelRecord>) => 
        params.row.odometer?.value || params.row.odometerReading || 0,
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        return `${params.value.toLocaleString()} km`;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<FuelRecord>) => (
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
        <Typography variant="h4">Fuel Records</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/fuel/new')}
        >
          Add Fuel Record
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            placeholder="Search fuel records..."
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
                        fetchFuelRecords();
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
            color={vehicleFilter !== 'all' ? 'primary' : 'inherit'}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchFuelRecords}
          >
            Refresh
          </Button>
        </Box>

        {/* Vehicle filter menu */}
        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={handleFilterClose}
        >
          <MenuItem 
            onClick={() => handleFilterChange('all')}
            selected={vehicleFilter === 'all'}
          >
            <ListItemText>All Vehicles</ListItemText>
          </MenuItem>
          <Divider />
          {/* In a real implementation, we would fetch and display a list of vehicles here */}
          <MenuItem 
            onClick={() => handleFilterChange(vehicleFilter)}
            disabled
          >
            <ListItemText>Vehicle filtering will be implemented with real vehicle data</ListItemText>
          </MenuItem>
        </Menu>

        {/* Data grid */}
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={fuelRecords}
            columns={columns}
            getRowId={(row) => row._id}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50]}
            rowCount={totalRows}
            paginationMode="server"
            loading={loading}
            disableRowSelectionOnClick
            onRowClick={(params) => navigate(`/fuel/${params.id}`)}
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
          if (selectedRecord) {
            navigate(`/fuel/${selectedRecord._id}`);
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
            navigate(`/fuel/${selectedRecord._id}/edit`);
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
          if (selectedRecord?.vehicle) {
            navigate(`/vehicles/${selectedRecord.vehicle._id}`);
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
        <DialogTitle>Delete Fuel Record</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this fuel record? This action cannot be undone.
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

export default FuelList;
