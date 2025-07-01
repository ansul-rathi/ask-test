import { Box, BoxProps, alpha, styled } from '@mui/material'
import React from 'react'

export const FormBoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    width: '100%',
    padding: '16px',
    borderRadius: '10px',
    outline: '1px solid',
    backgroundColor: 'white',
    outlineColor:
        // theme.palette.mode === 'light'
        alpha('#BFCCD9', 0.5),
    // : alpha('#9CCCFC', 0.1),
    boxShadow:
        // theme.palette.mode === 'light'
        `0 0 12px 8px ${alpha('#9CCCFC', 0.2)}`
}));

