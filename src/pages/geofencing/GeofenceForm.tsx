import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Autocomplete,
  Chip,
} from '@mui/material';
import { MapContainer, TileLayer, Circle, Rectangle, Polygon, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { toast } from 'react-toastify';
import apiService from '../../utils/api';
import { Geofence, GeofenceAlertConfig, GeofenceType } from '../../types/geofencing';

const GeofenceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // States
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Geofence>>({
    name: '',
    description: '',
    type: 'circle' as GeofenceType,
    geometry: {
      center: {
        type: 'Point',
        coordinates: [0, 0] // [longitude, latitude]
      },
      radius: 500 // meters
    },
    alertType: {
      entry: true,
      exit: true,
      dwell: false,
      dwellTime: 15,
      speedLimit: 50
    },
    status: 'active',
    vehicles: [],
    notifications: {
      email: [],
      sms: [],
      pushNotification: true
    },
    schedule: {
      active: true,
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
    }
  });

  // Map state
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.7749, -122.4194]); // Default to San Francisco
  const [drawing, setDrawing] = useState<boolean>(false);
  const [drawStart, setDrawStart] = useState<L.LatLng | null>(null);
  const [polygonPoints, setPolygonPoints] = useState<L.LatLng[]>([]);

  // Fetch geofence data for edit mode
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load vehicles
        const vehiclesRes = await apiService.getVehicles();
        setVehicles(vehiclesRes.data.data);

        if (isEdit && id) {
          // Load geofence data
          const geofenceRes = await apiService.getGeofence(id);
          const geofence = geofenceRes.data.data;

          // Update state with geofence data
          setFormData(geofence);

          // Set map center
          if (geofence.type === 'circle') {
            const [longitude, latitude] = geofence.geometry.center?.coordinates || [0, 0];
            setMapCenter([latitude, longitude]);
          } else if (geofence.type === 'polygon' || geofence.type === 'rectangle') {
            // For polygon or rectangle, center map on first coordinate
            if (geofence.geometry.coordinates && geofence.geometry.coordinates[0]?.length > 0) {
              const [longitude, latitude] = geofence.geometry.coordinates[0][0];
              setMapCenter([latitude, longitude]);

              // Set polygon points for editing
              if (geofence.type === 'polygon') {
                const points = geofence.geometry.coordinates[0].map(
                  ([lng, lat]) => L.latLng(lat, lng)
                );
                setPolygonPoints(points);
              }
            }
          }
        }

        setLoading(false);
      } catch (err: any) {
        console.error('Error loading data:', err);
        setError(err.response?.data?.message || 'Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEdit]);

  // Form input handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | { target: { name: string; value: unknown } }) => {
    const { name, value } = e.target;
    if (!name) return;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVehiclesChange = (_event: React.SyntheticEvent, value: any[]) => {
    setFormData((prev) => ({
      ...prev,
      vehicles: value.map(v => v._id)
    }));
  };

  const handleAlertSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      alertType: {
        ...prev.alertType as GeofenceAlertConfig,
        [name]: checked
      }
    }));
  };

  // Map interaction handlers
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (!drawing) return;

    const { lat, lng } = e.latlng;

    if (formData.type === 'circle') {
      // Update circle center
      setFormData((prev) => ({
        ...prev,
        geometry: {
          ...prev.geometry,
          center: {
            type: 'Point',
            coordinates: [lng, lat] // GeoJSON format is [longitude, latitude]
          }
        }
      }));
      setDrawing(false);
    } 
    else if (formData.type === 'rectangle') {
      if (!drawStart) {
        // First click - set start point
        setDrawStart(e.latlng);
      } else {
        // Second click - complete rectangle
        const bounds = L.latLngBounds(drawStart, e.latlng);
        const coordinates = [
          [bounds.getSouthWest().lng, bounds.getSouthWest().lat] as [number, number],
          [bounds.getNorthWest().lng, bounds.getNorthWest().lat] as [number, number],
          [bounds.getNorthEast().lng, bounds.getNorthEast().lat] as [number, number],
          [bounds.getSouthEast().lng, bounds.getSouthEast().lat] as [number, number],
          [bounds.getSouthWest().lng, bounds.getSouthWest().lat] as [number, number] // Close the polygon
        ];

        setFormData((prev) => ({
          ...prev,
          geometry: {
            ...prev.geometry,
            coordinates: [coordinates] // GeoJSON format for polygon
          }
        }));

        setDrawStart(null);
        setDrawing(false);
      }
    } 
    else if (formData.type === 'polygon') {
      // Add point to polygon
      setPolygonPoints((prev) => [...prev, e.latlng]);
    }
  };

  const handleCompletePolygon = () => {
    if (polygonPoints.length < 3) {
      toast.error('A polygon requires at least 3 points');
      return;
    }

    // Close the polygon
    const closedPoints = [...polygonPoints, polygonPoints[0]];
    
    // Convert to GeoJSON format
    const coordinates = closedPoints.map(point => [point.lng, point.lat] as [number, number]);

    setFormData((prev) => ({
      ...prev,
      geometry: {
        ...prev.geometry,
        coordinates: [coordinates] // GeoJSON format for polygon
      }
    }));

    setDrawing(false);
  };

  const resetDrawing = () => {
    setDrawStart(null);
    setPolygonPoints([]);
    setDrawing(false);
  };

  // Save geofence
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEdit) {
        await apiService.updateGeofence(id!, formData);
        toast.success('Geofence updated successfully');
      } else {
        await apiService.createGeofence(formData);
        toast.success('Geofence created successfully');
      }
      navigate('/geofencing');
    } catch (err: any) {
      console.error('Error saving geofence:', err);
      toast.error(err.response?.data?.message || 'Failed to save geofence');
      setSaving(false);
    }
  };

  // Custom map component with event handlers
  const MapInteractionHandler = () => {
    useMapEvents({
      click: handleMapClick
    });
    return null;
  };

  // Render map shapes
  const renderShape = () => {
    if (formData.type === 'circle' && formData.geometry?.center?.coordinates) {
      const [longitude, latitude] = formData.geometry.center.coordinates;
      const radius = formData.geometry.radius || 500;
      return (
        <Circle 
          center={[latitude, longitude]} 
          radius={radius} 
          pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
        />
      );
    } 
    else if (formData.type === 'rectangle' && formData.geometry?.coordinates) {
      const coords = formData.geometry.coordinates[0];
      if (coords && coords.length >= 5) {
        const bounds = L.latLngBounds(
          [coords[0][1], coords[0][0]], // SW
          [coords[2][1], coords[2][0]]  // NE
        );
        return (
          <Rectangle 
            bounds={bounds} 
            pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.2 }}
          />
        );
      }
    } 
    else if (formData.type === 'polygon') {
      if (formData.geometry?.coordinates) {
        // Render saved polygon
        const coords = formData.geometry.coordinates[0];
        if (coords && coords.length >= 4) {
          const positions = coords.map(([lng, lat]) => [lat, lng]);
          return (
            <Polygon 
              positions={positions as [number, number][]} 
              pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }}
            />
          );
        }
      } else if (polygonPoints.length > 0) {
        // Render polygon being drawn
        return (
          <Polygon 
            positions={polygonPoints.map(p => [p.lat, p.lng]) as [number, number][]} 
            pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }}
          />
        );
      }
    }
    return null;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Edit Geofence' : 'Create Geofence'}
      </Typography>
      
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Basic information */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Basic Information</Typography>
                
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                />
                
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                />
                
                <FormControl fullWidth margin="normal">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={formData.status || 'active'}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel id="type-label">Geofence Type</InputLabel>
                  <Select
                    labelId="type-label"
                    name="type"
                    value={formData.type || 'circle'}
                    onChange={handleChange}
                    label="Geofence Type"
                    disabled={isEdit} // Can't change type in edit mode
                  >
                    <MenuItem value="circle">Circle</MenuItem>
                    <MenuItem value="rectangle">Rectangle</MenuItem>
                    <MenuItem value="polygon">Polygon</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Alert Settings</Typography>
                
                <Typography variant="subtitle1" gutterBottom>
                  Alert Types
                </Typography>
                
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.alertType?.entry || false}
                      onChange={handleAlertSettingsChange}
                      name="entry"
                    />
                  }
                  label="Entry"
                />
                
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.alertType?.exit || false}
                      onChange={handleAlertSettingsChange}
                      name="exit"
                    />
                  }
                  label="Exit"
                />
                
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.alertType?.dwell || false}
                      onChange={handleAlertSettingsChange}
                      name="dwell"
                    />
                  }
                  label="Dwell"
                />
                
                {formData.alertType?.dwell && (
                  <TextField
                    label="Dwell Time (minutes)"
                    name="dwellTime"
                    type="number"
                    value={formData.alertType.dwellTime || 15}
                    onChange={(e) => {
                      const dwellTime = Number(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        alertType: {
                          ...prev.alertType as GeofenceAlertConfig,
                          dwellTime
                        }
                      }));
                    }}
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 1 }}
                  />
                )}
                
                <FormControlLabel
                  control={
                    <Radio
                      checked={Boolean(formData.alertType?.speedLimit)}
                      onChange={() => {
                        setFormData((prev) => ({
                          ...prev,
                          alertType: {
                            ...prev.alertType as GeofenceAlertConfig,
                            entry: false,
                            exit: false,
                            dwell: false,
                            speedLimit: 50
                          }
                        }));
                      }}
                      name="speeding"
                    />
                  }
                  label="Speeding"
                />
                
                {formData.alertType?.speedLimit && (
                  <TextField
                    label="Speed Limit (km/h)"
                    name="speedLimit"
                    type="number"
                    value={formData.alertType.speedLimit || 50}
                    onChange={(e) => {
                      const speedLimit = Number(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        alertType: {
                          ...prev.alertType as GeofenceAlertConfig,
                          speedLimit
                        }
                      }));
                    }}
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 1 }}
                  />
                )}
                
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Notification Methods
                </Typography>
                
                <FormControlLabel
                  control={
                    <Radio
                      checked={(formData.notifications?.email && formData.notifications.email.length > 0) || false}
                      onChange={() => {
                        setFormData((prev) => {
                          const currentEmail = prev.notifications?.email || [];
                          const updatedNotifications = {
                            ...prev.notifications,
                            email: currentEmail.length ? [] : [''],
                            pushNotification: prev.notifications?.pushNotification ?? true
                          };
                          return {
                            ...prev,
                            notifications: updatedNotifications
                          };
                        });
                      }}
                    />
                  }
                  label="Email"
                />
                
                <FormControlLabel
                  control={
                    <Radio
                      checked={(formData.notifications?.sms && formData.notifications.sms.length > 0) || false}
                      onChange={() => {
                        setFormData((prev) => {
                          const currentSms = prev.notifications?.sms || [];
                          const updatedNotifications = {
                            ...prev.notifications,
                            sms: currentSms.length ? [] : [''],
                            pushNotification: prev.notifications?.pushNotification ?? true
                          };
                          return {
                            ...prev,
                            notifications: updatedNotifications
                          };
                        });
                      }}
                    />
                  }
                  label="SMS"
                />
                
                <FormControlLabel
                  control={
                    <Radio
                      checked={formData.notifications?.pushNotification || false}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications || {},
                            pushNotification: e.target.checked
                          }
                        }));
                      }}
                    />
                  }
                  label="In-App"
                />
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Assigned Vehicles</Typography>
                
                <Autocomplete
                  multiple
                  id="vehicles-autocomplete"
                  options={vehicles || []}
                  getOptionLabel={(option) => option.name}
                  value={(vehicles || []).filter(v => formData.vehicles?.includes(v._id))}
                  onChange={handleVehiclesChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Vehicles"
                      placeholder="Select vehicles"
                      margin="normal"
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option.name}
                        {...getTagProps({ index })}
                        key={option._id}
                      />
                    ))
                  }
                />
                <FormHelperText>
                  Only selected vehicles will trigger alerts for this geofence
                </FormHelperText>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Map section */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Geofence Area</Typography>
                
                {formData.type === 'circle' && (
                  <TextField
                    label="Radius (meters)"
                    name="radius"
                    type="number"
                    value={formData.geometry?.radius || 500}
                    onChange={(e) => {
                      const radius = Number(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        geometry: {
                          ...prev.geometry,
                          radius
                        }
                      }));
                    }}
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 50, max: 10000 }}
                  />
                )}
                
                <Box display="flex" gap={1} mb={2}>
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      resetDrawing();
                      setDrawing(true);
                    }}
                  >
                    Draw on Map
                  </Button>
                  
                  {formData.type === 'polygon' && drawing && polygonPoints.length > 2 && (
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={handleCompletePolygon}
                    >
                      Complete Polygon
                    </Button>
                  )}
                  
                  {drawing && (
                    <Button 
                      variant="outlined" 
                      color="error"
                      onClick={resetDrawing}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
                
                <Box sx={{ height: '500px', width: '100%' }}>
                  <MapContainer 
                    center={mapCenter} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapInteractionHandler />
                    {renderShape()}
                  </MapContainer>
                </Box>
                
                {drawing && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                    {formData.type === 'circle' && 'Click on the map to place the center of the circle'}
                    {formData.type === 'rectangle' && !drawStart && 'Click on the map to set the first corner of the rectangle'}
                    {formData.type === 'rectangle' && drawStart && 'Click on the map to set the opposite corner and complete the rectangle'}
                    {formData.type === 'polygon' && `Click to add points (${polygonPoints.length} so far). Click "Complete Polygon" when finished`}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Submit button */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/geofencing')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : (isEdit ? 'Update' : 'Create')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default GeofenceForm;
