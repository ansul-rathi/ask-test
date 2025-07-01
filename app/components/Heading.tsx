import { Typography } from "@mui/material";
import React from "react";

function Heading({ label }: { label: string }) {
  return (
    <Typography
      color="primary"
      sx={{ fontWeight: 700, fontSize: { xs: "24px", md: "28px" } }}
    >
      {label}
    </Typography>
  );
}

export default Heading;
