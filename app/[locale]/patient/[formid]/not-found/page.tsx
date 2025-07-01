'use client'
import { Alert, Box, Typography } from '@mui/material'
import React from 'react'

function NotFoundPage() {
  return (
    <Box sx={{ p: 2 }}>
      <Alert severity="error">
        <Typography variant="h6">Form Not Found</Typography>
      </Alert>
    </Box>
  )
}

export default NotFoundPage
