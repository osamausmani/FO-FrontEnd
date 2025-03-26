import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Link as LinkIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const ThirdPartyIntegration: React.FC = () => {
  const [integrations, setIntegrations] = useState([
    { id: 1, name: 'Salesforce', status: 'Connected', type: 'CRM', lastSync: '2023-06-15 14:30' },
    { id: 2, name: 'QuickBooks', status: 'Connected', type: 'Accounting', lastSync: '2023-06-14 09:45' },
    { id: 3, name: 'Shopify', status: 'Disconnected', type: 'E-commerce', lastSync: 'N/A' },
    { id: 4, name: 'Slack', status: 'Connected', type: 'Communication', lastSync: '2023-06-15 16:20' },
    { id: 5, name: 'Zapier', status: 'Connected', type: 'Automation', lastSync: '2023-06-15 10:15' },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentIntegration, setCurrentIntegration] = useState<any>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleOpenDialog = (integration: any = null) => {
    setCurrentIntegration(integration || { name: '', type: '', status: 'Disconnected' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveIntegration = () => {
    if (currentIntegration.id) {
      // Update existing integration
      setIntegrations(integrations.map(item => 
        item.id === currentIntegration.id ? currentIntegration : item
      ));
      setSnackbar({ open: true, message: 'Integration updated successfully', severity: 'success' });
    } else {
      // Add new integration
      const newIntegration = {
        ...currentIntegration,
        id: Math.max(...integrations.map(i => i.id)) + 1,
        lastSync: 'N/A'
      };
      setIntegrations([...integrations, newIntegration]);
      setSnackbar({ open: true, message: 'Integration added successfully', severity: 'success' });
    }
    handleCloseDialog();
  };

  const handleDeleteIntegration = (id: number) => {
    setIntegrations(integrations.filter(item => item.id !== id));
    setSnackbar({ open: true, message: 'Integration removed successfully', severity: 'success' });
  };

  const handleToggleConnection = (id: number) => {
    setIntegrations(integrations.map(item => {
      if (item.id === id) {
        const newStatus = item.status === 'Connected' ? 'Disconnected' : 'Connected';
        const lastSync = newStatus === 'Connected' ? new Date().toLocaleString() : 'N/A';
        return { ...item, status: newStatus, lastSync };
      }
      return item;
    }));

    const integration = integrations.find(item => item.id === id);
    const newStatus = integration?.status === 'Connected' ? 'Disconnected' : 'Connected';
    setSnackbar({ 
      open: true, 
      message: `${integration?.name} ${newStatus.toLowerCase()} successfully`, 
      severity: 'success' 
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<any>) => {
    const { name, value } = e.target;
    setCurrentIntegration({ ...currentIntegration, [name as string]: value });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Third-Party Integrations</Typography>
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1">
          Connect your fleet management system with other business applications and services.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Integration
        </Button>
      </Box>

      <Grid container spacing={3}>
        {integrations.map((integration) => (
          <Grid item xs={12} md={6} lg={4} key={integration.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{integration.name}</Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: integration.status === 'Connected' ? 'success.main' : 'error.main',
                      bgcolor: integration.status === 'Connected' ? 'success.light' : 'error.light',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1
                    }}
                  >
                    {integration.status}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Type: {integration.type}
                </Typography>
                
                <Typography variant="body2" color="textSecondary">
                  Last Synchronized: {integration.lastSync}
                </Typography>
              </CardContent>
              <Divider />
              <CardActions>
                <Tooltip title="Edit Integration">
                  <IconButton size="small" onClick={() => handleOpenDialog(integration)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={integration.status === 'Connected' ? 'Disconnect' : 'Connect'}>
                  <IconButton 
                    size="small" 
                    color={integration.status === 'Connected' ? 'error' : 'success'}
                    onClick={() => handleToggleConnection(integration.id)}
                  >
                    {integration.status === 'Connected' ? <CloseIcon /> : <CheckIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Integration">
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleDeleteIntegration(integration.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Integration Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentIntegration?.id ? 'Edit Integration' : 'Add New Integration'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Integration Name"
              name="name"
              value={currentIntegration?.name || ''}
              onChange={handleInputChange}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Integration Type</InputLabel>
              <Select
                name="type"
                value={currentIntegration?.type || ''}
                label="Integration Type"
                onChange={handleInputChange}
              >
                <MenuItem value="CRM">CRM</MenuItem>
                <MenuItem value="Accounting">Accounting</MenuItem>
                <MenuItem value="E-commerce">E-commerce</MenuItem>
                <MenuItem value="Communication">Communication</MenuItem>
                <MenuItem value="Automation">Automation</MenuItem>
                <MenuItem value="Analytics">Analytics</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={currentIntegration?.status || 'Disconnected'}
                label="Status"
                onChange={handleInputChange}
              >
                <MenuItem value="Connected">Connected</MenuItem>
                <MenuItem value="Disconnected">Disconnected</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveIntegration} 
            variant="contained" 
            color="primary"
            disabled={!currentIntegration?.name || !currentIntegration?.type}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity as 'success' | 'error'} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ThirdPartyIntegration;
