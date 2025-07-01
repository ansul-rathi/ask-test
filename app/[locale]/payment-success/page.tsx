"use client";

import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";
import CREDITS_ACTIONS from "@/app/constants/credit-actions";
import { useUserStore } from "@/app/store/user.store";
import { useAuth } from "@/app/contexts/AuthContext";

const PaymentSuccess: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { getUserDetails } = useUserStore();

  const refreshUserCredits = async () => {
    try {
      if (isAuthenticated) {
        await getUserDetails(user?.email || "");
      }
    } catch (error) {
      console.error("Error refreshing credits:", error);
    }
  };

  const handleBackToHome = async () => {
    await refreshUserCredits();
    router.replace("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
        padding: 4,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          textAlign: "center",
          backgroundColor: "#ffffff",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <CheckCircleIcon
          sx={{
            fontSize: 80,
            color: "#4caf50",
            marginBottom: 2,
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            marginBottom: 1,
            color: "#000000",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          Payment Successful!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#666",
            marginBottom: 4,
            fontFamily: "'Open Sans', sans-serif",
          }}
        >
          Thank you for your purchase. Your transaction was completed
          successfully.
        </Typography>
        <Button
          variant="contained"
          onClick={handleBackToHome}
          sx={{
            backgroundColor: "#3f51b5",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "30px",
            "&:hover": {
              backgroundColor: "#303f9f",
            },
          }}
        >
          Back to Home
        </Button>
      </Container>
    </Box>
  );
};

export default PaymentSuccess;
