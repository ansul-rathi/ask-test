'use server'
import { Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";

function HeroBanner() {

  const t = useTranslations("Index");
  return (
    <Stack
      spacing={2}
      useFlexGap
      sx={{ px: 2, textAlign: "center" }}
      alignItems="center"
      justifyContent="center"
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography
          fontWeight={800}
          sx={{ width: { sm: "100%", md: "80%" } }}
          fontSize={22}
        >
          {/* Send a screening questionnaire via email, receive a HIPAA compliant
          summarized 1 page PDF */}
        {t("heroTitle")}
        </Typography>
      </div>

      {/* <Typography
        component="span"
        variant="h6"
        fontSize={21}
        sx={{
          color: "primary.main",
        }}
      >
        Unlimited <s>$3/day</s> FREE
      </Typography> */}
    </Stack>
  );
}

export default HeroBanner;
