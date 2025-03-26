import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { RouteParams } from '../../types/common';

const MaintenanceDetail: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/maintenance')} 
          sx={{ mr: 1 }}
          aria-label="back"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Maintenance Details</Typography>
      </Box>

      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Maintenance details functionality will be implemented soon.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          This page will display detailed information about maintenance record with ID: {id}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/maintenance')}
          sx={{ mt: 3 }}
        >
          Back to Maintenance Records
        </Button>
      </Box>
    </Box>
  );
};

export default MaintenanceDetail;
