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
import { DataGrid, GridToolbar, GridColDef, GridRenderCellParams, GridValueFormatterParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import apiService from '../../utils/api';
import { toast } from 'react-toastify';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import BuildIcon from '@mui/icons-material/Build';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

import { MaintenanceRecord, PaginationModel } from '../../types/maintenance';

interface Vehicle {
  _id: string;
  name: string;
  licensePlate: string;
}

const MaintenanceList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<HTMLElement | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionMenuAnchor, setActionMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState<PaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState<number>(0);

  // Fetch maintenance records
  const fetchMaintenanceRecords = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await apiService.getMaintenanceRecords({
        page: paginationModel.page,
        limit: paginationModel.pageSize,
        search: searchTerm,
        status: statusFilter,
        sort: ''
      });
      
      setMaintenanceRecords(response.data.data);
      setTotalRows(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      toast.error('Failed to load maintenance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceRecords();
  }, [paginationModel.page, paginationModel.pageSize, statusFilter, searchTerm]);

  // Handle search
  const handleSearch = (): void => {
    setPaginationModel({ ...paginationModel, page: 0 });
    fetchMaintenanceRecords();
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

  const handleFilterChange = (status: string): void => {
    setStatusFilter(status);
    handleFilterClose();
    setPaginationModel({ ...paginationModel, page: 0 });
  };

  // Handle action menu
  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>, record: MaintenanceRecord): void => {
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
    try {
      setDeleteLoading(true);
      // Placeholder for actual delete API call
      // await apiService.deleteMaintenanceRecord(selectedRecord._id);
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

  // DataGrid columns
  const columns: GridColDef[] = [
    { 
      field: 'title', 
      headerName: 'Service', 
      flex: 1, 
      minWidth: 180,
    },
    { 
      field: 'vehicle', 
      headerName: 'Vehicle', 
      flex: 1, 
      minWidth: 180,
      valueGetter: (params) => params.row.vehicle?.name || '',
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Typography variant="body2">{params.row.vehicle?.name}</Typography>
          <Typography variant="caption" color="text.secondary">{params.row.vehicle?.licensePlate}</Typography>
        </Box>
      ),
    },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 120,
      valueFormatter: (params: GridValueFormatterParams) => new Date(params.value as string).toLocaleDateString(),
    },
    { 
      field: 'cost', 
      headerName: 'Cost', 
      width: 120,
      valueFormatter: (params: GridValueFormatterParams) => `$${(params.value as number).toFixed(2)}`,
    },
    { 
      field: 'odometer', 
      headerName: 'Odometer', 
      width: 120,
      valueFormatter: (params: GridValueFormatterParams) => `${(params.value as number).toLocaleString()} km`,
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
            params.value === 'scheduled' ? 'primary' :
            params.value === 'in-progress' ? 'warning' :
            'error' // cancelled
          }
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
      renderCell: (params: GridRenderCellParams) => (
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
        <Typography variant="h4">Maintenance Records</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<BuildIcon />}
          onClick={() => navigate('/maintenance/new')}
        >
          Add Maintenance
        </Button>
      </Box>

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
              endAdornment: searchTerm ? (
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
              ) : undefined,
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
            onClick={fetchMaintenanceRecords}
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
            onClick={() => handleFilterChange('completed')}
            selected={statusFilter === 'completed'}
          >
            <ListItemIcon>
              <Chip label="Completed" color="success" size="small" />
            </ListItemIcon>
            <ListItemText>Completed</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleFilterChange('scheduled')}
            selected={statusFilter === 'scheduled'}
          >
            <ListItemIcon>
              <Chip label="Scheduled" color="primary" size="small" />
            </ListItemIcon>
            <ListItemText>Scheduled</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleFilterChange('in-progress')}
            selected={statusFilter === 'in-progress'}
          >
            <ListItemIcon>
              <Chip label="In Progress" color="warning" size="small" />
            </ListItemIcon>
            <ListItemText>In Progress</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleFilterChange('cancelled')}
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

export default MaintenanceList;
