import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  IconButton,
  Chip,
  Paper,
  Badge,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiService from '../../utils/api';

// Icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'alert' | 'warning' | 'success' | 'info';
  read: boolean;
  createdAt: string;
  relatedTo?: string;
  relatedId?: string;
}

interface NotificationListProps {
  notifications: Notification[];
  setNotifications?: React.Dispatch<React.SetStateAction<Notification[]>>;
  showHeader?: boolean;
  maxHeight?: number | null;
  limit?: number;
  showViewAll?: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  setNotifications, 
  showHeader = true, 
  maxHeight = null,
  limit,
  showViewAll
}) => {
  const navigate = useNavigate();

  const getNotificationIcon = (type: string): React.ReactNode => {
    switch (type) {
      case 'alert':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      default:
        return <InfoIcon color="primary" />;
    }
  };

  const handleMarkAllAsRead = async (): Promise<void> => {
    try {
      await apiService.markAllNotificationsAsRead();
      setNotifications && setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleNotificationClick = async (notification: Notification): Promise<void> => {
    try {
      if (!notification.read) {
        await apiService.markNotificationAsRead(notification._id);
        setNotifications && setNotifications(notifications.map(n => 
          n._id === notification._id ? { ...n, read: true } : n
        ));
      }
      
      // Navigate based on notification type
      if (notification.relatedTo && notification.relatedId) {
        navigate(`/${notification.relatedTo}s/${notification.relatedId}`);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <Paper sx={{ width: '100%' }}>
      {showHeader && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Badge badgeContent={notifications.filter(n => !n.read).length} color="error" sx={{ mr: 1 }}>
                <NotificationsIcon color="primary" />
              </Badge>
              <Typography variant="h6" component="div">
                Notifications
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              color="primary" 
              onClick={handleMarkAllAsRead}
              disabled={!notifications.some(n => !n.read)}
            >
              <MarkAsUnreadIcon fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                Mark all as read
              </Typography>
            </IconButton>
          </Box>
          <Divider />
        </>
      )}
      
      <Box sx={{ maxHeight: maxHeight, overflow: maxHeight ? 'auto' : 'visible' }}>
        {notifications.length > 0 ? (
          <List>
            {(limit ? notifications.slice(0, limit) : notifications).map((notification) => (
              <ListItem 
                key={notification._id} 
                button 
                onClick={() => handleNotificationClick(notification)}
                sx={{ 
                  bgcolor: notification.read ? 'background.paper' : 'action.hover',
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <ListItemIcon>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText 
                  primary={notification.title}
                  secondary={notification.message}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(notification.createdAt).toLocaleString()}
                  </Typography>
                  {!notification.read && (
                    <Chip 
                      label="New" 
                      color="primary" 
                      size="small" 
                      sx={{ mt: 1, height: 20 }}
                    />
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </Box>
        )}
        {showViewAll && limit && notifications.length > limit && (
          <Box sx={{ p: 1, textAlign: 'center' }}>
            <Button 
              variant="text" 
              size="small" 
              onClick={() => navigate('/notifications')}
            >
              View All Notifications
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default NotificationList;
