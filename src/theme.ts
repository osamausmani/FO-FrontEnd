import { createTheme, PaletteOptions, ThemeOptions } from '@mui/material/styles';
import { PaletteColorOptions } from '@mui/material';
import type {} from '@mui/x-data-grid/themeAugmentation';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral?: PaletteColorOptions;
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#2E7D8A',  // Teal-blue shade more suitable for fleet management
      light: '#4CA0AD',
      dark: '#1E5760',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#50d46e',
      light: '#7ce293',
      dark: '#35b24f',
      contrastText: '#121618',
    },
    neutral: {
      main: '#64748B',
      light: '#94a3b8',
      dark: '#475569',
      contrastText: '#ffffff',
    },
    background: {
      default: '#121618',
      paper: '#1e2326',
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#b0bbcc',
      disabled: '#64748b',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#121618',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      contrastText: '#121618',
    },
    divider: '#2d3748',
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.5,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.5px',
      lineHeight: 1.5,
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          '&.MuiButton-contained': {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
        sizeSmall: {
          height: 32,
          fontSize: '0.8125rem',
        },
        sizeMedium: {
          height: 40,
          fontSize: '0.875rem',
        },
        sizeLarge: {
          height: 48,
          fontSize: '1rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#2d3748',
            },
            '&:hover fieldset': {
              borderColor: '#4a5568',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2E7D8A',
            },
            '&.Mui-error fieldset': {
              borderColor: '#ef4444',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
        },
        elevation2: {
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.15), 0px 2px 4px rgba(0, 0, 0, 0.12)',
        },
        elevation3: {
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15), 0px 3px 6px rgba(0, 0, 0, 0.10)',
        },
        elevation4: {
          boxShadow: '0px 15px 25px rgba(0, 0, 0, 0.15), 0px 5px 10px rgba(0, 0, 0, 0.10)',
        },
        elevation6: {
          boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #2d3748',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderBottom: '1px solid #2d3748',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: '#1e2326',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          '& .MuiTableCell-root': {
            color: '#b0bbcc',
            fontWeight: 600,
            lineHeight: '1.25rem',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            borderColor: '#2d3748',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e2326',
          backgroundImage: 'none',
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
