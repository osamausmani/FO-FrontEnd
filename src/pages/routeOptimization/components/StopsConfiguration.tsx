import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';

// Icons
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

// Map components
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Types
import { VehicleLocation } from '../../../types/routeOptimization';

interface StopsConfigurationProps {
  stops: {
    id: string;
    location: VehicleLocation;
    serviceTime?: number;
    timeWindow?: {
      start: string;
      end: string;
    };
    priority?: number;
  }[];
  onAddStop: () => void;
  onRemoveStop: (index: number) => void;
  onUpdateStop: (index: number, location: VehicleLocation) => void;
}

const StopsConfiguration: React.FC<StopsConfigurationProps> = ({
  stops,
  onAddStop,
  onRemoveStop,
  onUpdateStop
}) => {
  const [selectedStopIndex, setSelectedStopIndex] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([24.8607, 67.0011]); // Default: Karachi
  const [searchAddress, setSearchAddress] = useState<string>('');

  // Handle stop selection
  const handleStopSelect = (index: number) => {
    setSelectedStopIndex(index);
    const stop = stops[index];
    if (stop?.location?.latitude && stop?.location?.longitude) {
      setMapCenter([stop.location.latitude, stop.location.longitude]);
    }
  };

  // Update location by search (simple example - would use geocoding API in real app)
  const handleAddressSearch = async () => {
    if (!searchAddress.trim() || selectedStopIndex === null) return;
    
    try {
      // In a real app, this would call a geocoding API like Google Maps, Mapbox, or OpenStreetMap Nominatim
      // For demonstration purposes, we'll just set a fixed location with the search term as address
      const mockLocation: VehicleLocation = {
        latitude: mapCenter[0] + (Math.random() * 0.01 - 0.005),
        longitude: mapCenter[1] + (Math.random() * 0.01 - 0.005),
        address: searchAddress
      };
      
      onUpdateStop(selectedStopIndex, mockLocation);
      setSearchAddress('');
      
      // Update map center
      setMapCenter([mockLocation.latitude, mockLocation.longitude]);
    } catch (error) {
      console.error('Error searching for address:', error);
    }
  };

  // Map click handler component
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (selectedStopIndex !== null) {
          const { lat, lng } = e.latlng;
          onUpdateStop(selectedStopIndex, {
            latitude: lat,
            longitude: lng
          });
        }
      },
    });
    return null;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configure Stops and Waypoints
      </Typography>
      
      <Grid container spacing={3}>
        {/* Left panel: Stop list */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader 
              title="Stops" 
              action={
                <Button
                  startIcon={<AddIcon />}
                  onClick={onAddStop}
                  size="small"
                >
                  Add Stop
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ maxHeight: '400px', overflow: 'auto' }}>
              {stops.length === 0 ? (
                <Typography color="text.secondary" align="center">
                  No stops added. Click "Add Stop" to begin.
                </Typography>
              ) : (
                <List>
                  {stops.map((stop, index) => (
                    <ListItem 
                      key={index}
                      button
                      selected={selectedStopIndex === index}
                      onClick={() => handleStopSelect(index)}
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveStop(index);
                            if (selectedStopIndex === index) {
                              setSelectedStopIndex(null);
                            }
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={<Typography variant="subtitle2">Stop {index + 1}</Typography>}
                        secondary={
                          stop.location.address ? 
                          stop.location.address : 
                          `${stop.location.latitude.toFixed(4)}, ${stop.location.longitude.toFixed(4)}`
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Right panel: Map and stop details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Map" />
            <Divider />
            <CardContent sx={{ height: '400px', p: 0 }}>
              <MapContainer 
                center={mapCenter} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Render markers for each stop */}
                {stops.map((stop, index) => (
                  <Marker 
                    key={index}
                    position={[stop.location.latitude, stop.location.longitude]}
                    eventHandlers={{
                      click: () => handleStopSelect(index),
                    }}
                  >
                    <Popup>
                      <Typography variant="subtitle2">Stop {index + 1}</Typography>
                      <Typography variant="body2">
                        {stop.location.address || `${stop.location.latitude.toFixed(6)}, ${stop.location.longitude.toFixed(6)}`}
                      </Typography>
                    </Popup>
                  </Marker>
                ))}
                
                <MapClickHandler />
              </MapContainer>
            </CardContent>
          </Card>
          
          {/* Stop details form */}
          {selectedStopIndex !== null && stops[selectedStopIndex] && (
            <Card sx={{ mt: 2 }}>
              <CardHeader title={`Stop ${selectedStopIndex + 1} Details`} />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex' }}>
                      <TextField
                        fullWidth
                        label="Search Address"
                        value={searchAddress}
                        onChange={(e) => setSearchAddress(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Button 
                        variant="outlined" 
                        onClick={handleAddressSearch}
                      >
                        Find
                      </Button>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Latitude"
                      value={stops[selectedStopIndex].location.latitude}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          onUpdateStop(selectedStopIndex, {
                            ...stops[selectedStopIndex].location,
                            latitude: value
                          });
                        }
                      }}
                      type="number"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Longitude"
                      value={stops[selectedStopIndex].location.longitude}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          onUpdateStop(selectedStopIndex, {
                            ...stops[selectedStopIndex].location,
                            longitude: value
                          });
                        }
                      }}
                      type="number"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={stops[selectedStopIndex].location.address || ''}
                      onChange={(e) => {
                        onUpdateStop(selectedStopIndex, {
                          ...stops[selectedStopIndex].location,
                          address: e.target.value
                        });
                      }}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Service Time (minutes)"
                      value={stops[selectedStopIndex].serviceTime || ''}
                      onChange={(e) => {
                        const stop = { ...stops[selectedStopIndex] };
                        const value = parseInt(e.target.value);
                        stop.serviceTime = isNaN(value) ? undefined : value;
                        onUpdateStop(selectedStopIndex, stop.location);
                      }}
                      type="number"
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default StopsConfiguration;
