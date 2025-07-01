// ClientComponent.tsx
"use client";

import React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Box, CssBaseline } from "@mui/material";
import ThemeRegistry from "../ThemeRegistry";
import AppContextProvider from "../contexts/AppContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

interface ClientComponentProps {
  children: React.ReactNode;
  locale: string;
  messages: any;
  // session: Session
}



export default function ClientComponent({
  children,
  locale,
  messages,
  // session
}: ClientComponentProps) {
  return (
    // <SessionProvider session={session}>
      <AppRouterCacheProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AppContextProvider>
            <ThemeRegistry options={{ key: "mui-theme" }}>
              <CssBaseline />
              <Box
                sx={{
                  backgroundImage: "linear-gradient(180deg, #CEE5FD, #FFF)",
                  backgroundSize: "100% 40%",
                  backgroundRepeat: "no-repeat",
                  width: "100vw",
                  height: "100vh",
                  position: "absolute",
                  zIndex: -10,
                }}
              />
              {children}
              <ToastContainer />
            </ThemeRegistry>
          </AppContextProvider>
        </LocalizationProvider>
      </AppRouterCacheProvider>
    // </SessionProvider>
  );
}
