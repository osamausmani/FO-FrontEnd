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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'driver' | 'dispatcher' | 'maintenance';
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  avatar?: string;
  department?: string;
  permissions?: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  isDefault?: boolean;
}

const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-03-19T09:30:00',
    department: 'Management',
    permissions: ['all']
  },
  {
    id: 'u2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'manager',
    status: 'active',
    lastLogin: '2025-03-18T14:45:00',
    department: 'Operations',
    permissions: ['view_all', 'edit_vehicles', 'edit_drivers', 'view_reports']
  },
  {
    id: 'u3',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    role: 'driver',
    status: 'active',
    lastLogin: '2025-03-19T07:15:00',
    department: 'Delivery',
    permissions: ['view_assignments', 'update_status']
  },
  {
    id: 'u4',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    role: 'dispatcher',
    status: 'active',
    lastLogin: '2025-03-19T08:00:00',
    department: 'Operations',
    permissions: ['view_all', 'assign_routes', 'edit_schedules']
  },
  {
    id: 'u5',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'maintenance',
    status: 'inactive',
    lastLogin: '2025-03-15T11:20:00',
    department: 'Maintenance',
    permissions: ['view_maintenance', 'create_maintenance', 'edit_maintenance']
  },
  {
    id: 'u6',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'driver',
    status: 'pending',
    department: 'Delivery',
    permissions: ['view_assignments', 'update_status']
  },
];

const mockRoles: Role[] = [
  {
    id: 'r1',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    userCount: 1,
    permissions: ['all'],
    isDefault: true
  },
  {
    id: 'r2',
    name: 'Fleet Manager',
    description: 'Manage vehicles, drivers, and view reports',
    userCount: 1,
    permissions: ['view_all', 'edit_vehicles', 'edit_drivers', 'view_reports']
  },
  {
    id: 'r3',
    name: 'Driver',
    description: 'Access to assignments and status updates',
    userCount: 2,
    permissions: ['view_assignments', 'update_status'],
    isDefault: true
  },
  {
    id: 'r4',
    name: 'Dispatcher',
    description: 'Assign routes and manage schedules',
    userCount: 1,
    permissions: ['view_all', 'assign_routes', 'edit_schedules']
  },
  {
    id: 'r5',
    name: 'Maintenance Staff',
    description: 'Manage maintenance records and schedules',
    userCount: 1,
    permissions: ['view_maintenance', 'create_maintenance', 'edit_maintenance'],
    isDefault: true
  },
];

const UserManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setEditMode(false);
    setOpenUserDialog(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditMode(true);
    setOpenUserDialog(true);
  };

  const handleAddRole = () => {
    setSelectedRole(null);
    setEditMode(false);
    setOpenRoleDialog(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setEditMode(true);
    setOpenRoleDialog(true);
  };

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
  };

  const handleCloseRoleDialog = () => {
    setOpenRoleDialog(false);
  };

  const handleSaveUser = () => {
    // In a real app, this would save the user data
    console.log('Saving user:', selectedUser);
    setOpenUserDialog(false);
  };

  const handleSaveRole = () => {
    // In a real app, this would save the role data
    console.log('Saving role:', selectedRole);
    setOpenRoleDialog(false);
  };

  const filteredUsers = mockUsers.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower) ||
      (user.department && user.department.toLowerCase().includes(searchLower))
    );
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <AdminPanelSettingsIcon fontSize="small" />;
      case 'manager': return <PersonIcon fontSize="small" />;
      case 'driver': return <PersonIcon fontSize="small" />;
      case 'dispatcher': return <PersonIcon fontSize="small" />;
      case 'maintenance': return <PersonIcon fontSize="small" />;
      default: return <PersonIcon fontSize="small" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'manager': return 'primary';
      case 'driver': return 'success';
      case 'dispatcher': return 'warning';
      case 'maintenance': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
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
          User Management
        </Typography>
        <Typography variant="body1" paragraph>
          Manage users, roles, and permissions for your fleet management system.
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="user management tabs">
            <Tab label="Users" />
            <Tab label="Roles & Permissions" />
            <Tab label="Security Settings" />
            <Tab label="Audit Log" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <TextField
                  placeholder="Search users..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{ width: 300 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small">
                          <FilterListIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={handleAddUser}
                >
                  Add User
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table sx={{ minWidth: 650 }} size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Login</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell component="th" scope="row">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2 }} alt={user.name} src={user.avatar}>
                              {user.name.charAt(0)}
                            </Avatar>
                            <Typography variant="body2">{user.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            icon={getRoleIcon(user.role)}
                            label={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
                            size="small" 
                            color={getRoleColor(user.role)} 
                          />
                        </TableCell>
                        <TableCell>{user.department || '-'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.status.charAt(0).toUpperCase() + user.status.slice(1)} 
                            size="small" 
                            color={getStatusColor(user.status)} 
                          />
                        </TableCell>
                        <TableCell>{formatDate(user.lastLogin)}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleEditUser(user)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <LockIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {tabValue === 1 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Roles & Permissions</Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={handleAddRole}
                >
                  Add Role
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table sx={{ minWidth: 650 }} size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Role Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Users</TableCell>
                      <TableCell>Default</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell component="th" scope="row">
                          <Typography variant="subtitle2">{role.name}</Typography>
                        </TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>
                          <Chip 
                            icon={<GroupIcon fontSize="small" />}
                            label={role.userCount} 
                            size="small" 
                            color="primary" 
                          />
                        </TableCell>
                        <TableCell>
                          {role.isDefault ? (
                            <Chip label="Default" size="small" color="secondary" />
                          ) : '-'}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleEditRole(role)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          {!role.isDefault && (
                            <IconButton size="small" color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {tabValue === 2 && (
            <>
              <Typography variant="h6" gutterBottom>Security Settings</Typography>
              
              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Password Policy</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel 
                      control={<Switch checked={true} />} 
                      label="Require complex passwords" 
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Passwords must include uppercase, lowercase, numbers, and special characters
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Minimum Password Length</InputLabel>
                      <Select
                        value={8}
                        label="Minimum Password Length"
                      >
                        <MenuItem value={6}>6 characters</MenuItem>
                        <MenuItem value={8}>8 characters</MenuItem>
                        <MenuItem value={10}>10 characters</MenuItem>
                        <MenuItem value={12}>12 characters</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel 
                      control={<Switch checked={true} />} 
                      label="Password expiration" 
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Force password reset every 90 days
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel 
                      control={<Switch checked={true} />} 
                      label="Prevent password reuse" 
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Cannot reuse the last 5 passwords
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              
              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Login Security</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel 
                      control={<Switch checked={true} />} 
                      label="Two-factor authentication" 
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Require 2FA for all administrator accounts
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel 
                      control={<Switch checked={true} />} 
                      label="Account lockout" 
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Lock account after 5 failed login attempts
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel 
                      control={<Switch checked={true} />} 
                      label="Session timeout" 
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Automatically log out after 30 minutes of inactivity
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel 
                      control={<Switch checked={false} />} 
                      label="IP restriction" 
                    />
                    <Typography variant="caption" color="text.secondary" display="block">
                      Limit login to specific IP addresses or ranges
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </>
          )}

          {tabValue === 3 && (
            <Typography variant="body1">Audit log content would be displayed here.</Typography>
          )}
        </Box>
      </Paper>

      {/* User Dialog */}
      <Dialog open={openUserDialog} onClose={handleCloseUserDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                margin="normal"
                defaultValue={selectedUser?.name || ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                margin="normal"
                defaultValue={selectedUser?.email || ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  defaultValue={selectedUser?.role || 'driver'}
                >
                  <MenuItem value="admin">Administrator</MenuItem>
                  <MenuItem value="manager">Fleet Manager</MenuItem>
                  <MenuItem value="driver">Driver</MenuItem>
                  <MenuItem value="dispatcher">Dispatcher</MenuItem>
                  <MenuItem value="maintenance">Maintenance Staff</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Department</InputLabel>
                <Select
                  label="Department"
                  defaultValue={selectedUser?.department || ''}
                >
                  <MenuItem value="Management">Management</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                  <MenuItem value="Delivery">Delivery</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  defaultValue={selectedUser?.status || 'active'}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {!editMode && (
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained" color="primary">
            {editMode ? 'Update User' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Role Dialog */}
      <Dialog open={openRoleDialog} onClose={handleCloseRoleDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Role' : 'Add New Role'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Role Name"
                variant="outlined"
                fullWidth
                margin="normal"
                defaultValue={selectedRole?.name || ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={2}
                defaultValue={selectedRole?.description || ''}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel 
                control={<Switch defaultChecked={selectedRole?.isDefault || false} />} 
                label="Set as default role" 
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Permissions
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Vehicle Management</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="View vehicles" />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="Add vehicles" />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="Edit vehicles" />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="Delete vehicles" />
                  </Grid>
                </Grid>
                
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Driver Management
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="View drivers" />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="Add drivers" />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="Edit drivers" />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="Delete drivers" />
                  </Grid>
                </Grid>
                
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Maintenance
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="View maintenance" />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="Schedule maintenance" />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="Complete maintenance" />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="Delete records" />
                  </Grid>
                </Grid>
                
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Reports & Analytics
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="View reports" />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="Export reports" />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="View analytics" />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch defaultChecked />} label="Configure alerts" />
                  </Grid>
                </Grid>
                
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Administration
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch />} label="Manage users" />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch />} label="Manage roles" />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch />} label="System settings" />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControlLabel control={<Switch />} label="View audit logs" />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoleDialog}>Cancel</Button>
          <Button onClick={handleSaveRole} variant="contained" color="primary">
            {editMode ? 'Update Role' : 'Create Role'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
