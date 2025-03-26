import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  Divider,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MapIcon from '@mui/icons-material/Map';
import PlaceIcon from '@mui/icons-material/Place';
import PolygonIcon from '@mui/icons-material/Timeline'; // Using Timeline as a substitute for Polygon
import CircleIcon from '@mui/icons-material/RadioButtonUnchecked';
import RectangleIcon from '@mui/icons-material/CropSquare';

// Types
import { Geofence, GeofenceType } from '../../types/geofencing';

// API
import apiService from '../../utils/api';

// Logging
import LoggingService from '../../utils/loggingService';

const GeofenceList: React.FC = () => {
  const navigate = useNavigate();
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [filteredGeofences, setFilteredGeofences] = useState<Geofence[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [geofenceToDelete, setGeofenceToDelete] = useState<Geofence | null>(null);

  // Fetch geofences
  const fetchGeofences = async () => {
    try {
      setLoading(true);
      const res = await apiService.getGeofences();
      setGeofences(res.data.data);
      setFilteredGeofences(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching geofences:', err);
      setError('Failed to fetch geofences. Please try again.');
      setLoading(false);
    }
  };

  // Load geofences on component mount
  useEffect(() => {
    fetchGeofences();
  }, []);

  // Filter geofences when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredGeofences(geofences);
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = geofences.filter(
        geofence =>
          geofence.name.toLowerCase().includes(searchTermLower) ||
          (geofence.description && geofence.description.toLowerCase().includes(searchTermLower)) ||
          (geofence.address && geofence.address.toLowerCase().includes(searchTermLower)) ||
          (geofence.tags && geofence.tags.some(tag => tag.toLowerCase().includes(searchTermLower)))
      );
      setFilteredGeofences(filtered);
    }
  }, [searchTerm, geofences]);

  // Handle geofence deletion
  const handleDeleteClick = (geofence: Geofence) => {
    setGeofenceToDelete(geofence);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!geofenceToDelete) return;

    try {
      await apiService.deleteGeofence(geofenceToDelete._id);
      
      // Log the deletion
      LoggingService.logAction(
        'geofence',
        geofenceToDelete._id,
        'delete',
        geofenceToDelete.name,
        `Deleted geofence with description: ${geofenceToDelete.description || 'No description'}`
      );
      
      // Update the state
      setGeofences(prevGeofences => 
        prevGeofences.filter(g => g._id !== geofenceToDelete._id)
      );
      
      // Close the dialog
      setDeleteDialogOpen(false);
      setGeofenceToDelete(null);
    } catch (err) {
      console.error('Error deleting geofence:', err);
      setError('Failed to delete geofence. Please try again.');
    }
  };

  // Get icon for geofence type
  const getGeofenceTypeIcon = (type: GeofenceType) => {
    switch (type) {
      case 'circle':
        return <CircleIcon />;
      case 'polygon':
        return <PolygonIcon />;
      case 'rectangle':
        return <RectangleIcon />;
      default:
        return <PlaceIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Geofences
      </Typography>
      
      {/* Controls bar */}
      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search geofences..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={8} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<MapIcon />}
            onClick={() => navigate('/geofencing/map')}
            sx={{ mr: 1 }}
          >
            View on Map
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/geofencing/new')}
          >
            Add Geofence
          </Button>
        </Grid>
      </Grid>
      
      {/* Main content */}
      <Paper>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : filteredGeofences.length === 0 ? (
          <Alert severity="info">
            {searchTerm ? 'No geofences match your search.' : 'No geofences have been created yet.'}
          </Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Vehicles</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGeofences.map((geofence) => (
                  <TableRow key={geofence._id} hover>
                    <TableCell>
                      <Typography variant="body1">{geofence.name}</Typography>
                      {geofence.description && (
                        <Typography variant="caption" color="textSecondary">
                          {geofence.description.length > 50
                            ? `${geofence.description.substring(0, 50)}...`
                            : geofence.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getGeofenceTypeIcon(geofence.type)}
                        label={geofence.type.charAt(0).toUpperCase() + geofence.type.slice(1)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {geofence.address || (
                        geofence.type === 'circle' && geofence.geometry.center
                          ? `Center at ${geofence.geometry.center.coordinates[1].toFixed(6)}, ${geofence.geometry.center.coordinates[0].toFixed(6)}`
                          : 'Custom shape'
                      )}
                    </TableCell>
                    <TableCell>
                      {geofence.vehicles.length}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={geofence.status}
                        color={geofence.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(geofence.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/geofencing/${geofence._id}`)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/geofencing/${geofence._id}/edit`)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(geofence)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the geofence "{geofenceToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GeofenceList;
