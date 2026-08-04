import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

// Icons
import FolderSpecialRoundedIcon from '@mui/icons-material/FolderSpecialRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import AssignmentCheckmarkIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import SyncProblemRoundedIcon from '@mui/icons-material/SyncProblemRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

import { dashboardService } from '../services/dashboardService';
import { useNotification } from '../contexts/NotificationContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { TaskStatusPieChart } from '../components/dashboard/TaskStatusPieChart';
import { ProjectProgressBar } from '../components/dashboard/ProjectProgressBar';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [schedulerLoading, setSchedulerLoading] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      showNotification(err.message || 'Failed to fetch dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRunAsyncScheduler = async () => {
    try {
      setSchedulerLoading(true);
      const res = await dashboardService.triggerOverdueCheck();
      if (res.success) {
        const count = res.data?.updatedOverdueCount || 0;
        showNotification(
          `Spring Scheduler scan complete! Marked ${count} overdue tasks.`,
          count > 0 ? 'warning' : 'success'
        );
        fetchStats();
      }
    } catch (err) {
      showNotification(err.message || 'Scheduler failed', 'error');
    } finally {
      setSchedulerLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading agile metrics dashboard..." />;

  const metricCards = [
    { title: 'Total Projects', count: stats?.totalProjects || 0, icon: <FolderSpecialRoundedIcon />, color: '#6366f1' },
    { title: 'User Stories', count: stats?.totalStories || 0, icon: <AutoStoriesRoundedIcon />, color: '#8b5cf6' },
    { title: 'Total Tasks', count: stats?.totalTasks || 0, icon: <AssignmentCheckmarkIcon />, color: '#3b82f6' },
    { title: 'Completed Tasks', count: stats?.completedTasks || 0, icon: <CheckCircleRoundedIcon />, color: '#10b981' },
    { title: 'Pending Tasks', count: stats?.pendingTasks || 0, icon: <PendingActionsRoundedIcon />, color: '#f59e0b' },
    { title: 'Overdue Tasks', count: stats?.overdueTasks || 0, icon: <AccessTimeFilledRoundedIcon />, color: '#ef4444' },
  ];

  return (
    <Box className="animate-fade-in">
      {/* Header Banner */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Agile Project Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time tracking of team projects, stories, and background scheduled tasks.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<RefreshRoundedIcon />}
            onClick={fetchStats}
            sx={{ borderRadius: 2 }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<SyncProblemRoundedIcon />}
            onClick={handleRunAsyncScheduler}
            disabled={schedulerLoading}
            sx={{ borderRadius: 2 }}
          >
            {schedulerLoading ? 'Scanning...' : 'Trigger Async Overdue Check'}
          </Button>
        </Stack>
      </Box>

      {/* Top 6 Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metricCards.map((card, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={idx}>
            <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      bgcolor: `${card.color}15`,
                      color: card.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                  {card.count}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts & Progress Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Task Status Pie Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Task Status Breakdown
              </Typography>
              <Button size="small" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/tasks')}>
                View Tasks
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <TaskStatusPieChart statusCounts={stats?.taskStatusCounts} />
          </Card>
        </Grid>

        {/* Project Completion Progress */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Project Completion Progress
              </Typography>
              <Button size="small" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/projects')}>
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <ProjectProgressBar projects={stats?.projectProgressSummaries || []} />
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity Section */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Recent System Activity & Task Updates
        </Typography>
        <Divider sx={{ mb: 2.5 }} />

        {stats?.recentActivities && stats.recentActivities.length > 0 ? (
          <Stack spacing={2}>
            {stats.recentActivities.map((act, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip label={act.type} size="small" color="primary" variant="outlined" />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {act.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {act.action}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {act.timestamp}
                </Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textStyle: 'italic' }}>
            No recent activity logged yet.
          </Typography>
        )}
      </Card>
    </Box>
  );
};
