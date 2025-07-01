"use server";

import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import PaymentCancelActions from "./PaymentCancelActions";

const PaymentCancel: React.FC = () => {
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
        <CancelIcon
          sx={{
            fontSize: 80,
            color: "#f44336", // Red color for cancellation
            marginBottom: 2,
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            marginBottom: 1,
            color: "#d32f2f",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          Payment Canceled
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#666",
            marginBottom: 4,
            fontFamily: "'Open Sans', sans-serif",
          }}
        >
          Your payment was not successful or was canceled. Please try again.
        </Typography>
        <PaymentCancelActions />
      </Container>
    </Box>
  );
};

export default PaymentCancel;
