import React, { useState, ReactElement } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  IconButton,
  Chip
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import LayersIcon from '@mui/icons-material/Layers';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PlaceIcon from '@mui/icons-material/Place';
import RouteIcon from '@mui/icons-material/Route';
import TrafficIcon from '@mui/icons-material/Traffic';
import WeatherIcon from '@mui/icons-material/Cloud';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import StoreIcon from '@mui/icons-material/Store';
import SchoolIcon from '@mui/icons-material/School';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HotelIcon from '@mui/icons-material/Hotel';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

interface MapLayer {
  id: string;
  name: string;
  type: 'system' | 'custom';
  category: 'vehicle' | 'infrastructure' | 'traffic' | 'weather' | 'poi' | 'custom';
  enabled: boolean;
  icon: React.ReactElement;
  description: string;
}

const CustomMapOverlays: React.FC = () => {
  const [systemLayers, setSystemLayers] = useState<MapLayer[]>([
    {
      id: 'vehicles',
      name: 'Vehicles',
      type: 'system',
      category: 'vehicle',
      enabled: true,
      icon: <LocalShippingIcon />,
      description: 'Show all fleet vehicles on the map'
    },
    {
      id: 'routes',
      name: 'Active Routes',
      type: 'system',
      category: 'vehicle',
      enabled: true,
      icon: <RouteIcon />,
      description: 'Display active routes for all vehicles'
    },
    {
      id: 'traffic',
      name: 'Live Traffic',
      type: 'system',
      category: 'traffic',
      enabled: true,
      icon: <TrafficIcon />,
      description: 'Show real-time traffic conditions'
    },
    {
      id: 'weather',
      name: 'Weather Overlay',
      type: 'system',
      category: 'weather',
      enabled: false,
      icon: <WeatherIcon />,
      description: 'Display current weather conditions'
    },
    {
      id: 'warehouses',
      name: 'Warehouses',
      type: 'system',
      category: 'infrastructure',
      enabled: true,
      icon: <WarehouseIcon />,
      description: 'Show company warehouses and distribution centers'
    },
    {
      id: 'customers',
      name: 'Customer Locations',
      type: 'system',
      category: 'infrastructure',
      enabled: true,
      icon: <StoreIcon />,
      description: 'Display customer delivery locations'
    },
    {
      id: 'gas-stations',
      name: 'Gas Stations',
      type: 'system',
      category: 'poi',
      enabled: false,
      icon: <LocalGasStationIcon />,
      description: 'Show nearby gas stations'
    },
    {
      id: 'rest-areas',
      name: 'Rest Areas',
      type: 'system',
      category: 'poi',
      enabled: false,
      icon: <HotelIcon />,
      description: 'Display rest areas and truck stops'
    },
    {
      id: 'restaurants',
      name: 'Restaurants',
      type: 'system',
      category: 'poi',
      enabled: false,
      icon: <RestaurantIcon />,
      description: 'Show nearby restaurants'
    },
    {
      id: 'schools',
      name: 'Schools',
      type: 'system',
      category: 'poi',
      enabled: true,
      icon: <SchoolIcon />,
      description: 'Display school zones for safety'
    }
  ]);

  const [customLayers, setCustomLayers] = useState<MapLayer[]>([
    {
      id: 'custom-1',
      name: 'Construction Zones',
      type: 'custom',
      category: 'custom',
      enabled: true,
      icon: <PlaceIcon />,
      description: 'Current construction zones to avoid'
    },
    {
      id: 'custom-2',
      name: 'Preferred Routes',
      type: 'custom',
      category: 'custom',
      enabled: true,
      icon: <RouteIcon />,
      description: 'Company-approved preferred routes'
    }
  ]);

  const [isAddingLayer, setIsAddingLayer] = useState(false);
  const [newLayerName, setNewLayerName] = useState('');
  const [newLayerDescription, setNewLayerDescription] = useState('');

  const handleToggleLayer = (layerId: string, isSystem: boolean) => {
    if (isSystem) {
      setSystemLayers(prevLayers =>
        prevLayers.map(layer =>
          layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
        )
      );
    } else {
      setCustomLayers(prevLayers =>
        prevLayers.map(layer =>
          layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
        )
      );
    }
  };

  const handleAddLayer = () => {
    if (newLayerName.trim() === '') return;

    const newLayer: MapLayer = {
      id: `custom-${Date.now()}`,
      name: newLayerName,
      type: 'custom',
      category: 'custom',
      enabled: true,
      icon: <PlaceIcon />,
      description: newLayerDescription || 'Custom map overlay'
    };

    setCustomLayers(prevLayers => [...prevLayers, newLayer]);
    setNewLayerName('');
    setNewLayerDescription('');
    setIsAddingLayer(false);
  };

  const handleDeleteLayer = (layerId: string) => {
    setCustomLayers(prevLayers => prevLayers.filter(layer => layer.id !== layerId));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Custom Map Overlays
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Alert severity="info">
          Customize map overlays to display relevant information for your fleet operations.
        </Alert>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <LayersIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              System Layers
            </Typography>
            
            <List>
              {systemLayers.map((layer) => (
                <React.Fragment key={layer.id}>
                  <ListItem>
                    <ListItemIcon>{layer.icon}</ListItemIcon>
                    <ListItemText 
                      primary={layer.name} 
                      secondary={layer.description} 
                    />
                    <Switch
                      edge="end"
                      checked={layer.enabled}
                      onChange={() => handleToggleLayer(layer.id, true)}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
          
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                <LayersIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Custom Layers
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setIsAddingLayer(true)}
                size="small"
              >
                Add Layer
              </Button>
            </Box>
            
            {isAddingLayer && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    New Custom Layer
                  </Typography>
                  <TextField
                    fullWidth
                    label="Layer Name"
                    value={newLayerName}
                    onChange={(e) => setNewLayerName(e.target.value)}
                    margin="normal"
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    value={newLayerDescription}
                    onChange={(e) => setNewLayerDescription(e.target.value)}
                    margin="normal"
                    size="small"
                  />
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setIsAddingLayer(false)}
                      size="small"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleAddLayer}
                      size="small"
                    >
                      Save
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}
            
            <List>
              {customLayers.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No custom layers. Add one to get started.
                </Typography>
              ) : (
                customLayers.map((layer) => (
                  <React.Fragment key={layer.id}>
                    <ListItem
                      secondaryAction={
                        <Box>
                          <IconButton edge="end" aria-label="edit" size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            edge="end" 
                            aria-label="delete" 
                            onClick={() => handleDeleteLayer(layer.id)}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemIcon>{layer.icon}</ListItemIcon>
                      <ListItemText 
                        primary={layer.name} 
                        secondary={layer.description} 
                      />
                      <Switch
                        edge="end"
                        checked={layer.enabled}
                        onChange={() => handleToggleLayer(layer.id, false)}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              <MapIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Map Preview
            </Typography>
            
            <Box sx={{ p: 1, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Active Layers:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {[...systemLayers, ...customLayers]
                  .filter(layer => layer.enabled)
                  .map(layer => (
                    <Chip
                      key={layer.id}
                      icon={layer.icon}
                      label={layer.name}
                      variant="outlined"
                      size="small"
                      color={layer.type === 'system' ? 'primary' : 'secondary'}
                    />
                  ))
                }
              </Box>
            </Box>
            
            <Box 
              sx={{ 
                flex: 1, 
                bgcolor: '#f5f5f5', 
                borderRadius: 1, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px'
              }}
            >
              <Box textAlign="center">
                <MapIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Map preview would be displayed here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In a real implementation, this would show an interactive map with the selected overlays
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomMapOverlays;
