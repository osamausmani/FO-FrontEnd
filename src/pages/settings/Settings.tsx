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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Tab,
  Tabs,
  Alert,
  Switch,
  FormControlLabel,
  SelectChangeEvent
} from '@mui/material';
import { toast } from 'react-toastify';
import apiService from '../../utils/api';

// Icons
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

// Tab panel component
function TabPanel(props: TabPanelProps): JSX.Element {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CompanyData {
  name: string;
  address: Address;
  phone: string;
  email: string;
  website: string;
}

interface PreferencesData {
  currency: string;
  distanceUnit: string;
  fuelEfficiencyUnit: string;
  dateFormat: string;
  timeZone: string;
}

interface SecurityData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationData {
  emailNotifications: boolean;
  pushNotifications: boolean;
  maintenanceAlerts: boolean;
  fuelAlerts: boolean;
  routeUpdates: boolean;
  driverUpdates: boolean;
}

const Settings: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    role: ''
  });
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    phone: '',
    email: '',
    website: ''
  });
  const [preferencesData, setPreferencesData] = useState<PreferencesData>({
    currency: 'USD',
    distanceUnit: 'km',
    fuelEfficiencyUnit: 'km/l',
    dateFormat: 'MM/DD/YYYY',
    timeZone: 'UTC'
  });
  const [securityData, setSecurityData] = useState<SecurityData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notificationData, setNotificationData] = useState<NotificationData>({
    emailNotifications: true,
    pushNotifications: true,
    maintenanceAlerts: true,
    fuelAlerts: true,
    routeUpdates: true,
    driverUpdates: true
  });

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue);
  };

  // Fetch user and company data
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      try {
        // Fetch user profile
        const userResponse = await apiService.getCurrentUser();
        if (userResponse.data) {
          setProfileData({
            name: userResponse.data.name || '',
            email: userResponse.data.email || '',
            phone: userResponse.data.phone || '',
            role: userResponse.data.role || ''
          });
        }

        // Fetch company data
        const companyResponse = await apiService.getCompanyProfile();
        if (companyResponse.data) {
          setCompanyData({
            name: companyResponse.data.name || '',
            address: {
              street: companyResponse.data.address?.street || '',
              city: companyResponse.data.address?.city || '',
              state: companyResponse.data.address?.state || '',
              zipCode: companyResponse.data.address?.zipCode || '',
              country: companyResponse.data.address?.country || ''
            },
            phone: companyResponse.data.phone || '',
            email: companyResponse.data.email || '',
            website: companyResponse.data.website || ''
          });

          // Set preferences
          if (companyResponse.data.settings) {
            setPreferencesData({
              currency: companyResponse.data.settings.currency || 'USD',
              distanceUnit: companyResponse.data.settings.distanceUnit || 'km',
              fuelEfficiencyUnit: companyResponse.data.settings.fuelEfficiencyUnit || 'km/l',
              dateFormat: companyResponse.data.settings.dateFormat || 'MM/DD/YYYY',
              timeZone: companyResponse.data.settings.timeZone || 'UTC'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching settings data:', error);
        toast.error('Failed to load settings data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle profile form change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>): void => {
    const { name, value } = e.target;
    if (name) {
      setProfileData({
        ...profileData,
        [name]: value
      });
    }
  };

  // Handle company form change
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>): void => {
    const { name, value } = e.target;
    if (name) {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setCompanyData({
          ...companyData,
          [parent]: {
            ...companyData[parent as keyof CompanyData] as Address,
            [child]: value
          }
        });
      } else {
        setCompanyData({
          ...companyData,
          [name]: value
        });
      }
    }
  };

  // Handle preferences form change
  const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>): void => {
    const { name, value } = e.target;
    if (name) {
      setPreferencesData({
        ...preferencesData,
        [name]: value
      });
    }
  };

  // Handle security form change
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setSecurityData({
      ...securityData,
      [name]: value
    });
  };

  // Handle notification form change
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, checked } = e.target;
    setNotificationData({
      ...notificationData,
      [name]: checked
    });
  };

  // Save profile settings
  const saveProfileSettings = async (): Promise<void> => {
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

  // Save company settings
  const saveCompanySettings = async (): Promise<void> => {
    setSaveLoading(true);
    try {
      await apiService.updateCompanyProfile(companyData);
      toast.success('Company information updated successfully');
    } catch (error) {
      console.error('Error updating company information:', error);
      toast.error('Failed to update company information');
    } finally {
      setSaveLoading(false);
    }
  };

  // Save preferences settings
  const savePreferencesSettings = async (): Promise<void> => {
    setSaveLoading(true);
    try {
      await apiService.updateCompanySettings(preferencesData);
      toast.success('Preferences updated successfully');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    } finally {
      setSaveLoading(false);
    }
  };

  // Save security settings
  const saveSecuritySettings = async (): Promise<void> => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    setSaveLoading(true);
    try {
      await apiService.changePassword(securityData);
      toast.success('Password changed successfully');
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setSaveLoading(false);
    }
  };

  // Save notification settings
  const saveNotificationSettings = async (): Promise<void> => {
    setSaveLoading(true);
    try {
      await apiService.updateNotificationSettings(notificationData);
      toast.success('Notification settings updated successfully');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update notification settings');
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
      <Typography variant="h4" gutterBottom>Settings</Typography>
      
      <Paper sx={{ mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="settings tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<PersonIcon />} label="Profile" />
            <Tab icon={<BusinessIcon />} label="Company" />
            <Tab icon={<SecurityIcon />} label="Security" />
            <Tab icon={<NotificationsIcon />} label="Notifications" />
          </Tabs>
        </Box>
        
        {/* Profile Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Personal Information</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleProfileChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={profileData.role}
                  label="Role"
                  onChange={handleProfileChange as (event: SelectChangeEvent<string>) => void}
                  disabled
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={saveProfileSettings}
                disabled={saveLoading}
              >
                {saveLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Company Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Company Information</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="name"
                value={companyData.name}
                onChange={handleCompanyChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Email"
                name="email"
                type="email"
                value={companyData.email}
                onChange={handleCompanyChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={companyData.phone}
                onChange={handleCompanyChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={companyData.website}
                onChange={handleCompanyChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Address</Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                name="address.street"
                value={companyData.address.street}
                onChange={handleCompanyChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                name="address.city"
                value={companyData.address.city}
                onChange={handleCompanyChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="State/Province"
                name="address.state"
                value={companyData.address.state}
                onChange={handleCompanyChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Postal Code"
                name="address.zipCode"
                value={companyData.address.zipCode}
                onChange={handleCompanyChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Country"
                name="address.country"
                value={companyData.address.country}
                onChange={handleCompanyChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Preferences</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  name="currency"
                  value={preferencesData.currency}
                  label="Currency"
                  onChange={handlePreferencesChange as (event: SelectChangeEvent<string>) => void}
                >
                  <MenuItem value="USD">USD ($)</MenuItem>
                  <MenuItem value="EUR">EUR (€)</MenuItem>
                  <MenuItem value="GBP">GBP (£)</MenuItem>
                  <MenuItem value="PKR">PKR (₨)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Distance Unit</InputLabel>
                <Select
                  name="distanceUnit"
                  value={preferencesData.distanceUnit}
                  label="Distance Unit"
                  onChange={handlePreferencesChange as (event: SelectChangeEvent<string>) => void}
                >
                  <MenuItem value="km">Kilometers (km)</MenuItem>
                  <MenuItem value="mi">Miles (mi)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Fuel Efficiency Unit</InputLabel>
                <Select
                  name="fuelEfficiencyUnit"
                  value={preferencesData.fuelEfficiencyUnit}
                  label="Fuel Efficiency Unit"
                  onChange={handlePreferencesChange as (event: SelectChangeEvent<string>) => void}
                >
                  <MenuItem value="km/l">km/l</MenuItem>
                  <MenuItem value="mpg">mpg</MenuItem>
                  <MenuItem value="l/100km">l/100km</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Date Format</InputLabel>
                <Select
                  name="dateFormat"
                  value={preferencesData.dateFormat}
                  label="Date Format"
                  onChange={handlePreferencesChange as (event: SelectChangeEvent<string>) => void}
                >
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                  <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                  <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={saveCompanySettings}
                disabled={saveLoading}
                sx={{ mr: 2 }}
              >
                {saveLoading ? 'Saving...' : 'Save Company Info'}
              </Button>
              
              <Button
                variant="contained"
                color="secondary"
                startIcon={<SaveIcon />}
                onClick={savePreferencesSettings}
                disabled={saveLoading}
              >
                {saveLoading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Security Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Password & Security</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                For security reasons, you need to enter your current password to make any changes.
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type="password"
                value={securityData.currentPassword}
                onChange={handleSecurityChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={securityData.newPassword}
                onChange={handleSecurityChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={securityData.confirmPassword}
                onChange={handleSecurityChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={saveSecuritySettings}
                disabled={saveLoading || !securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword}
              >
                {saveLoading ? 'Saving...' : 'Change Password'}
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Communication Channels</Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationData.emailNotifications}
                        onChange={handleNotificationChange}
                        name="emailNotifications"
                        color="primary"
                      />
                    }
                    label="Email Notifications"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationData.pushNotifications}
                        onChange={handleNotificationChange}
                        name="pushNotifications"
                        color="primary"
                      />
                    }
                    label="Push Notifications"
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Alert Types</Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationData.maintenanceAlerts}
                        onChange={handleNotificationChange}
                        name="maintenanceAlerts"
                        color="primary"
                      />
                    }
                    label="Maintenance Alerts"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationData.fuelAlerts}
                        onChange={handleNotificationChange}
                        name="fuelAlerts"
                        color="primary"
                      />
                    }
                    label="Fuel Alerts"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationData.routeUpdates}
                        onChange={handleNotificationChange}
                        name="routeUpdates"
                        color="primary"
                      />
                    }
                    label="Route Updates"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationData.driverUpdates}
                        onChange={handleNotificationChange}
                        name="driverUpdates"
                        color="primary"
                      />
                    }
                    label="Driver Updates"
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={saveNotificationSettings}
                disabled={saveLoading}
              >
                {saveLoading ? 'Saving...' : 'Save Notification Settings'}
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Settings;
