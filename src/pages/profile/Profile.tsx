import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import { toast } from 'react-toastify';
import apiService from '../../utils/api';

// Icons
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    role: ''
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string>('');

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async (): Promise<void> => {
      setLoading(true);
      try {
        const response = await apiService.getCurrentUser();
        if (response.data) {
          setProfileData({
            name: response.data.name || '',
            email: response.data.email || '',
            phone: response.data.phone || '',
            role: response.data.role || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile form change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  // Handle password form change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });

    // Clear password error when user starts typing again
    if (passwordError) {
      setPasswordError('');
    }
  };

  // Save profile
  const saveProfile = async (): Promise<void> => {
    setSaveLoading(true);
    try {
      await apiService.updateUserProfile(profileData);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  // Change password
  const changePassword = async (): Promise<void> => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    setSaveLoading(true);
    try {
      await apiService.changePassword(passwordData);
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      if (error.response && error.response.status === 401) {
        setPasswordError('Current password is incorrect');
      } else {
        toast.error('Failed to change password');
      }
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>My Profile</Typography>
      
      <Grid container spacing={3}>
        {/* Profile Information Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  mr: 2 
                }}
              >
                {profileData.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h5">{profileData.name}</Typography>
                <Typography variant="body1" color="text.secondary">{profileData.role}</Typography>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Personal Information
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Role"
                  value={profileData.role}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={saveProfile}
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Password Change Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <LockIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Change Password
            </Typography>
            
            <Divider sx={{ mb: 3 }} />
            
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  helperText="Password must be at least 6 characters long"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<LockIcon />}
                  onClick={changePassword}
                  disabled={saveLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                >
                  {saveLoading ? 'Changing...' : 'Change Password'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Account Activity Card */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Account Activity</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary">Last Login</Typography>
                    <Typography variant="body1">Today, 10:30 AM</Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary">Account Created</Typography>
                    <Typography variant="body1">January 15, 2023</Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary">Password Last Changed</Typography>
                    <Typography variant="body1">March 5, 2023</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
