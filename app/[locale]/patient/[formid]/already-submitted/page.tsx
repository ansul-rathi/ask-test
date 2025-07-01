'use client'
import React from 'react'
import { Box, Typography, Button, Container } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { redirect } from 'next/navigation';

function FormSubmittedPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
            color: "#388e3c",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          Form Already Submitted
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#666",
            marginBottom: 4,
            fontFamily: "'Open Sans', sans-serif",
          }}
        >
          You have already submitted this form. If you need to make any changes, please contact surgical facility.
        </Typography>
        {/* <Button
          variant="contained"
          onClick={handleGoHome}
          sx={{
            backgroundColor: "#388e3c",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "30px",
            "&:hover": {
              backgroundColor: "#2e7d32",
            },
          }}
        >
          Go to Home
        </Button> */}
      </Container>
    </Box>
  );
};

export default FormSubmittedPage;
