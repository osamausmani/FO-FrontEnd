import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, Container, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Header from './Header';

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = (): void => {
    // This is now only used for mobile menu toggle in header
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header 
        handleDrawerToggle={handleDrawerToggle} 
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default
        }}
      >
        <Toolbar /> {/* This adds space below the fixed app bar */}
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
