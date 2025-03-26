import React from 'react';
import {
  Drawer,
  List,
  Typography,
  Box,
  IconButton,
  useTheme
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  width: number;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, width }) => {
  const theme = useTheme();

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: theme.spacing(0, 1),
          ...theme.mixins.toolbar,
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, ml: 2 }} fontWeight="600" color="primary">
          FLEET<span style={{ color: theme.palette.text.primary }}>ADMIN</span>
        </Typography>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <List sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          Navigation menu has been moved to the header.
        </Typography>
      </List>
    </Drawer>
  );
};

export default Sidebar;
