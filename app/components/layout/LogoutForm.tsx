"use client";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { toast } from "react-toastify";
import useNavigateWithLocale from "@/app/hooks/useNavigateLocale";
import { useUserStore } from "@/app/store/user.store";
import { useAuth } from "@/app/contexts/AuthContext";

export default function LogoutForm() {
  const {logout: signOut} = useAuth()
  const [open, setOpen] = useState(false);
  const navigateTo = useNavigateWithLocale();

  const handleDialogOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleAgree = async () => {
  setOpen(false);
  
  try {
    // Reset user store first
    await useUserStore.getState().reset();
    
    // Then sign out (this now properly clears server session)
    await signOut();
    
    toast.info("User logged out successfully");
    
    // Use window.location.replace to prevent back navigation and force refresh
    window.location.replace("/en/auth/sign-in");
        // navigateTo("/auth/sign-in");

    
  } catch (error) {
    console.error("Error during logout:", error);
    toast.error("Error during logout");
    // Force navigation even if logout failed
    window.location.replace("/auth/sign-in");
  }
};

  // const handleAgree = async () => {
  //   setOpen(false);
  //   await useUserStore.getState().reset();
  //   await signOut();
  //   toast.info("User logged out successfully");
  //   navigateTo("/auth/sign-in");
  // };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Sign Out</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to sign out from all devices?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAgree} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        onClick={handleDialogOpen}
        variant="text"
        color="error"
        sx={{ textTransform: "capitalize", borderRadius: "8px" }}
        startIcon={<LogoutIcon />}
      >
        Sign out
      </Button>
    </>
  );
}
