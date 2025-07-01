'use client';

import Portal from "@mui/material/Portal";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

interface SplashScreenProps {
  portal?: boolean;
  containerClass?: string;
  [key: string]: any;
}

export function SplashScreen({ portal = true, containerClass, ...other }: SplashScreenProps) {
  const content = (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'gray.100',
        zIndex: 1000,
        ...other.sx
      }}
      className={containerClass}
      {...other}
    >
      {/* <Logo /> */}
      <CircularProgress
        color="primary"
        size={80}
        thickness={4}
      />
    </Box>

  );

  if (portal) {
    return <Portal>{content}</Portal>;
  }

  return content;
}
