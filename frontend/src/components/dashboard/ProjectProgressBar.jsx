import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { StatusChip } from '../common/StatusChip';

export const ProjectProgressBar = ({ projects = [] }) => {
  if (projects.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
        No projects available.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {projects.map((project) => {
        const pct = project.completionPercentage || 0;
        let color = 'primary';
        if (pct === 100) color = 'success';
        else if (pct < 30) color = 'warning';

        return (
          <Box key={project.id}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {project.name}
                </Typography>
                <StatusChip status={project.status} size="small" />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                {project.completedTasks} / {project.totalTasks} Tasks ({pct}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={pct}
              color={color}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'action.hover',
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
};
