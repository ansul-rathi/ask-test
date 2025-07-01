"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HistoryIcon from '@mui/icons-material/History';
import LogoutForm from "./LogoutForm";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/app/contexts/AuthContext";

function HistoryButton(){
  return (<Button
    color="primary"
    variant="text"
    sx={{ textTransform: "capitalize", borderRadius: "8px" }}
    component={Link}
    href="/history"
    startIcon={<HistoryIcon />}
  >
    History
  </Button>)
}

function AppHeaderMenu({ isLoading}: any) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  // Content for the mobile drawer
  const drawerContent = (
    <Box
      sx={{
        width: 250,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {!isAuthenticated ? (
        <>
          <Button
            variant="text"
            color="primary"
            component={Link}
            href="/auth/sign-in"
            onClick={handleDrawerToggle}
            sx={{ textTransform: "none" }}
          >
            Sign in
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/auth/sign-up"
            onClick={handleDrawerToggle}
            sx={{ textTransform: "none" }}
          >
            Sign up
          </Button>
        </>
      ) : (
        <>
          <HistoryButton />
          <LogoutForm />
        </>
        // LogoutForm already renders its own button & dialog
      )}
    </Box>
  );

  return (
    <>
      {isLoading ? (
        <CircularProgress size={20} />
      ) : (
        <>
          {/* Desktop Menu: visible on md and larger */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {!isAuthenticated ? (
              <>
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  sx={{ textTransform: "none" }}
                  component={Link}
                  href="/auth/sign-in"
                >
                  Sign in
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  sx={{ textTransform: "none" }}
                  component={Link}
                  href="/auth/sign-up"
                >
                  Sign up
                </Button>
              </>
            ) : (
              <>
                <HistoryButton />
                <LogoutForm />
              </>
            )}
          </Box>
          {/* Mobile Menu: visible on xs screens */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              aria-label="open drawer"
            >
              <MenuIcon color="primary"/>
            </IconButton>
            <Drawer
              anchor="left"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            >
              {drawerContent}
            </Drawer>
          </Box>
        </>
      )}
    </>
  );
}

export default AppHeaderMenu;
