"use client";

import * as React from "react";
import ExclamationCircleIcon from "@mui/icons-material/ErrorOutline";
import AppLogo from "@/app/components/layout/AppLogo";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Grid,
  Box,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadingButton from '@mui/lab/LoadingButton'; 
import { useRouter, useParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from '@/i18n/routing';

type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
};

export default function SignUp() {
  const router = useRouter();
  const routeParams = useParams();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false); 

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormValues>();

  const values = watch();

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch('/api/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      }).then((res) => res.json());


      if (response.success) {
        navigateToConfirmSignup(data.email);
      } else {
        setError(response.message || "An error occurred during sign-up.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign-up.");
      console.error("Sign-up error:", err);
    } finally {
      setLoading(false);
    }
  };

  const navigateToConfirmSignup = (email: string) => {
    router.push(
      `/${
        routeParams?.locale || "en"
      }/auth/confirm-signup?email=${encodeURIComponent(email)}`
    );
  };

  return (
    <Card
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "1px 1px 1px #eee",
        padding: 4,
      }}
    >
      <CardHeader avatar={<AppLogo />} />
      <Typography component="h1" variant="h3">
        Sign up
      </Typography>
      <Typography variant="subtitle1" sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
        Sign up today and get 15 free credits to start!
      </Typography>
      <CardContent>
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                required
                InputLabelProps={{ shrink: values.name ? true : false }}
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email Address"
                fullWidth
                required
                InputLabelProps={{ shrink: values.email ? true : false }}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Enter a valid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                fullWidth
                required
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
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
            </Grid>
          </Grid>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            loading={loading} 
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/auth/sign-in">Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
