"use client";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

function PaymentCancelActions() {
  const router = useRouter();

  const handleTryAgain = () => {
    router.back(); // Navigate to the previous page
  };

  const handleCancel = () => {
    router.push("/"); // Redirect to the home page
  };
  return (
    <Box sx={{ display: "flex", justifyContent: "space-around", marginTop: 2 }}>
      <Button
        variant="contained"
        onClick={handleCancel}
        sx={{
          backgroundColor: "#d32f2f",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "30px",
          "&:hover": {
            backgroundColor: "#b71c1c",
          },
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={handleTryAgain}
        sx={{
          // backgroundColor: "#d32f2f",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "30px",
          "&:hover": {
            // backgroundColor: "#b71c1c",
          },
        }}
      >
        Try Again
      </Button>
    </Box>
  );
}

export default PaymentCancelActions;
