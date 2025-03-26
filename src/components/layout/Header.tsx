import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem, 
  Avatar, 
  Tooltip, 
  Badge, 
  Divider,
  useTheme,
  Button,
  Stack,
  ListItemIcon,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Icons for navigation
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import BuildIcon from '@mui/icons-material/Build';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import RouteIcon from '@mui/icons-material/Route';
import BarChartIcon from '@mui/icons-material/BarChart';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import PlaceIcon from '@mui/icons-material/Place';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GavelIcon from '@mui/icons-material/Gavel';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PhoneIcon from '@mui/icons-material/Phone';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import CloudIcon from '@mui/icons-material/Cloud';
import NatureIcon from '@mui/icons-material/Nature';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SecurityIcon from '@mui/icons-material/Security';
import LanguageIcon from '@mui/icons-material/Language';

interface HeaderProps {
  handleDrawerToggle: () => void;
}

interface Notification {
  id: number;
  message: string;
  read: boolean;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  submenu?: MenuItem[];
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
}

const Header: React.FC<HeaderProps> = ({ handleDrawerToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState<null | HTMLElement>(null);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, HTMLElement | null>>({});

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotificationsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleToggleSubmenu = (category: string, event: React.MouseEvent<HTMLElement>) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [category]: prev[category] ? null : event.currentTarget
    }));
  };

  const handleCloseSubmenu = (category: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [category]: null
    }));
  };

  const handleViewAllNotifications = () => {
    handleCloseNotificationsMenu();
    navigate('/notifications');
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  const handleProfile = () => {
    handleCloseUserMenu();
    navigate('/profile');
  };

  const handleSettings = () => {
    handleCloseUserMenu();
    navigate('/settings');
  };
  
  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Menu categories
  const menuCategories: MenuCategory[] = [
    {
      name: 'Dashboard',
      items: [
        { text: 'Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/' },
      ]
    },
    {
      name: 'Fleet',
      items: [
        { text: 'Vehicles', icon: <DirectionsCarIcon fontSize="small" />, path: '/vehicles' },
        { text: 'Drivers', icon: <PersonIcon fontSize="small" />, path: '/drivers' },
        { text: 'Driver Performance', icon: <PersonIcon fontSize="small" />, path: '/driver-management' },
      ]
    },
    {
      name: 'Operations',
      items: [
        { text: 'Maintenance', icon: <BuildIcon fontSize="small" />, path: '/maintenance' },
        { text: 'Fuel', icon: <LocalGasStationIcon fontSize="small" />, path: '/fuel' },
        { text: 'Routes', icon: <RouteIcon fontSize="small" />, path: '/routes' },
        { text: 'Shipping', icon: <LocalShippingIcon fontSize="small" />, path: '/shipping' },
      ]
    },
    {
      name: 'Tracking',
      items: [
        { text: 'GPS Dashboard', icon: <MapIcon fontSize="small" />, path: '/gps-tracking' },
        { text: 'Live Tracking', icon: <LocationOnIcon fontSize="small" />, path: '/gps-tracking/live' },
        { text: 'Geofencing', icon: <PlaceIcon fontSize="small" />, path: '/geofencing' },
      ]
    },
    {
      name: 'Analytics',
      items: [
        { text: 'Reports', icon: <BarChartIcon fontSize="small" />, path: '/reports' },
        { text: 'Metrics', icon: <AssessmentIcon fontSize="small" />, path: '/metrics' },
        { text: 'Sustainability', icon: <NatureIcon fontSize="small" />, path: '/sustainability' },
      ]
    },
    {
      name: 'Admin',
      items: [
        { text: 'Notifications', icon: <NotificationsActiveIcon fontSize="small" />, path: '/notifications' },
        { text: 'Integrations', icon: <IntegrationInstructionsIcon fontSize="small" />, path: '/integrations/third-party' },
        { text: 'Settings', icon: <SettingsIcon fontSize="small" />, path: '/settings' },
      ]
    },
  ];

  // Flatten menu items for mobile view
  const flatMenuItems = menuCategories.flatMap(category => category.items);

  // Sample notifications - in a real app, these would come from your backend
  const notifications: Notification[] = [
    { id: 1, message: 'Vehicle maintenance due for ABC123', read: false },
    { id: 2, message: 'Driver license expiring in 30 days', read: false },
    { id: 3, message: 'Fuel efficiency below threshold', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        backdropFilter: 'blur(6px)',
        zIndex: theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            aria-label="menu"
            edge="start"
            onClick={handleOpenNavMenu}
            sx={{ display: { md: 'none' }, mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" fontWeight="600" color="primary" sx={{ mr: { xs: 1, md: 3 } }}>
            FLEET<span style={{ color: theme.palette.text.primary }}>ORBIT</span>
          </Typography>
          
          {/* Desktop navigation menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {menuCategories.map((category) => {
              // Single item categories don't need dropdown
              if (category.items.length === 1) {
                const item = category.items[0];
                return (
                  <Button
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    color={isActive(item.path) ? 'primary' : 'inherit'}
                    sx={{
                      mx: 0.5,
                      px: 1,
                      fontWeight: isActive(item.path) ? 600 : 400,
                      textTransform: 'none',
                    }}
                    startIcon={item.icon}
                  >
                    {item.text}
                  </Button>
                );
              }

              // Multiple items get a dropdown
              return (
                <React.Fragment key={category.name}>
                  <Button
                    color="inherit"
                    onClick={(e) => handleToggleSubmenu(category.name, e)}
                    endIcon={<KeyboardArrowDownIcon />}
                    sx={{
                      mx: 0.5,
                      px: 1,
                      textTransform: 'none',
                      fontWeight: category.items.some(item => isActive(item.path)) ? 600 : 400,
                      color: category.items.some(item => isActive(item.path)) ? 'primary.main' : 'inherit',
                    }}
                  >
                    {category.name}
                  </Button>
                  <Popper
                    open={Boolean(openSubmenus[category.name])}
                    anchorEl={openSubmenus[category.name]}
                    transition
                    disablePortal
                    placement="bottom-start"
                    sx={{ zIndex: theme.zIndex.drawer + 2 }}
                  >
                    {({ TransitionProps }) => (
                      <Grow {...TransitionProps}>
                        <Paper elevation={3} sx={{ mt: 0.5, minWidth: 180 }}>
                          <ClickAwayListener onClickAway={() => handleCloseSubmenu(category.name)}>
                            <MenuList autoFocusItem={Boolean(openSubmenus[category.name])}>
                              {category.items.map((item) => (
                                <MenuItem
                                  key={item.text}
                                  component={RouterLink}
                                  to={item.path}
                                  selected={isActive(item.path)}
                                  onClick={() => handleCloseSubmenu(category.name)}
                                  sx={{
                                    color: isActive(item.path) ? 'primary.main' : 'inherit',
                                    fontWeight: isActive(item.path) ? 600 : 400,
                                    py: 1,
                                  }}
                                >
                                  <ListItemIcon sx={{ minWidth: 36, color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                                    {item.icon}
                                  </ListItemIcon>
                                  <Typography variant="body2">
                                    {item.text}
                                  </Typography>
                                </MenuItem>
                              ))}
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </React.Fragment>
              );
            })}
          </Box>
          
          {/* Mobile navigation menu */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiPaper-root': {
                boxShadow: 3,
                minWidth: 180,
                maxHeight: '70vh',
                overflowY: 'auto',
                backgroundColor: theme.palette.background.paper,
              }
            }}
          >
            {/* Group menu items by category for mobile view */}
            {menuCategories.map((category) => (
              <React.Fragment key={category.name}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    px: 2, 
                    py: 0.5, 
                    display: 'block', 
                    color: 'text.secondary', 
                    backgroundColor: theme.palette.background.default,
                    fontWeight: 600,
                  }}
                >
                  {category.name}
                </Typography>
                {category.items.map((item) => (
                  <MenuItem 
                    key={item.text} 
                    onClick={() => {
                      navigate(item.path);
                      handleCloseNavMenu();
                    }}
                    selected={isActive(item.path)}
                    sx={{
                      color: isActive(item.path) ? 'primary.main' : 'inherit',
                      fontWeight: isActive(item.path) ? 600 : 400,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ mr: 1.5, color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
                        {item.icon}
                      </Box>
                      <Typography>
                        {item.text}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
                {category !== menuCategories[menuCategories.length - 1] && (
                  <Divider sx={{ my: 0.5 }} />
                )}
              </React.Fragment>
            ))}
          </Menu>
        </Box>
        
        {/* Right side - Notifications and Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box>
            <Tooltip title="Notifications">
              <IconButton onClick={handleOpenNotificationsMenu} color="inherit">
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu
              id="notifications-menu"
              anchorEl={anchorElNotifications}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNotifications)}
              onClose={handleCloseNotificationsMenu}
              sx={{ 
                mt: 1,
                '& .MuiPaper-root': {
                  width: 320,
                  maxHeight: 400,
                  boxShadow: 3,
                  backgroundColor: theme.palette.background.paper,
                }
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Notifications
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <MenuItem key={notification.id} onClick={handleCloseNotificationsMenu}>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          width: '100%', 
                          alignItems: 'flex-start',
                          px: 1,
                          py: 0.5,
                        }}
                      >
                        <Badge 
                          color="primary" 
                          variant="dot" 
                          invisible={notification.read}
                          sx={{ alignSelf: 'center', mr: 2 }}
                        >
                          <NotificationsIcon color="action" fontSize="small" />
                        </Badge>
                        <Box sx={{ ml: 1.5 }}>
                          <Typography variant="body2">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            2 hours ago
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No notifications
                    </Typography>
                  </Box>
                )}
              </Box>
              <Divider />
              <MenuItem onClick={handleViewAllNotifications}>
                <Typography variant="body2" color="primary" textAlign="center" sx={{ width: '100%' }}>
                  View All Notifications
                </Typography>
              </MenuItem>
            </Menu>
          </Box>

          <Box sx={{ ml: 1 }}>
            <Tooltip title="User menu">
              <IconButton onClick={handleOpenUserMenu} color="inherit">
                <Avatar 
                  src={user?.avatar || undefined}
                  alt={user?.name || 'User'}
                  sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'F'}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              id="user-menu"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              sx={{ 
                mt: 1,
                '& .MuiPaper-root': {
                  minWidth: 180,
                  boxShadow: 3,
                  backgroundColor: theme.palette.background.paper,
                }
              }}
            >
              <Box sx={{ py: 1.5, px: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" noWrap>
                  {user?.name || 'Fleet Manager'}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {user?.email || 'admin@example.com'}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleProfile}>
                <AccountCircleIcon fontSize="small" sx={{ mr: 1.5 }} />
                <Typography variant="body2">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleSettings}>
                <SettingsIcon fontSize="small" sx={{ mr: 1.5 }} />
                <Typography variant="body2">Settings</Typography>
              </MenuItem>
              <MenuItem>
                <HelpOutlineIcon fontSize="small" sx={{ mr: 1.5 }} />
                <Typography variant="body2">Help</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                <Typography variant="body2">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
