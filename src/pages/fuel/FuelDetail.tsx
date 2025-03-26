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
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SpeedIcon from '@mui/icons-material/Speed';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NoteIcon from '@mui/icons-material/Note';

interface Vehicle {
  _id: string;
  name: string;
  licensePlate?: string;
  currentOdometer?: {
    value: number;
    unit?: string;
  };
  previousFuelOdometer?: {
    value: number;
    unit?: string;
  };
}

interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Odometer {
  value: number;
  unit?: string;
}

interface FuelRecord {
  _id: string;
  date: string;
  fuelType?: string;
  vehicle?: Vehicle;
  driver?: Driver;
  quantity: number;
  unit: string;
  unitOfMeasure?: string;
  totalCost: number;
  odometer?: Odometer;
  odometerReading?: number;
  station?: string;
  location?: string;
  notes?: string;
}

const FuelDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  
  const [fuelRecord, setFuelRecord] = useState<FuelRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // Fetch fuel record data
  useEffect(() => {
    const fetchFuelRecord = async (): Promise<void> => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await apiService.getFuelRecord(id);
        setFuelRecord(response.data.data);
      } catch (error) {
        console.error('Error fetching fuel record:', error);
        toast.error('Failed to load fuel record data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFuelRecord();
  }, [id]);

  // Handle delete
  const handleDeleteClick = (): void => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = (): void => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!id) return;
    
    try {
      setDeleteLoading(true);
      await apiService.deleteFuelRecord(id);
      toast.success('Fuel record deleted successfully');
      navigate('/fuel');
    } catch (error) {
      console.error('Error deleting fuel record:', error);
      toast.error('Failed to delete fuel record');
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!fuelRecord) {
    return (
      <Box>
        <Typography variant="h5" color="error">Fuel record not found</Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/fuel')}
          sx={{ mt: 2 }}
        >
          Back to Fuel Records
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={() => navigate('/fuel')} 
            sx={{ mr: 1 }}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">Fuel Record Details</Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/fuel/${id}/edit`)}
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

      {/* Fuel Record Info */}
      <Grid container spacing={3}>
        {/* Left column - Fuel details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Basic Information</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">Date</Typography>
                </Box>
                <Typography variant="h6">{new Date(fuelRecord.date).toLocaleDateString()}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalGasStationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">Fuel Type</Typography>
                </Box>
                <Typography variant="h6">{fuelRecord.fuelType || 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DirectionsCarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">Vehicle</Typography>
                </Box>
                {fuelRecord.vehicle && (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/vehicles/${fuelRecord.vehicle?._id}`)}
                  >
                    <Typography variant="h6">{fuelRecord.vehicle?.name}</Typography>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">Driver</Typography>
                </Box>
                {fuelRecord.driver && (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/drivers/${fuelRecord.driver?._id}`)}
                  >
                    <Typography variant="h6">
                      {`${fuelRecord.driver?.firstName} ${fuelRecord.driver?.lastName}`}
                    </Typography>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Fuel Information</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalGasStationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">Quantity</Typography>
                </Box>
                <Typography variant="h6">{`${fuelRecord.quantity} ${fuelRecord.unit}`}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">Total Cost</Typography>
                </Box>
                <Typography variant="h6">{`$${fuelRecord.totalCost.toFixed(2)}`}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">Price per Unit</Typography>
                </Box>
                <Typography variant="h6">
                  {`$${(fuelRecord.totalCost / fuelRecord.quantity).toFixed(2)}/${fuelRecord.unit}`}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SpeedIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">Odometer</Typography>
                </Box>
                <Typography variant="h6">
                  {fuelRecord.odometer ? 
                    `${fuelRecord.odometer.value?.toLocaleString() || fuelRecord.odometerReading?.toLocaleString() || 'N/A'} ${fuelRecord.odometer?.unit || 'km'}` : 
                    fuelRecord.odometerReading ? `${fuelRecord.odometerReading.toLocaleString()} km` : 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Additional Information</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">Station</Typography>
                </Box>
                <Typography variant="h6">{fuelRecord.station || 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" color="text.secondary">Location</Typography>
                </Box>
                <Typography variant="h6">{fuelRecord.location || 'N/A'}</Typography>
              </Grid>
              
              {fuelRecord.notes && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <NoteIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="subtitle1" color="text.secondary">Notes</Typography>
                  </Box>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body1">{fuelRecord.notes}</Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Right column - Stats and summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Fuel Summary</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Total Cost</Typography>
                        <Typography variant="h4">${fuelRecord.totalCost.toFixed(2)}</Typography>
                      </Box>
                      <AttachMoneyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">Quantity</Typography>
                    <Typography variant="h6">{fuelRecord.quantity} {fuelRecord.unit}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">Price per Unit</Typography>
                    <Typography variant="h6">
                      ${(fuelRecord.totalCost / fuelRecord.quantity).toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {(fuelRecord.odometer || fuelRecord.odometerReading) && fuelRecord.vehicle && fuelRecord.vehicle.currentOdometer && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">Distance Since Last Refill</Typography>
                      <Typography variant="h6">
                        {((fuelRecord.odometer?.value || fuelRecord.odometerReading || 0) - (fuelRecord.vehicle.previousFuelOdometer?.value || 0)) || 'N/A'} {fuelRecord.odometer?.unit || 'km'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              
              {fuelRecord.vehicle && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<DirectionsCarIcon />}
                      onClick={() => navigate(`/vehicles/${fuelRecord.vehicle?.['_id']}`)}
                    >
                      View Vehicle Details
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

export default FuelDetail;
