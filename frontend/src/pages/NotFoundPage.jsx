import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" sx={{ fontWeight: 900, color: 'primary.main', fontSize: '6rem' }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Page Not Found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
        The requested page does not exist or has been relocated.
      </Typography>
      <Button variant="contained" startIcon={<HomeRoundedIcon />} onClick={() => navigate('/')}>
        Back to Dashboard
      </Button>
    </Box>
  );
};
