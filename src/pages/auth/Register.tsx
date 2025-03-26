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
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  role: string;
}

interface UserData {
  name: string;
  email: string;
  password: string;
  company: string;
  role: string;
}

// Validation schema
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  companyName: Yup.string()
    .required('Company name is required'),
  role: Yup.string()
    .required('Role is required')
}) as Yup.Schema<RegisterFormValues>;

const Register: React.FC = () => {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleTogglePassword = (): void => {
    setShowPassword(!showPassword);
  };

  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps: string[] = ['Account Information', 'Company Details'];

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 8
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
            <PersonAddIcon />
          </Box>
          <Typography component="h1" variant="h5" gutterBottom>
            Create an Account
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Register to start managing your fleet
          </Typography>

          <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              companyName: '',
              role: 'admin'
            }}
            validationSchema={RegisterSchema}
            onSubmit={async (values: RegisterFormValues, { setSubmitting }: FormikHelpers<RegisterFormValues>) => {
              // Prepare data for API
              const userData: UserData = {
                name: values.name,
                email: values.email,
                password: values.password,
                company: values.companyName,
                role: values.role
              };
              
              await register(userData);
              setSubmitting(false);
            }}
          >
            {({ errors, touched, isSubmitting, values, isValid }) => (
              <Form style={{ width: '100%' }}>
                {activeStep === 0 ? (
                  // Step 1: Account Information
                  <>
                    <Field
                      as={TextField}
                      name="name"
                      label="Full Name"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      autoComplete="name"
                      autoFocus
                    />
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
                      autoComplete="new-password"
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
                    <Field
                      as={TextField}
                      name="confirmPassword"
                      label="Confirm Password"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                      autoComplete="new-password"
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      disabled={!values.name || !values.email || !values.password || !values.confirmPassword || Boolean(errors.name) || Boolean(errors.email) || Boolean(errors.password) || Boolean(errors.confirmPassword)}
                      sx={{ mt: 3, mb: 2, py: 1.2 }}
                    >
                      Next
                    </Button>
                  </>
                ) : (
                  // Step 2: Company Details
                  <>
                    <Field
                      as={TextField}
                      name="companyName"
                      label="Company Name"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.companyName && Boolean(errors.companyName)}
                      helperText={touched.companyName && errors.companyName}
                      autoFocus
                    />
                    <Field
                      as={TextField}
                      name="role"
                      label="Your Role"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      error={touched.role && Boolean(errors.role)}
                      helperText={touched.role && errors.role}
                      value="admin"
                      disabled
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 2 }}>
                      <Button
                        onClick={handleBack}
                        variant="outlined"
                        sx={{ py: 1.2, px: 4 }}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting || !isValid}
                        sx={{ py: 1.2, px: 4 }}
                      >
                        {isSubmitting ? <CircularProgress size={24} /> : 'Register'}
                      </Button>
                    </Box>
                  </>
                )}
              </Form>
            )}
          </Formik>

          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <Grid item>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" variant="body2">
                  Sign in
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
