import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Box,
  Paper,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CloudIcon from '@mui/icons-material/Cloud';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HelpIcon from '@mui/icons-material/Help';
import WarningIcon from '@mui/icons-material/Warning';
import SyncIcon from '@mui/icons-material/Sync';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import CodeIcon from '@mui/icons-material/Code';
import ApiIcon from '@mui/icons-material/Api';
import DescriptionIcon from '@mui/icons-material/Description';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BuildIcon from '@mui/icons-material/Build';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import MapIcon from '@mui/icons-material/Map';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PaymentIcon from '@mui/icons-material/Payment';

interface IntegrationCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'telematics' | 'maintenance' | 'fuel' | 'mapping' | 'erp' | 'payment' | 'other';
  status: 'connected' | 'disconnected' | 'pending' | 'error';
  lastSync?: string;
  apiKey?: string;
  documentationUrl?: string;
}

interface ApiEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters?: string;
  responseExample?: string;
}

const mockIntegrations: IntegrationCard[] = [
  {
    id: 'int1',
    title: 'Geotab',
    description: 'Connect to Geotab telematics platform for vehicle tracking and diagnostics',
    icon: <LocalShippingIcon />,
    category: 'telematics',
    status: 'connected',
    lastSync: '2025-03-19T15:30:00',
    apiKey: '****-****-****-abcd',
    documentationUrl: 'https://geotab.com/api-documentation/'
  },
  {
    id: 'int2',
    title: 'Fleetio',
    description: 'Integrate with Fleetio for maintenance management and service records',
    icon: <BuildIcon />,
    category: 'maintenance',
    status: 'connected',
    lastSync: '2025-03-19T14:15:00',
    apiKey: '****-****-****-efgh',
    documentationUrl: 'https://developer.fleetio.com/'
  },
  {
    id: 'int3',
    title: 'WEX Fuel Cards',
    description: 'Connect to WEX fuel card system for fuel transaction data',
    icon: <LocalGasStationIcon />,
    category: 'fuel',
    status: 'error',
    lastSync: '2025-03-18T09:45:00',
    apiKey: '****-****-****-ijkl',
    documentationUrl: 'https://developer.wexinc.com/'
  },
  {
    id: 'int4',
    title: 'Google Maps',
    description: 'Integrate with Google Maps API for routing and geocoding',
    icon: <MapIcon />,
    category: 'mapping',
    status: 'connected',
    lastSync: '2025-03-19T16:00:00',
    apiKey: '****-****-****-mnop',
    documentationUrl: 'https://developers.google.com/maps/documentation'
  },
  {
    id: 'int5',
    title: 'SAP ERP',
    description: 'Connect to SAP ERP system for business data integration',
    icon: <StorageIcon />,
    category: 'erp',
    status: 'disconnected',
    documentationUrl: 'https://developers.sap.com/'
  },
  {
    id: 'int6',
    title: 'Stripe',
    description: 'Payment processing integration for invoices and subscriptions',
    icon: <PaymentIcon />,
    category: 'payment',
    status: 'connected',
    lastSync: '2025-03-19T12:30:00',
    apiKey: '****-****-****-qrst',
    documentationUrl: 'https://stripe.com/docs/api'
  },
  {
    id: 'int7',
    title: 'Samsara',
    description: 'Connect to Samsara IoT platform for vehicle and asset tracking',
    icon: <LocalShippingIcon />,
    category: 'telematics',
    status: 'pending',
    documentationUrl: 'https://developers.samsara.com/'
  },
  {
    id: 'int8',
    title: 'Quickbooks',
    description: 'Accounting software integration for financial data',
    icon: <ReceiptIcon />,
    category: 'erp',
    status: 'disconnected',
    documentationUrl: 'https://developer.intuit.com/app/developer/qbo/docs/api/accounting/most-commonly-used/account'
  },
];

const mockApiEndpoints: ApiEndpoint[] = [
  {
    id: 'api1',
    name: 'Vehicle Location',
    path: '/api/integrations/telematics/location',
    method: 'GET',
    description: 'Get real-time location data for all vehicles from connected telematics providers',
    parameters: 'vehicleId (optional), provider (optional)',
    responseExample: '{"vehicles": [{"id": "v123", "lat": 40.7128, "lng": -74.0060, "heading": 90, "speed": 35, "timestamp": "2025-03-19T16:00:00Z"}]}'
  },
  {
    id: 'api2',
    name: 'Maintenance Records',
    path: '/api/integrations/maintenance/records',
    method: 'GET',
    description: 'Retrieve maintenance records from connected maintenance systems',
    parameters: 'vehicleId (optional), dateFrom, dateTo, status (optional)',
    responseExample: '{"records": [{"id": "m456", "vehicleId": "v123", "type": "oil_change", "date": "2025-03-15", "odometer": 45000, "provider": "Fleetio"}]}'
  },
  {
    id: 'api3',
    name: 'Fuel Transactions',
    path: '/api/integrations/fuel/transactions',
    method: 'GET',
    description: 'Get fuel transaction data from connected fuel card providers',
    parameters: 'vehicleId (optional), driverId (optional), dateFrom, dateTo',
    responseExample: '{"transactions": [{"id": "f789", "vehicleId": "v123", "driverId": "d456", "gallons": 15.5, "cost": 62.00, "location": "Gas Station XYZ", "timestamp": "2025-03-18T14:30:00Z"}]}'
  },
  {
    id: 'api4',
    name: 'Route Optimization',
    path: '/api/integrations/mapping/optimize',
    method: 'POST',
    description: 'Optimize routes using connected mapping providers',
    parameters: 'JSON body with stops array, start/end locations, constraints',
    responseExample: '{"route": {"distance": 45.6, "duration": 3600, "stops": [{"order": 1, "lat": 40.7128, "lng": -74.0060, "estimatedArrival": "2025-03-19T10:30:00Z"}]}}'
  },
  {
    id: 'api5',
    name: 'Sync Integration',
    path: '/api/integrations/{provider}/sync',
    method: 'POST',
    description: 'Manually trigger a sync with the specified integration provider',
    parameters: 'provider (path parameter), syncOptions (optional JSON body)',
    responseExample: '{"status": "success", "message": "Sync initiated", "jobId": "j123"}'
  },
];

const ThirdPartyIntegration: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationCard | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newIntegrationCategory, setNewIntegrationCategory] = useState('');
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleIntegrationClick = (integration: IntegrationCard) => {
    setSelectedIntegration(integration);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleNewIntegration = () => {
    // In a real app, this would open a form to add a new integration
    console.log('Adding new integration');
  };

  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNewIntegrationCategory(event.target.value as string);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'disconnected': return <ErrorIcon sx={{ color: 'text.disabled' }} />;
      case 'pending': return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'error': return <ErrorIcon sx={{ color: 'error.main' }} />;
      default: return <HelpIcon />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      case 'pending': return 'Pending';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'telematics': return 'primary';
      case 'maintenance': return 'secondary';
      case 'fuel': return 'success';
      case 'mapping': return 'info';
      case 'erp': return 'warning';
      case 'payment': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Third-Party Integrations
        </Typography>
        <Typography variant="body1" paragraph>
          Connect your fleet management system with third-party services and applications to extend functionality and streamline operations.
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="integration tabs">
            <Tab label="Available Integrations" />
            <Tab label="API Documentation" />
            <Tab label="Integration Settings" />
            <Tab label="Logs & Monitoring" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Manage Integrations</Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={handleNewIntegration}
                >
                  Add Integration
                </Button>
              </Box>

              {mockIntegrations.some(int => int.status === 'error') && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <AlertTitle>Integration Issues Detected</AlertTitle>
                  One or more integrations are reporting errors. Please check the integration details for more information.
                </Alert>
              )}

              <Grid container spacing={3}>
                {mockIntegrations.map((integration) => (
                  <Grid item xs={12} sm={6} md={4} key={integration.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                        }
                      }}
                      onClick={() => handleIntegrationClick(integration)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ 
                              p: 1, 
                              borderRadius: '50%', 
                              bgcolor: `${getCategoryColor(integration.category)}.light`,
                              color: `${getCategoryColor(integration.category)}.main`,
                              mr: 2
                            }}>
                              {integration.icon}
                            </Box>
                            <Typography variant="h6" component="div">
                              {integration.title}
                            </Typography>
                          </Box>
                          {getStatusIcon(integration.status)}
                        </Box>
                        
                        <Chip 
                          label={integration.category.toUpperCase()} 
                          size="small" 
                          color={getCategoryColor(integration.category)} 
                          sx={{ mt: 2, mb: 2 }}
                        />
                        
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {integration.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Status: {getStatusText(integration.status)}
                          </Typography>
                          {integration.lastSync && (
                            <Typography variant="caption" color="text.secondary">
                              Last sync: {formatDate(integration.lastSync)}
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {tabValue === 1 && (
            <>
              <Typography variant="h6" gutterBottom>API Documentation</Typography>
              <Typography variant="body2" paragraph>
                Use these API endpoints to interact with your integrated third-party services.
              </Typography>
              
              <List sx={{ bgcolor: 'background.paper' }}>
                {mockApiEndpoints.map((endpoint) => (
                  <React.Fragment key={endpoint.id}>
                    <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', py: 2 }}>
                      <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', mb: 1 }}>
                        <Chip 
                          label={endpoint.method} 
                          color={endpoint.method === 'GET' ? 'info' : endpoint.method === 'POST' ? 'success' : endpoint.method === 'PUT' ? 'warning' : 'error'}
                          size="small"
                          sx={{ mr: 2, minWidth: 60, textAlign: 'center' }}
                        />
                        <Typography variant="subtitle1" component="div" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                          {endpoint.path}
                        </Typography>
                      </Box>
                      
                      <Typography variant="h6" sx={{ mt: 1 }}>{endpoint.name}</Typography>
                      <Typography variant="body2" paragraph>
                        {endpoint.description}
                      </Typography>
                      
                      {endpoint.parameters && (
                        <Box sx={{ mt: 1, mb: 1 }}>
                          <Typography variant="subtitle2">Parameters:</Typography>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'background.default', p: 1, borderRadius: 1 }}>
                            {endpoint.parameters}
                          </Typography>
                        </Box>
                      )}
                      
                      {endpoint.responseExample && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="subtitle2">Example Response:</Typography>
                          <Box sx={{ 
                            fontFamily: 'monospace', 
                            bgcolor: 'background.default', 
                            p: 1, 
                            borderRadius: 1,
                            maxHeight: 150,
                            overflow: 'auto'
                          }}>
                            <Typography variant="body2">
                              {endpoint.responseExample}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </>
          )}

          {tabValue === 2 && (
            <Typography variant="body1">Integration settings content would be displayed here.</Typography>
          )}

          {tabValue === 3 && (
            <Typography variant="body1">Logs and monitoring content would be displayed here.</Typography>
          )}
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedIntegration && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: '50%', 
                  bgcolor: `${getCategoryColor(selectedIntegration.category)}.light`,
                  color: `${getCategoryColor(selectedIntegration.category)}.main`,
                  mr: 2
                }}>
                  {selectedIntegration.icon}
                </Box>
                {selectedIntegration.title} Integration
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ mr: 2 }}>Status:</Typography>
                    <Chip 
                      icon={getStatusIcon(selectedIntegration.status)} 
                      label={getStatusText(selectedIntegration.status)} 
                      color={selectedIntegration.status === 'connected' ? 'success' : 
                             selectedIntegration.status === 'error' ? 'error' : 
                             selectedIntegration.status === 'pending' ? 'warning' : 'default'}
                    />
                    {selectedIntegration.status === 'error' && (
                      <Button 
                        startIcon={<SyncIcon />} 
                        color="primary" 
                        variant="outlined" 
                        size="small" 
                        sx={{ ml: 2 }}
                      >
                        Retry Connection
                      </Button>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                  <Typography variant="body1">{selectedIntegration.category.charAt(0).toUpperCase() + selectedIntegration.category.slice(1)}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Last Synchronized</Typography>
                  <Typography variant="body1">{formatDate(selectedIntegration.lastSync)}</Typography>
                </Grid>
                
                {selectedIntegration.apiKey && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">API Key</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        value={selectedIntegration.apiKey}
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <Button variant="text" size="small">
                              Regenerate
                            </Button>
                          ),
                        }}
                        sx={{ my: 1 }}
                      />
                    </Box>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                  <Typography variant="body1" paragraph>{selectedIntegration.description}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Configuration</Typography>
                  <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Sync Frequency</InputLabel>
                          <Select
                            value="hourly"
                            label="Sync Frequency"
                          >
                            <MenuItem value="realtime">Real-time</MenuItem>
                            <MenuItem value="hourly">Hourly</MenuItem>
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Data Retention</InputLabel>
                          <Select
                            value="90days"
                            label="Data Retention"
                          >
                            <MenuItem value="30days">30 Days</MenuItem>
                            <MenuItem value="90days">90 Days</MenuItem>
                            <MenuItem value="1year">1 Year</MenuItem>
                            <MenuItem value="forever">Forever</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body2">Enable Automatic Sync</Typography>
                          <Switch checked={true} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body2">Sync Historical Data</Typography>
                          <Switch checked={false} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body2">Enable Webhooks</Typography>
                          <Switch checked={true} />
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                
                {selectedIntegration.documentationUrl && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <DescriptionIcon sx={{ mr: 1 }} color="primary" />
                      <Typography variant="body2">
                        <Link to={selectedIntegration.documentationUrl} target="_blank" rel="noopener">
                          View {selectedIntegration.title} API Documentation
                        </Link>
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              {selectedIntegration.status === 'connected' ? (
                <Button color="error" variant="outlined">Disconnect</Button>
              ) : (
                <Button color="primary" variant="contained">Connect</Button>
              )}
              <Button color="primary" variant="contained" startIcon={<SyncIcon />}>
                Sync Now
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ThirdPartyIntegration;
