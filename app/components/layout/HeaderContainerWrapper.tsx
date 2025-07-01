
import { AppBar, Container, Toolbar } from "@mui/material";
import React from "react";

function HeaderContainerWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        // mt: 2,
      }}
    >
      {/* <Container maxWidth="lg"> */}
      <div>
        <Toolbar
          variant="regular"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            // borderRadius: "999px",
            bgcolor: "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(24px)",
            maxHeight: 40,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)"
          }}
        >
          {children}
        </Toolbar>
      </div>
      {/* </Container> */}
    </AppBar>
  );
}

export default HeaderContainerWrapper;
