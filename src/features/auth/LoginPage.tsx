import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import { useAuth } from './useAuth';

interface LoginFormData {
  name: string;
  email: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    name: '',
    email: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string>('');

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      await signIn(formData);
      navigate('/');
    } catch (err) {
      setError('Failed to sign in. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <PetsIcon color="primary" sx={{ fontSize: 64 }} />
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            Buddy
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'text.secondary', textAlign: 'center', mb: 2 }}
          >
            Find your perfect furry companion
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            borderRadius: 2,
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
