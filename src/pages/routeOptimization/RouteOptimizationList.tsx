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
import RouteIcon from '@mui/icons-material/Route';
import MapIcon from '@mui/icons-material/Map';
import DirectionsIcon from '@mui/icons-material/Directions';
import TimelineIcon from '@mui/icons-material/Timeline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

// Types
import { OptimizedRoute, RouteOptimizationResponse } from '../../types/routeOptimization';

// API
import apiService from '../../utils/api';

// Logging
import LoggingService from '../../utils/loggingService';

const RouteOptimizationList: React.FC = () => {
  const navigate = useNavigate();
  const [optimizedRoutes, setOptimizedRoutes] = useState<OptimizedRoute[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<OptimizedRoute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [routeToDelete, setRouteToDelete] = useState<OptimizedRoute | null>(null);

  // Fetch optimized routes
  const fetchOptimizedRoutes = async () => {
    try {
      setLoading(true);
      const res = await apiService.getRouteOptimizations();
      setOptimizedRoutes(res.data.data);
      setFilteredRoutes(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching optimized routes:', err);
      setError('Failed to fetch optimized routes. Please try again.');
      setLoading(false);
    }
  };

  // Load optimized routes on component mount
  useEffect(() => {
    fetchOptimizedRoutes();
  }, []);

  // Filter routes when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRoutes(optimizedRoutes);
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = optimizedRoutes.filter(
        route =>
          route.vehicleId.toLowerCase().includes(searchTermLower) ||
          (route.driverId && route.driverId.toLowerCase().includes(searchTermLower))
      );
      setFilteredRoutes(filtered);
    }
  }, [searchTerm, optimizedRoutes]);

  // Handle route deletion
  const handleDeleteClick = (route: OptimizedRoute) => {
    setRouteToDelete(route);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!routeToDelete) return;

    try {
      await apiService.deleteRouteOptimization(routeToDelete.vehicleId);
      
      // Log the deletion
      LoggingService.logAction(
        'route_optimization',
        routeToDelete.vehicleId,
        'delete',
        `Optimization for ${routeToDelete.vehicleName || 'vehicle'}`,
        `Deleted route optimization created on ${new Date(routeToDelete.createdAt).toLocaleDateString()}`
      );
      
      // Update the state
      setOptimizedRoutes(prevRoutes => 
        prevRoutes.filter(r => r.vehicleId !== routeToDelete.vehicleId)
      );
      
      // Close the dialog
      setDeleteDialogOpen(false);
      setRouteToDelete(null);
    } catch (err) {
      console.error('Error deleting optimized route:', err);
      setError('Failed to delete optimized route. Please try again.');
    }
  };

  // Format distance and duration
  const formatDistance = (distance: number) => {
    return `${(distance / 1000).toFixed(1)} km`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Route Optimization
      </Typography>
      
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          AI-Powered Route Planning
        </Typography>
        <Typography variant="body1" paragraph>
          Optimize your fleet's routes with our advanced AI algorithm. Save fuel, time, and reduce your carbon footprint.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Our route optimization engine considers traffic patterns, vehicle capacity, time windows, and driver constraints.
        </Typography>
      </Paper>

      {/* Actions Bar */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search by vehicle or driver"
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
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/route-optimization/new')}
          >
            New Optimization
          </Button>
        </Grid>
      </Grid>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vehicle</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Stops</TableCell>
              <TableCell>Distance</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : filteredRoutes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No optimized routes found. Create a new optimization.
                </TableCell>
              </TableRow>
            ) : (
              filteredRoutes.map((route) => (
                <TableRow key={route.vehicleId}>
                  <TableCell>{route.vehicleId}</TableCell>
                  <TableCell>{route.driverId || 'Not assigned'}</TableCell>
                  <TableCell>{new Date(route.startTime).toLocaleDateString()}</TableCell>
                  <TableCell>{route.waypoints.length}</TableCell>
                  <TableCell>{formatDistance(route.totalDistance)}</TableCell>
                  <TableCell>{formatDuration(route.totalTime)}</TableCell>
                  <TableCell>
                    <Chip 
                      label="Completed" 
                      color="success" 
                      size="small" 
                      icon={<TimelineIcon />} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => navigate(`/route-optimization/${route.vehicleId}`)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton 
                        size="small" 
                        onClick={() => navigate(`/route-optimization/${route.vehicleId}/edit`)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteClick(route)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the optimized route for vehicle {routeToDelete?.vehicleId}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RouteOptimizationList;
