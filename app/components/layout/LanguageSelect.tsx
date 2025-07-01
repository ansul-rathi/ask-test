'use client'

import { MenuItem, TextField } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'

// Array of languages
const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Spanish" },
    { code: "ar", label: "Arabic" },
    { code: "hi", label: "Hindi" },
    { code: "zh", label: "Mandarin" },
    { code: "vi", label: "Vietnamese" },
  ];
  

function LanguageSelect({locale}: {locale: string}) {

    const router = useRouter();
    const pathname = usePathname();
  
  
    const handleLanguageChange= (e: React.ChangeEvent<{ value: unknown }>) => {
      const nextLocale = e.target.value as string;
      const pathWithoutLocale = pathname?.replace(/^\/(es|en|ar|hi|zh|vi)/, '');
  
      router.replace(`/${nextLocale}${pathWithoutLocale}`);
    }
  return (
    <TextField
    // id="demo-simple-select"
    value={locale}
    variant="standard"
    InputProps={{ disableUnderline: true }}
    select
    color="primary"
    // sx={{padding: 1, minWidth: '100px'}}
    placeholder="Choose Language"
    onChange={handleLanguageChange as any}
  >
    {languages.map((lang) => (
      <MenuItem key={lang.code} value={lang.code}>
        {lang.label}
      </MenuItem>
    ))}
  </TextField>
  )
}

export default LanguageSelect
