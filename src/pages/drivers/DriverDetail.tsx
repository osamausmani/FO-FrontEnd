import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Paper, 
  Grid, 
  Divider, 
  Chip, 
  Avatar, 
  CircularProgress, 
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../utils/api';
import { toast } from 'react-toastify';
import { RouteParams } from '../../types/common';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import NotesIcon from '@mui/icons-material/Notes';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

interface AssignedVehicle {
  name?: string;
  licensePlate?: string;
}

interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  dateOfHire: string;
  dateOfBirth?: string;
  address?: string;
  status: string;
  notes?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  assignedVehicle?: AssignedVehicle;
}

const DriverDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchDriverData();
    }
  }, [id]);

  const fetchDriverData = async (): Promise<void> => {
    if (!id) return;
    
    try {
      const response = await apiService.getDriver(id);
      setDriver(response.data);
    } catch (error) {
      console.error('Error fetching driver data:', error);
      setError('Failed to fetch driver data. Please try again.');
      toast.error('Failed to fetch driver data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!id) return;
    
    try {
      await apiService.deleteDriver(id);
      toast.success('Driver deleted successfully');
      navigate('/drivers');
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('Failed to delete driver');
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={() => navigate('/drivers')} 
            sx={{ mr: 1 }}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">Driver Details</Typography>
        </Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!driver) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={() => navigate('/drivers')} 
            sx={{ mr: 1 }}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">Driver Details</Typography>
        </Box>
        <Alert severity="warning">Driver not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={() => navigate('/drivers')} 
            sx={{ mr: 1 }}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">Driver Details</Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/drivers/${id}/edit`)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Driver Overview Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main', fontSize: '2rem' }}
              >
                {driver.firstName?.charAt(0)}{driver.lastName?.charAt(0)}
              </Avatar>
              <Typography variant="h5" sx={{ textAlign: 'center' }}>
                {driver.firstName} {driver.lastName}
              </Typography>
              <Chip 
                icon={driver.status === 'active' ? <CheckCircleIcon /> : <DoDisturbIcon />}
                label={driver.status === 'active' ? 'Active' : 'Inactive'}
                color={driver.status === 'active' ? 'success' : 'error'}
                sx={{ mt: 1 }}
              />
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Email"
                  secondary={driver.email || 'N/A'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Phone"
                  secondary={driver.phone || 'N/A'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <BadgeIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="License Number"
                  secondary={driver.licenseNumber || 'N/A'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="License Expiry"
                  secondary={formatDate(driver.licenseExpiry)}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DirectionsCarIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Assigned Vehicle"
                  secondary={driver.assignedVehicle ? driver.assignedVehicle.name || driver.assignedVehicle.licensePlate : 'Not Assigned'}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Driver Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
              Personal Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <HomeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2">Address</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {driver.address || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2">Date of Birth</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(driver.dateOfBirth)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2">Date of Hire</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(driver.dateOfHire)}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
              Emergency Contact
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2">Contact Name</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {driver.emergencyContactName || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ContactPhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2">Contact Phone</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {driver.emergencyContactPhone || 'N/A'}
                </Typography>
              </Grid>
            </Grid>

            {driver.notes && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  Notes
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <NotesIcon sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {driver.notes}
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Driver</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete driver "{driver.firstName} {driver.lastName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DriverDetail;
