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
  CircularProgress,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import LockResetIcon from '@mui/icons-material/LockReset';

interface ForgotPasswordFormValues {
  email: string;
}

// Validation schema
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
});

const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [success, setSuccess] = useState<boolean>(false);

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
            <LockResetIcon />
          </Box>
          <Typography component="h1" variant="h5" gutterBottom>
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter your email address and we'll send you a link to reset your password
          </Typography>

          {success ? (
            <>
              <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
                Password reset email sent. Please check your inbox.
              </Alert>
              <Button
                component={RouterLink}
                to="/login"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2, mb: 2, py: 1.2 }}
              >
                Back to Login
              </Button>
            </>
          ) : (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={ForgotPasswordSchema}
              onSubmit={async (values: ForgotPasswordFormValues, { setSubmitting }: FormikHelpers<ForgotPasswordFormValues>) => {
                const result = await forgotPassword(values.email);
                if (result) {
                  setSuccess(true);
                }
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
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ mt: 3, mb: 2, py: 1.2 }}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : 'Reset Password'}
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          <Grid container justifyContent="center">
            <Grid item>
              <Typography variant="body2">
                Remember your password?{' '}
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

export default ForgotPassword;
