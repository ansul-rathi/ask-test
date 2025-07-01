"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AppLogo from "@/app/components/layout/AppLogo";
import useNavigateWithLocale from "@/app/hooks/useNavigateLocale";
import { Link } from "@/i18n/routing";
import { LoadingButton } from "@mui/lab";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [showPassword, togglePassword] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigateTo = useNavigateWithLocale();

  // Fetch the email from the query parameters
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const emailFromQuery = query.get("email");
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          confirmationCode: formData.get("confirmationCode"),
          newPassword: formData.get("newPassword"),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        navigateTo("/auth/sign-in");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password");
    }finally {
      setLoading(false); // Set loading to false
    }
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
        Reset Password
      </Typography>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            disabled
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmationCode"
            label="Confirmation Code"
            type="number"
            id="confirmationCode"
            autoComplete="current-password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => togglePassword((show) => !show)}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            type={showPassword ? "text" : "password"}
            name="newPassword"
            label="New Password"
            id="newPassword"
            autoComplete="current-password"
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            loading={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            Set New Password
          </LoadingButton>
          <Grid container>
            <Grid item xs>
              <Link style={{ color: "#551A8B" }} href="/auth/sign-in">
                Sign in
              </Link>
            </Grid>
            <Grid item>
              <Link href="/auth/sign-up">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
