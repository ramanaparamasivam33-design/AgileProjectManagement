import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export const LoadingSpinner = ({ message = 'Loading details...' }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 240,
      gap: 2,
      py: 6,
    }}
  >
    <CircularProgress size={48} thickness={4} color="primary" />
    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
      {message}
    </Typography>
  </Box>
);
