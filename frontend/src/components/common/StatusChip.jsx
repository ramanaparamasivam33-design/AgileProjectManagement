import React from 'react';
import Chip from '@mui/material/Chip';

export const StatusChip = ({ status, size = 'small' }) => {
  let color = 'default';
  let label = status || 'UNKNOWN';

  switch (status) {
    case 'DONE':
    case 'COMPLETED':
      color = 'success';
      break;
    case 'IN_PROGRESS':
      color = 'primary';
      break;
    case 'TODO':
    case 'PLANNED':
      color = 'info';
      break;
    case 'OVERDUE':
    case 'CANCELLED':
      color = 'error';
      break;
    case 'ON_HOLD':
      color = 'warning';
      break;
    default:
      color = 'default';
  }

  return (
    <Chip
      label={label.replace('_', ' ')}
      color={color}
      size={size}
      variant="soft"
      sx={{
        fontWeight: 700,
        fontSize: size === 'small' ? '0.72rem' : '0.82rem',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}
    />
  );
};
