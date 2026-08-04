import React from 'react';
import Chip from '@mui/material/Chip';

export const PriorityChip = ({ priority, size = 'small' }) => {
  let color = 'default';
  let label = priority || 'MEDIUM';

  switch (priority) {
    case 'HIGH':
      color = 'error';
      break;
    case 'MEDIUM':
      color = 'warning';
      break;
    case 'LOW':
      color = 'success';
      break;
    default:
      color = 'default';
  }

  return (
    <Chip
      label={label}
      color={color}
      size={size}
      variant="outlined"
      sx={{
        fontWeight: 600,
        fontSize: size === 'small' ? '0.7rem' : '0.8rem',
      }}
    />
  );
};
