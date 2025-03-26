import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  SelectChangeEvent
} from '@mui/material';
import apiService from '../../utils/api';
import NotificationList, { Notification } from '../../components/notifications/NotificationList';

interface NotificationParams {
  page: number;
  limit: number;
  type?: string;
}

const Notifications: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchNotifications();
  }, [page, limit, filter]);

  const fetchNotifications = async (): Promise<void> => {
    setLoading(true);
    try {
      const params: NotificationParams = {
        page,
        limit
      };

      if (filter !== 'all') {
        params.type = filter;
      }

      const response = await apiService.getNotifications(params);
      setNotifications(response.data.data);
      setTotal(response.data.pagination ? Math.ceil(response.data.count / limit) : 1);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number): void => {
    setPage(value);
  };

  const handleLimitChange = (event: SelectChangeEvent<number>): void => {
    setLimit(event.target.value as number);
    setPage(1); // Reset to first page when changing limit
  };

  const handleFilterChange = (event: SelectChangeEvent<string>): void => {
    setFilter(event.target.value);
    setPage(1); // Reset to first page when changing filter
  };

  if (loading && page === 1) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Notifications</Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="notification-filter-label">Filter</InputLabel>
            <Select
              labelId="notification-filter-label"
              id="notification-filter"
              value={filter}
              label="Filter"
              onChange={handleFilterChange}
            >
              <MenuItem value="all">All Notifications</MenuItem>
              <MenuItem value="info">Information</MenuItem>
              <MenuItem value="warning">Warnings</MenuItem>
              <MenuItem value="alert">Alerts</MenuItem>
              <MenuItem value="success">Success</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="notification-limit-label">Show</InputLabel>
            <Select
              labelId="notification-limit-label"
              id="notification-limit"
              value={limit}
              label="Show"
              onChange={handleLimitChange}
            >
              <MenuItem value={5}>5 per page</MenuItem>
              <MenuItem value={10}>10 per page</MenuItem>
              <MenuItem value={25}>25 per page</MenuItem>
              <MenuItem value={50}>50 per page</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <NotificationList 
          notifications={notifications} 
          setNotifications={setNotifications} 
        />
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination 
          count={total} 
          page={page} 
          onChange={handlePageChange} 
          color="primary" 
          showFirstButton 
          showLastButton
        />
      </Box>
    </Box>
  );
};

export default Notifications;
