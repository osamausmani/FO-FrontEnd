import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

interface LoginFormValues {
  email: string;
  password: string;
}

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

const Login: React.FC = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleTogglePassword = (): void => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            width: '100%',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              borderRadius: '50%',
              p: 1,
              mb: 2,
            }}
          >
            <LockOutlinedIcon />
          </Box>
          <Typography component="h1" variant="h5" gutterBottom>
            Sign in to FleetOrbit
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter your credentials to access your account
          </Typography>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values: LoginFormValues, { setSubmitting }: FormikHelpers<LoginFormValues>) => {
              await login(values.email, values.password);
              setSubmitting(false);
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form style={{ width: '100%' }}>
                <Field
                  as={TextField}
                  name="email"
                  label="Email Address"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  autoComplete="email"
                  autoFocus
                />
                <Field
                  as={TextField}
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ mt: 1, mb: 2 }}>
                  <Link component={RouterLink} to="/forgot-password" variant="body2">
                    Forgot password?
                  </Link>
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                  sx={{ mt: 2, mb: 2, py: 1.2 }}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : 'Sign In'}
                </Button>
              </Form>
            )}
          </Formik>

          <Grid container justifyContent="center">
            <Grid item>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" variant="body2">
                  Sign up
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
