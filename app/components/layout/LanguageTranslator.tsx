import { Box, FormControl, MenuItem, Select } from "@mui/material";
import React, { ChangeEvent } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "ar", label: "Arabic" },
  { code: "hi", label: "Hindi" },
  { code: "zh", label: "Mandarin" },
  { code: "vi", label: "Vietnamese" },
];

function LanguageTranslator() {
  const [language, setLanguage] = React.useState<string>("en");
  const router = useRouter();
  const routeParams = useParams();
  // console.log("asdfkjadgkajsgdf", routeParams);

  const handleLanguageChange = (e: ChangeEvent<{ value: unknown }>) => {
    const nextLocale = e.target.value as string;
    setLanguage(nextLocale);
    router.replace(
      `${window.location.origin}/${nextLocale}/patient/${routeParams?.formid}`
    );
  };

  return (
    <Box>
      <FormControl fullWidth>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={language}
          placeholder="Choose Language"
          onChange={handleLanguageChange as any}
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {lang.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default LanguageTranslator;
