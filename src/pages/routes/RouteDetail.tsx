import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../utils/api';
import { toast } from 'react-toastify';
import { RouteParams } from '../../types/common';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RouteIcon from '@mui/icons-material/Route';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SpeedIcon from '@mui/icons-material/Speed';
import NoteIcon from '@mui/icons-material/Note';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

interface Waypoint {
  name: string;
  location: string;
}

interface Vehicle {
  _id: string;
  name: string;
  licensePlate: string;
}

interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Route {
  _id: string;
  name: string;
  startLocation: string;
  endLocation: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  vehicle: Vehicle | string;
  driver: Driver | string;
  distance: number;
  estimatedDuration: number;
  waypoints: Waypoint[];
  cargo: string;
  notes: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface StatusInfo {
  text: string;
  color: 'primary' | 'info' | 'success' | 'error' | 'default';
}

const RouteDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<Route['status'] | ''>('');

  // Fetch route data
  useEffect(() => {
    const fetchRoute = async (): Promise<void> => {
      try {
        setLoading(true);
        if (!id) return;
        const response = await apiService.getRoute(id);
        setRoute(response.data.data);
      } catch (error) {
        console.error('Error fetching route:', error);
        toast.error('Failed to load route data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoute();
  }, [id]);

  // Handle delete
  const handleDeleteClick = (): void => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = (): void => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    try {
      setDeleteLoading(true);
      if (!id) return;
      await apiService.deleteRoute(id);
      toast.success('Route deleted successfully');
      navigate('/routes');
    } catch (error) {
      console.error('Error deleting route:', error);
      toast.error('Failed to delete route');
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  // Handle status update
  const handleStatusClick = (status: Route['status']): void => {
    setNewStatus(status);
    setStatusDialogOpen(true);
  };

  const handleStatusCancel = (): void => {
    setStatusDialogOpen(false);
  };

  const handleStatusConfirm = async (): Promise<void> => {
    try {
      if (!id || !route || !newStatus) return;
      await apiService.updateRoute(id, { status: newStatus });
      toast.success(`Route marked as ${newStatus}`);
      
      // Update local state
      setRoute({ ...route, status: newStatus });
      setStatusDialogOpen(false);
    } catch (error) {
      console.error('Error updating route status:', error);
      toast.error('Failed to update route status');
      setStatusDialogOpen(false);
    }
  };

  // Get status text and color
  const getStatusInfo = (status: Route['status']): StatusInfo => {
    switch (status) {
      case 'planned':
        return { text: 'Planned', color: 'primary' };
      case 'in_progress':
        return { text: 'In Progress', color: 'info' };
      case 'completed':
        return { text: 'Completed', color: 'success' };
      case 'cancelled':
        return { text: 'Cancelled', color: 'error' };
      default:
        return { text: status, color: 'default' };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!route) {
    return (
      <Box>
        <Typography variant="h5" color="error">Route not found</Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/routes')}
          sx={{ mt: 2 }}
        >
          Back to Routes
        </Button>
      </Box>
    );
  }

  const statusInfo = getStatusInfo(route.status);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={() => navigate('/routes')} 
            sx={{ mr: 1 }}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">{route.name}</Typography>
          <Chip 
            label={statusInfo.text} 
            color={statusInfo.color} 
            sx={{ ml: 2 }}
          />
        </Box>
        <Box>
          {route.status === 'planned' && (
            <Button
              variant="contained"
              color="info"
              startIcon={<PlayArrowIcon />}
              onClick={() => handleStatusClick('in_progress')}
              sx={{ mr: 1 }}
            >
              Start Route
            </Button>
          )}
          {route.status === 'in_progress' && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              onClick={() => handleStatusClick('completed')}
              sx={{ mr: 1 }}
            >
              Complete
            </Button>
          )}
          {(route.status === 'planned' || route.status === 'in_progress') && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => handleStatusClick('cancelled')}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/routes/${id}/edit`)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Route Info */}
      <Grid container spacing={3}>
        {/* Left column - Route details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Route Information</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">Scheduled Start</Typography>
                </Box>
                <Typography variant="h6">
                  {route.scheduledStartTime ? new Date(route.scheduledStartTime).toLocaleString() : 'Not scheduled'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">Scheduled End</Typography>
                </Box>
                <Typography variant="h6">
                  {route.scheduledEndTime ? new Date(route.scheduledEndTime).toLocaleString() : 'Not scheduled'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DirectionsCarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">Vehicle</Typography>
                </Box>
                {route.vehicle && typeof route.vehicle === 'object' ? (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      if (typeof route.vehicle !== 'string' && route.vehicle?._id) {
                        navigate(`/vehicles/${route.vehicle._id}`);
                      }
                    }}
                  >
                    <Typography variant="h6">{typeof route.vehicle !== 'string' && route.vehicle ? route.vehicle.name : 'N/A'}</Typography>
                  </Box>
                ) : (
                  <Typography variant="h6">No vehicle assigned</Typography>
                )}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">Driver</Typography>
                </Box>
                {route.driver && typeof route.driver === 'object' ? (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      if (route.driver && typeof route.driver === 'object' && route.driver._id) {
                        navigate(`/drivers/${route.driver._id}`);
                      }
                    }}
                  >
                    <Typography variant="h6">
                      {typeof route.driver !== 'string' && route.driver ? 
                        `${route.driver.firstName} ${route.driver.lastName}` : 'N/A'}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="h6">No driver assigned</Typography>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Route Details</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <MyLocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">Start Location</Typography>
                </Box>
                <Typography variant="h6">{route.startLocation || 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">End Location</Typography>
                </Box>
                <Typography variant="h6">{route.endLocation || 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SpeedIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">Distance</Typography>
                </Box>
                <Typography variant="h6">{route.distance ? `${route.distance.toLocaleString()} km` : 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">Estimated Duration</Typography>
                </Box>
                <Typography variant="h6">
                  {route.estimatedDuration ? `${Math.floor(route.estimatedDuration / 60)} hours ${route.estimatedDuration % 60} minutes` : 'N/A'}
                </Typography>
              </Grid>
              
              {route.waypoints && route.waypoints.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 2 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="subtitle1" color="text.secondary">Waypoints</Typography>
                  </Box>
                  <List sx={{ bgcolor: 'background.default', borderRadius: 1 }}>
                    {route.waypoints.map((waypoint, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{index + 1}</Typography>
                        </ListItemIcon>
                        <ListItemText 
                          primary={waypoint.name || `Waypoint ${index + 1}`}
                          secondary={waypoint.location}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}
              
              {route.notes && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 2 }}>
                    <NoteIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="subtitle1" color="text.secondary">Notes</Typography>
                  </Box>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body1">{route.notes}</Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Right column - Stats and summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Route Summary</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Status</Typography>
                        <Typography variant="h5">{statusInfo.text}</Typography>
                      </Box>
                      <Chip 
                        label={statusInfo.text} 
                        color={statusInfo.color} 
                        sx={{ height: 32 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">Distance</Typography>
                    <Typography variant="h6">{route.distance ? `${route.distance} km` : 'N/A'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">Duration</Typography>
                    <Typography variant="h6">
                      {route.estimatedDuration ? `${Math.floor(route.estimatedDuration / 60)}h ${route.estimatedDuration % 60}m` : 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {route.cargo && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocalShippingIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">Cargo</Typography>
                      </Box>
                      <Typography variant="h6">{route.cargo}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              
              {route.vehicle && typeof route.vehicle === 'object' && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<DirectionsCarIcon />}
                      onClick={() => {
                        if (typeof route.vehicle !== 'string' && route.vehicle?._id) {
                          navigate(`/vehicles/${route.vehicle._id}`);
                        }
                      }}
                    >
                      View Vehicle Details
                    </Button>
                  </Box>
                </Grid>
              )}
              
              {route.driver && typeof route.driver === 'object' && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<PersonIcon />}
                      onClick={() => {
                        if (route.driver && typeof route.driver === 'object' && route.driver._id) {
                          navigate(`/drivers/${route.driver._id}`);
                        }
                      }}
                    >
                      View Driver Details
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Route</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this route? This action cannot be undone.
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

      {/* Status update confirmation dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={handleStatusCancel}
      >
        <DialogTitle>Update Route Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {newStatus === 'in_progress' && 'Are you sure you want to start this route?'}
            {newStatus === 'completed' && 'Are you sure you want to mark this route as completed?'}
            {newStatus === 'cancelled' && 'Are you sure you want to cancel this route?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusCancel}>
            No
          </Button>
          <Button 
            onClick={handleStatusConfirm} 
            color={newStatus === 'cancelled' ? 'error' : newStatus === 'completed' ? 'success' : 'primary'}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RouteDetail;
