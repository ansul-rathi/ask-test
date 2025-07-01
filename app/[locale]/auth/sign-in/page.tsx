'use client'
import * as React from 'react'
import { Link } from '@/i18n/routing';
import AppLogo from '@/app/components/layout/AppLogo'
import { useSearchParams } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Grid,
  Box,
  FormControlLabel,
  Checkbox,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material'
import ExclamationCircleIcon from "@mui/icons-material/ErrorOutline";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import useNavigateWithLocale from '@/app/hooks/useNavigateLocale';
import { useLocale } from 'next-intl';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAuth } from '@/app/contexts/AuthContext';


interface SignInFormInputs {
  email: string;
  password: string;
}

export default function SignIn() {
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') ?? '';
  const navigateTo = useNavigateWithLocale();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);


  const {login} = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormInputs>();

  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    try {
      setError("");
      setLoading(true);
      
      await login(data.email, data.password);
      navigateTo('/');
    } catch (error: any) {
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Card
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '1px 1px 1px #eee',
        padding: 4,
      }}
    >
      <CardHeader avatar={<AppLogo />} />
      <Typography component="h1" variant="h3">
        Sign in
      </Typography>
      <CardContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          New users get 15 free credits when they sign up!
        </Alert>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          autoComplete="email"
          autoFocus
          defaultValue={email}
          {...register('email', { required: 'Email is required' })}
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ''}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          {...register('password', { required: 'Password is required' })}
          error={!!errors.password}
          helperText={errors.password ? errors.password.message : ''}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />

        {error && (
          <Alert icon={<ExclamationCircleIcon color="error" sx={{ mr: 1 }} />} severity="error">
            {error}
          </Alert>
        )}
        
        <LoadingButton
            loading={loading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </LoadingButton>
          <Grid container>
            <Grid item xs>
              <Link
                style={{ color: '#551A8B' }}
                href="/auth/send-verification-code"
              >
                {'Forgot password?'}
              </Link>
            </Grid>
            <Grid item>
              <Link href="/auth/sign-up">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>      
    </CardContent>
    </Card>
  )
}
