"use client";
import AppLogo from "@/app/components/layout/AppLogo";
import HeaderContainerWrapper from "@/app/components/layout/HeaderContainerWrapper";
import LanguageSelect from "@/app/components/layout/LanguageSelect";
import LanguageTranslator from "@/app/components/layout/LanguageTranslator";
import { useAppContext } from "@/app/hooks/useAppContext";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import { useRouter } from "@/i18n/routing";

import {
  Box,
  Step,
  StepLabel,
  Stepper,
  Hidden,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React, { ChangeEvent, useEffect } from "react";

// const languages = [
//   { code: "en", label: "English" },
//   { code: "es", label: "Spanish" },
//   { code: "ar", label: "Arabic" },
//   { code: "hi", label: "Hindi" },
//   { code: "zh", label: "Mandarin" },
//   { code: "vi", label: "Vietnamese" },
// ];

function StepperHeader({locale}: {locale:string }) {
  const t = useTranslations("Index");
  // const router = useRouter();
  const routeParams = useParams();
  // const [language, setLanguage] = React.useState<string>(
  //   (routeParams?.locale as string) || "en"
  // );

  const steps = [t("stepper1"), t("stepper2"), t("stepper3"), t("stepper4")];
  // const [step] = useLocalStorage("stepper", "0");
  const {
    form1: { form1Step },
  } = useAppContext();
  // const handleLanguageChange = (e: ChangeEvent<{ value: unknown }>) => {
  //   const nextLocale = e.target.value as string;
  //   console.log("sdasfdsfsdgfgfd", nextLocale);
  //   setLanguage(nextLocale);
  //   console.log("sdasfdsfsdgfgfddasfadf", language);

  //   router.replace(
  //     `/patient/${routeParams?.formid}`
  //   );
  //   // locale
  // };


  return (
    <HeaderContainerWrapper>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          //   ml: "-18px",
          px: 0,
          justifyContent: "space-between",
        }}
      >
        <AppLogo />
        <Stepper
          activeStep={Number(form1Step)}
          sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "row" }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {/* <LanguageTranslator /> */}
        <Box sx={{ mx: 2 }}>
        <LanguageSelect locale={locale} />
      </Box>
      </Box>
    </HeaderContainerWrapper>
  );
}

export default StepperHeader;
