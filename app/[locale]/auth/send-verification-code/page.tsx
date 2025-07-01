"use client";

import React, { useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { Link } from "@/i18n/routing";
import AppLogo from "@/app/components/layout/AppLogo";
import useNavigateWithLocale from "@/app/hooks/useNavigateLocale";
import { LoadingButton } from "@mui/lab";

const SendVerificationCode: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const navigateTo = useNavigateWithLocale();

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    setLoading(true);
    event.preventDefault();

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), 
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        navigateTo(`/auth/forgot-password?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error sending forgot password request:", error);
      toast.error("Failed to send password reset email");
    }finally{
      setLoading(false)
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
        Forgot Password
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
            value={email} // Bind the input value to the email state
            onChange={(e) => setEmail(e.target.value)} // Update the email state on change
          />
          <LoadingButton
            type="submit"
            fullWidth
            loading={isLoading}
            variant="contained"
            sx={{ mt: 3, mb: 2, textTransform: "none" }}
          >
            Send Verification Code
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
};

export default SendVerificationCode;
