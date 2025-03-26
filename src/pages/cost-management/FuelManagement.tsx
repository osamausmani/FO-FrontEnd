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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import BuildIcon from '@mui/icons-material/Build';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BarChartIcon from '@mui/icons-material/BarChart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

interface FuelTransaction {
  id: string;
  date: string;
  vehicleId: string;
  vehicleName: string;
  driverId: string;
  driverName: string;
  fuelType: 'regular' | 'premium' | 'diesel';
  gallons: number;
  pricePerGallon: number;
  totalCost: number;
  location: string;
  odometer: number;
  mpg?: number;
  notes?: string;
  receiptUrl?: string;
}

interface FuelMetrics {
  totalSpend: number;
  avgPricePerGallon: number;
  totalGallons: number;
  avgMpg: number;
  transactions: number;
}

const mockFuelTransactions: FuelTransaction[] = [
  {
    id: 'ft1',
    date: '2025-03-18T14:30:00',
    vehicleId: 'v1',
    vehicleName: 'Fleet Truck 001',
    driverId: 'd1',
    driverName: 'John Doe',
    fuelType: 'diesel',
    gallons: 35.2,
    pricePerGallon: 3.89,
    totalCost: 136.93,
    location: 'Fuel Stop A, Chicago, IL',
    odometer: 45678,
    mpg: 8.2,
    notes: 'Regular refueling',
    receiptUrl: '/receipts/ft1.pdf'
  },
  {
    id: 'ft2',
    date: '2025-03-17T10:15:00',
    vehicleId: 'v2',
    vehicleName: 'Fleet Car 002',
    driverId: 'd2',
    driverName: 'Jane Smith',
    fuelType: 'regular',
    gallons: 12.8,
    pricePerGallon: 3.45,
    totalCost: 44.16,
    location: 'Gas Station B, Evanston, IL',
    odometer: 28945,
    mpg: 24.6
  },
  {
    id: 'ft3',
    date: '2025-03-16T16:45:00',
    vehicleId: 'v3',
    vehicleName: 'Fleet Van 003',
    driverId: 'd3',
    driverName: 'Robert Johnson',
    fuelType: 'regular',
    gallons: 18.5,
    pricePerGallon: 3.52,
    totalCost: 65.12,
    location: 'Fuel Center C, Naperville, IL',
    odometer: 34567,
    mpg: 18.9,
    notes: 'Filled up before long trip'
  },
  {
    id: 'ft4',
    date: '2025-03-15T08:20:00',
    vehicleId: 'v4',
    vehicleName: 'Fleet Truck 004',
    driverId: 'd4',
    driverName: 'Sarah Williams',
    fuelType: 'diesel',
    gallons: 42.1,
    pricePerGallon: 3.92,
    totalCost: 165.03,
    location: 'Truck Stop D, Joliet, IL',
    odometer: 78923,
    mpg: 7.8
  },
  {
    id: 'ft5',
    date: '2025-03-14T12:10:00',
    vehicleId: 'v1',
    vehicleName: 'Fleet Truck 001',
    driverId: 'd1',
    driverName: 'John Doe',
    fuelType: 'diesel',
    gallons: 30.8,
    pricePerGallon: 3.85,
    totalCost: 118.58,
    location: 'Fuel Stop E, Gary, IN',
    odometer: 45325,
    mpg: 8.4
  },
];

const calculateFuelMetrics = (transactions: FuelTransaction[]): FuelMetrics => {
  const totalSpend = transactions.reduce((sum, t) => sum + t.totalCost, 0);
  const totalGallons = transactions.reduce((sum, t) => sum + t.gallons, 0);
  const avgPricePerGallon = totalGallons > 0 ? totalSpend / totalGallons : 0;
  
  const validMpgTransactions = transactions.filter(t => t.mpg !== undefined);
  const avgMpg = validMpgTransactions.length > 0 
    ? validMpgTransactions.reduce((sum, t) => sum + (t.mpg || 0), 0) / validMpgTransactions.length 
    : 0;
  
  return {
    totalSpend,
    avgPricePerGallon,
    totalGallons,
    avgMpg,
    transactions: transactions.length
  };
};

const FuelManagement: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  const features: FeatureCard[] = [
    {
      title: 'Maintenance Costs',
      description: 'Track and analyze maintenance expenses',
      icon: <BuildIcon fontSize="large" color="primary" />,
      path: '/cost-management/maintenance'
    },
    {
      title: 'Budget Planning',
      description: 'Create and manage fleet budgets',
      icon: <AccountBalanceWalletIcon fontSize="large" color="primary" />,
      path: '/cost-management/budget'
    },
    {
      title: 'Expense Tracking',
      description: 'Monitor all fleet-related expenses',
      icon: <ReceiptIcon fontSize="large" color="primary" />,
      path: '/cost-management/expenses'
    },
    {
      title: 'Cost Analytics',
      description: 'Advanced analytics for cost optimization',
      icon: <BarChartIcon fontSize="large" color="primary" />,
      path: '/cost-management/analytics'
    },
    {
      title: 'Alerts & Thresholds',
      description: 'Set up cost alerts and spending thresholds',
      icon: <NotificationsIcon fontSize="large" color="primary" />,
      path: '/cost-management/alerts'
    },
    {
      title: 'Vendor Management',
      description: 'Manage fuel vendors and service providers',
      icon: <SettingsIcon fontSize="large" color="primary" />,
      path: '/cost-management/vendors'
    },
    {
      title: 'Vehicle TCO',
      description: 'Calculate total cost of ownership per vehicle',
      icon: <DirectionsCarIcon fontSize="large" color="primary" />,
      path: '/cost-management/tco'
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTransactions = mockFuelTransactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.vehicleName.toLowerCase().includes(searchLower) ||
      transaction.driverName.toLowerCase().includes(searchLower) ||
      transaction.location.toLowerCase().includes(searchLower) ||
      transaction.fuelType.toLowerCase().includes(searchLower)
    );
  });

  const fuelMetrics = calculateFuelMetrics(filteredTransactions);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType) {
      case 'diesel': return 'warning';
      case 'premium': return 'error';
      case 'regular': return 'success';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cost Management
        </Typography>
        <Typography variant="body1" paragraph>
          Track, analyze, and optimize all fleet-related expenses to reduce costs and improve financial performance.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="fuel management tabs">
                <Tab label="Fuel Transactions" />
                <Tab label="Analytics" />
                <Tab label="Reports" />
                <Tab label="Settings" />
              </Tabs>
            </Box>
            <Box sx={{ p: 3 }}>
              {tabValue === 0 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        placeholder="Search transactions..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ width: 300, mr: 2 }}
                      />
                      <IconButton>
                        <FilterListIcon />
                      </IconButton>
                    </Box>
                    <Box>
                      <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        component={Link}
                        to="/cost-management/fuel/new"
                        sx={{ mr: 1 }}
                      >
                        Add Transaction
                      </Button>
                      <IconButton title="Download CSV">
                        <DownloadIcon />
                      </IconButton>
                      <IconButton title="Print">
                        <PrintIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>Total Fuel Spend</Typography>
                          <Typography variant="h5">{formatCurrency(fuelMetrics.totalSpend)}</Typography>
                          <Typography variant="body2">{fuelMetrics.transactions} transactions</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>Avg. Price/Gallon</Typography>
                          <Typography variant="h5">{formatCurrency(fuelMetrics.avgPricePerGallon)}</Typography>
                          <Typography variant="body2">{fuelMetrics.totalGallons.toFixed(1)} total gallons</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>Avg. MPG</Typography>
                          <Typography variant="h5">{fuelMetrics.avgMpg.toFixed(1)}</Typography>
                          <Typography variant="body2">Fleet fuel efficiency</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>Monthly Trend</Typography>
                          <Typography variant="h5">-3.2%</Typography>
                          <Typography variant="body2" sx={{ color: 'success.main' }}>Decreasing vs. last month</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Vehicle</TableCell>
                          <TableCell>Driver</TableCell>
                          <TableCell>Fuel Type</TableCell>
                          <TableCell align="right">Gallons</TableCell>
                          <TableCell align="right">Price/Gal</TableCell>
                          <TableCell align="right">Total</TableCell>
                          <TableCell align="right">MPG</TableCell>
                          <TableCell>Location</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{formatDate(transaction.date)}</TableCell>
                            <TableCell>{transaction.vehicleName}</TableCell>
                            <TableCell>{transaction.driverName}</TableCell>
                            <TableCell>
                              <Chip 
                                label={transaction.fuelType.toUpperCase()} 
                                color={getFuelTypeColor(transaction.fuelType)} 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell align="right">{transaction.gallons.toFixed(1)}</TableCell>
                            <TableCell align="right">{formatCurrency(transaction.pricePerGallon)}</TableCell>
                            <TableCell align="right">{formatCurrency(transaction.totalCost)}</TableCell>
                            <TableCell align="right">{transaction.mpg?.toFixed(1) || 'N/A'}</TableCell>
                            <TableCell>{transaction.location}</TableCell>
                            <TableCell>
                              <IconButton size="small" component={Link} to={`/cost-management/fuel/${transaction.id}`}>
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" component={Link} to={`/cost-management/fuel/${transaction.id}/edit`}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small">
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
                <Typography variant="body1">Analytics content would be displayed here.</Typography>
              )}
              {tabValue === 2 && (
                <Typography variant="body1">Reports content would be displayed here.</Typography>
              )}
              {tabValue === 3 && (
                <Typography variant="body1">Settings content would be displayed here.</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Cost Management Features
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography gutterBottom variant="h6" component="h2" align="center">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button 
                      component={Link} 
                      to={feature.path} 
                      variant="outlined" 
                      size="small"
                      sx={{ borderRadius: 2 }}
                    >
                      Explore
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FuelManagement;
