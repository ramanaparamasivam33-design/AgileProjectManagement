import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const TaskStatusPieChart = ({ statusCounts = {} }) => {
  const colors = {
    DONE: '#10b981',        // Emerald
    IN_PROGRESS: '#6366f1', // Indigo
    TODO: '#3b82f6',        // Blue
    OVERDUE: '#ef4444',     // Red
  };

  const labels = {
    DONE: 'Completed',
    IN_PROGRESS: 'In Progress',
    TODO: 'To Do',
    OVERDUE: 'Overdue',
  };

  const total = Object.values(statusCounts).reduce((acc, curr) => acc + (curr || 0), 0);

  if (total === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
        <Typography variant="body2">No task status data available</Typography>
      </Box>
    );
  }

  // Calculate SVG Pie Segments
  let cumulativeAngle = 0;
  const slices = Object.entries(statusCounts).map(([status, count]) => {
    const value = count || 0;
    const percentage = ((value / total) * 100).toFixed(1);
    const angle = (value / total) * 360;

    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    const endAngle = cumulativeAngle;

    // Convert angles to SVG arc coordinates
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = 100 + 80 * Math.cos(startRad);
    const y1 = 100 + 80 * Math.sin(startRad);
    const x2 = 100 + 80 * Math.cos(endRad);
    const y2 = 100 + 80 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = value === total
      ? `M 100 20 A 80 80 0 1 1 99.99 20 Z`
      : `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      status,
      count: value,
      percentage,
      color: colors[status] || '#94a3b8',
      label: labels[status] || status,
      pathData,
    };
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3, py: 1 }}>
      {/* SVG Pie Chart */}
      <Box sx={{ width: 180, height: 180, flexShrink: 0, position: 'relative' }}>
        <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          {slices.map((slice, idx) => (
            <path
              key={idx}
              d={slice.pathData}
              fill={slice.color}
              style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            />
          ))}
          {/* Inner cutout for donut chart effect */}
          <circle cx="100" cy="100" r="50" fill="var(--mui-palette-background-paper)" />
        </svg>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {total}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Tasks
          </Typography>
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.2, width: '100%' }}>
        {slices.map((slice) => (
          <Box
            key={slice.status}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 0.8,
              borderRadius: 1.5,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: slice.color,
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {slice.label}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
              {slice.count} ({slice.percentage}%)
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
