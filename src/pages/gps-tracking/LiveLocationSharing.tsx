import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  SelectChangeEvent
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TimerIcon from '@mui/icons-material/Timer';
import QrCodeIcon from '@mui/icons-material/QrCode';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  driver: string;
  isSharing: boolean;
  shareExpiry: string | null;
  shareType: 'public' | 'private' | 'none';
  shareLink?: string;
  shareRecipients?: ShareRecipient[];
}

interface ShareRecipient {
  id: string;
  name: string;
  email: string;
  accessType: 'view' | 'track';
  lastAccessed?: string;
}

interface ShareHistory {
  id: string;
  vehicleId: string;
  vehicleName: string;
  shareType: 'public' | 'private';
  createdAt: string;
  expiresAt: string | null;
  status: 'active' | 'expired' | 'revoked';
  accessCount: number;
  recipients?: ShareRecipient[];
}

const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    name: 'Truck 101',
    type: 'Heavy Duty Truck',
    driver: 'John Smith',
    isSharing: true,
    shareExpiry: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    shareType: 'private',
    shareLink: 'https://fleetorbit.com/share/v1/abc123',
    shareRecipients: [
      {
        id: 'r1',
        name: 'Acme Logistics',
        email: 'dispatch@acmelogistics.com',
        accessType: 'track',
        lastAccessed: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      },
      {
        id: 'r2',
        name: 'Warehouse B',
        email: 'receiving@warehouseb.com',
        accessType: 'view',
        lastAccessed: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    ]
  },
  {
    id: 'v2',
    name: 'Van 202',
    type: 'Delivery Van',
    driver: 'Sarah Johnson',
    isSharing: true,
    shareExpiry: new Date(Date.now() + 3600000 * 2).toISOString(), // 2 hours from now
    shareType: 'public',
    shareLink: 'https://fleetorbit.com/share/v2/def456'
  },
  {
    id: 'v3',
    name: 'Truck 303',
    type: 'Heavy Duty Truck',
    driver: 'Mike Davis',
    isSharing: false,
    shareExpiry: null,
    shareType: 'none'
  },
  {
    id: 'v4',
    name: 'Van 404',
    type: 'Delivery Van',
    driver: 'Lisa Wilson',
    isSharing: false,
    shareExpiry: null,
    shareType: 'none'
  },
  {
    id: 'v5',
    name: 'Truck 505',
    type: 'Medium Duty Truck',
    driver: 'Robert Taylor',
    isSharing: false,
    shareExpiry: null,
    shareType: 'none'
  }
];

const mockShareHistory: ShareHistory[] = [
  {
    id: 'sh1',
    vehicleId: 'v1',
    vehicleName: 'Truck 101',
    shareType: 'private',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    expiresAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    status: 'expired',
    accessCount: 8,
    recipients: [
      {
        id: 'r3',
        name: 'Acme Logistics',
        email: 'dispatch@acmelogistics.com',
        accessType: 'track'
      }
    ]
  },
  {
    id: 'sh2',
    vehicleId: 'v2',
    vehicleName: 'Van 202',
    shareType: 'public',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    expiresAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    status: 'expired',
    accessCount: 15
  },
  {
    id: 'sh3',
    vehicleId: 'v1',
    vehicleName: 'Truck 101',
    shareType: 'private',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    expiresAt: new Date(Date.now() - 86400000 * 8).toISOString(), // 8 days ago
    status: 'expired',
    accessCount: 5,
    recipients: [
      {
        id: 'r4',
        name: 'Warehouse C',
        email: 'manager@warehousec.com',
        accessType: 'view'
      }
    ]
  },
  {
    id: 'sh4',
    vehicleId: 'v3',
    vehicleName: 'Truck 303',
    shareType: 'public',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
    expiresAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    status: 'revoked',
    accessCount: 3
  }
];

const LiveLocationSharing: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareType, setShareType] = useState<'public' | 'private'>('private');
  const [shareExpiry, setShareExpiry] = useState('24');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [accessType, setAccessType] = useState<'view' | 'track'>('view');
  const [showHistory, setShowHistory] = useState(false);
  
  const handleShareTypeChange = (event: SelectChangeEvent) => {
    setShareType(event.target.value as 'public' | 'private');
  };
  
  const handleShareExpiryChange = (event: SelectChangeEvent) => {
    setShareExpiry(event.target.value);
  };
  
  const handleAccessTypeChange = (event: SelectChangeEvent) => {
    setAccessType(event.target.value as 'view' | 'track');
  };
  
  const handleOpenShareDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShareDialogOpen(true);
    // Pre-fill with existing settings if already sharing
    if (vehicle.isSharing) {
      if (vehicle.shareType !== 'none') {
        setShareType(vehicle.shareType);
      }
      if (vehicle.shareExpiry) {
        const now = new Date();
        const expiry = new Date(vehicle.shareExpiry);
        const diffHours = Math.round((expiry.getTime() - now.getTime()) / (1000 * 60 * 60));
        setShareExpiry(diffHours.toString());
      }
    }
  };
  
  const handleCloseShareDialog = () => {
    setShareDialogOpen(false);
  };
  
  const handleCreateShare = () => {
    // In a real app, this would call an API to create the share
    console.log('Creating share for', selectedVehicle?.name, 'with type', shareType, 'and expiry', shareExpiry);
    handleCloseShareDialog();
  };
  
  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    // In a real app, you would show a snackbar or toast notification
    console.log('Link copied to clipboard');
  };
  
  const handleRevokeShare = (vehicleId: string) => {
    // In a real app, this would call an API to revoke the share
    console.log('Revoking share for vehicle', vehicleId);
  };
  
  const handleAddRecipient = () => {
    // In a real app, this would call an API to add a recipient
    console.log('Adding recipient', recipientEmail, 'with access type', accessType);
    setRecipientEmail('');
  };
  
  const formatExpiryTime = (expiryDate: string | null) => {
    if (!expiryDate) return 'Never';
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expired';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Live Location Sharing
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Alert severity="info">
          Share real-time location of your vehicles with customers, partners, or other stakeholders for improved coordination and transparency.
        </Alert>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                <ShareIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Vehicle Sharing Status
              </Typography>
              
              <Box>
                <Button
                  variant="outlined"
                  onClick={() => setShowHistory(!showHistory)}
                  startIcon={showHistory ? <LocalShippingIcon /> : <AccessTimeIcon />}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  {showHistory ? 'Show Active Shares' : 'Show History'}
                </Button>
              </Box>
            </Box>
            
            {!showHistory ? (
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vehicle</TableCell>
                      <TableCell>Driver</TableCell>
                      <TableCell>Sharing Status</TableCell>
                      <TableCell>Share Type</TableCell>
                      <TableCell>Expiry</TableCell>
                      <TableCell>Recipients</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <LocalShippingIcon fontSize="small" sx={{ mr: 1 }} />
                            <Box>
                              <Typography variant="body2">{vehicle.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{vehicle.type}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                            {vehicle.driver}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={vehicle.isSharing}
                                onChange={() => handleRevokeShare(vehicle.id)}
                                disabled={!vehicle.isSharing}
                                size="small"
                              />
                            }
                            label={vehicle.isSharing ? 'Active' : 'Inactive'}
                          />
                        </TableCell>
                        <TableCell>
                          {vehicle.isSharing ? (
                            <Chip
                              label={vehicle.shareType === 'public' ? 'Public Link' : 'Private Share'}
                              color={vehicle.shareType === 'public' ? 'primary' : 'secondary'}
                              icon={vehicle.shareType === 'public' ? <LinkIcon /> : <GroupIcon />}
                              size="small"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">-</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {vehicle.isSharing ? (
                            <Box display="flex" alignItems="center">
                              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                              <Typography variant="body2">
                                {formatExpiryTime(vehicle.shareExpiry)}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">-</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {vehicle.isSharing && vehicle.shareType === 'private' && vehicle.shareRecipients ? (
                            <Chip
                              label={`${vehicle.shareRecipients.length} recipient${vehicle.shareRecipients.length !== 1 ? 's' : ''}`}
                              size="small"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">-</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box>
                            {vehicle.isSharing ? (
                              <>
                                {vehicle.shareLink && (
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleCopyLink(vehicle.shareLink || '')}
                                    title="Copy share link"
                                  >
                                    <ContentCopyIcon fontSize="small" />
                                  </IconButton>
                                )}
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleRevokeShare(vehicle.id)}
                                  title="Revoke sharing"
                                  color="error"
                                >
                                  <VisibilityOffIcon fontSize="small" />
                                </IconButton>
                              </>
                            ) : (
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<ShareIcon />}
                                onClick={() => handleOpenShareDialog(vehicle)}
                              >
                                Share
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vehicle</TableCell>
                      <TableCell>Share Type</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Expired</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Access Count</TableCell>
                      <TableCell>Recipients</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockShareHistory.map((history) => (
                      <TableRow key={history.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <LocalShippingIcon fontSize="small" sx={{ mr: 1 }} />
                            {history.vehicleName}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={history.shareType === 'public' ? 'Public Link' : 'Private Share'}
                            color={history.shareType === 'public' ? 'primary' : 'secondary'}
                            icon={history.shareType === 'public' ? <LinkIcon /> : <GroupIcon />}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(history.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {history.expiresAt ? new Date(history.expiresAt).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={history.status}
                            color={
                              history.status === 'active' ? 'success' :
                              history.status === 'expired' ? 'default' : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {history.accessCount}
                        </TableCell>
                        <TableCell>
                          {history.recipients ? (
                            <Chip
                              label={`${history.recipients.length} recipient${history.recipients.length !== 1 ? 's' : ''}`}
                              size="small"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">-</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <QrCodeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                QR Code Sharing
              </Typography>
              <Typography variant="body2" paragraph>
                Generate QR codes for quick sharing of vehicle location with customers or partners.
              </Typography>
              <Button variant="outlined" startIcon={<QrCodeIcon />}>
                Generate QR Code
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <TimerIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Scheduled Sharing
              </Typography>
              <Typography variant="body2" paragraph>
                Set up automatic location sharing for specific time periods or recurring schedules.
              </Typography>
              <Button variant="outlined" startIcon={<AccessTimeIcon />}>
                Configure Schedule
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Share Creation Dialog */}
      <Dialog open={shareDialogOpen} onClose={handleCloseShareDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Share Location: {selectedVehicle?.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            Create a shareable link to allow others to view the real-time location of this vehicle.
          </DialogContentText>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Share Type</InputLabel>
                <Select
                  value={shareType}
                  label="Share Type"
                  onChange={handleShareTypeChange}
                >
                  <MenuItem value="public">Public Link (Anyone with the link)</MenuItem>
                  <MenuItem value="private">Private (Specific recipients only)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Expiry Time</InputLabel>
                <Select
                  value={shareExpiry}
                  label="Expiry Time"
                  onChange={handleShareExpiryChange}
                >
                  <MenuItem value="2">2 hours</MenuItem>
                  <MenuItem value="4">4 hours</MenuItem>
                  <MenuItem value="8">8 hours</MenuItem>
                  <MenuItem value="24">1 day</MenuItem>
                  <MenuItem value="48">2 days</MenuItem>
                  <MenuItem value="72">3 days</MenuItem>
                  <MenuItem value="168">1 week</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {shareType === 'private' && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                    Add Recipients
                  </Typography>
                  <Box display="flex" alignItems="flex-start">
                    <TextField
                      label="Email Address"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      sx={{ mr: 1 }}
                    />
                    <FormControl sx={{ minWidth: 120, mr: 1 }}>
                      <InputLabel id="access-type-label">Access</InputLabel>
                      <Select
                        labelId="access-type-label"
                        value={accessType}
                        label="Access"
                        onChange={handleAccessTypeChange}
                        size="small"
                      >
                        <MenuItem value="view">View Only</MenuItem>
                        <MenuItem value="track">Full Tracking</MenuItem>
                      </Select>
                    </FormControl>
                    <Button 
                      variant="contained" 
                      onClick={handleAddRecipient}
                      disabled={!recipientEmail}
                    >
                      Add
                    </Button>
                  </Box>
                </Grid>
                
                {selectedVehicle?.shareRecipients && selectedVehicle.shareRecipients.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                      Current Recipients
                    </Typography>
                    <List dense>
                      {selectedVehicle.shareRecipients.map((recipient) => (
                        <ListItem key={recipient.id}>
                          <ListItemIcon>
                            <PersonIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={recipient.name}
                            secondary={
                              <>
                                {recipient.email}
                                {recipient.lastAccessed && (
                                  <Typography variant="caption" display="block">
                                    Last accessed: {new Date(recipient.lastAccessed).toLocaleString()}
                                  </Typography>
                                )}
                              </>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Chip
                              label={recipient.accessType === 'view' ? 'View Only' : 'Full Tracking'}
                              size="small"
                              color={recipient.accessType === 'track' ? 'primary' : 'default'}
                            />
                            <IconButton edge="end" aria-label="delete" size="small">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseShareDialog}>Cancel</Button>
          <Button onClick={handleCreateShare} variant="contained" startIcon={<ShareIcon />}>
            Create Share
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LiveLocationSharing;
