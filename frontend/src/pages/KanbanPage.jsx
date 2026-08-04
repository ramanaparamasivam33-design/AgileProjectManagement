import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// Icons
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';

import { taskService } from '../services/taskService';
import { storyService } from '../services/storyService';
import { projectService } from '../services/projectService';
import { useNotification } from '../contexts/NotificationContext';
import { PriorityChip } from '../components/common/PriorityChip';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { TaskFormDialog } from '../components/forms/TaskFormDialog';

export const KanbanPage = () => {
  const [tasks, setTasks] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [formOpen, setFormOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('TODO');

  const { showNotification } = useNotification();

  const fetchKanbanData = async () => {
    try {
      setLoading(true);
      const [taskRes, projRes] = await Promise.all([
        taskService.getAll(),
        projectService.getAll(),
      ]);

      if (taskRes.success) setTasks(taskRes.data || []);

      if (projRes.success && projRes.data) {
        const allStoriesPromises = projRes.data.map((p) => storyService.getByProject(p.id));
        const storyResults = await Promise.all(allStoriesPromises);
        setStories(storyResults.flatMap((r) => r.data || []));
      }
    } catch (err) {
      showNotification(err.message || 'Failed to load Kanban board', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKanbanData();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await taskService.updateStatus(taskId, newStatus);
      if (res.success) {
        showNotification(`Task moved to ${newStatus.replace('_', ' ')}`, 'success');
        fetchKanbanData();
      }
    } catch (err) {
      showNotification(err.message || 'Status transition failed', 'error');
    }
  };

  const handleCreateTask = async (formData) => {
    try {
      const res = await taskService.create({ ...formData, status: defaultStatus });
      if (res.success) {
        showNotification('Task created on Kanban board!', 'success');
        setFormOpen(false);
        fetchKanbanData();
      }
    } catch (err) {
      showNotification(err.message || 'Task creation failed', 'error');
    }
  };

  const columns = [
    { key: 'TODO', title: 'To Do', color: '#3b82f6', next: 'IN_PROGRESS', prev: null },
    { key: 'IN_PROGRESS', title: 'In Progress', color: '#6366f1', next: 'DONE', prev: 'TODO' },
    { key: 'DONE', title: 'Done', color: '#10b981', next: null, prev: 'IN_PROGRESS' },
    { key: 'OVERDUE', title: 'Overdue', color: '#ef4444', next: 'IN_PROGRESS', prev: 'TODO' },
  ];

  if (loading) return <LoadingSpinner message="Rendering Kanban workflow board..." />;

  return (
    <Box className="animate-fade-in">
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Agile Kanban Board
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visual task pipeline for 3–10 team members. Move work items across columns effortlessly.
          </Typography>
        </Box>
      </Box>

      {/* Kanban Board Columns */}
      <Grid container spacing={3}>
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={col.key}>
              <Card
                className="kanban-col"
                sx={{
                  bgcolor: 'action.hover',
                  p: 2,
                  minHeight: 650,
                  display: 'flex',
                  flexDirection: 'column',
                  borderTop: `4px solid ${col.color}`,
                }}
              >
                {/* Column Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      {col.title}
                    </Typography>
                    <Chip
                      label={colTasks.length}
                      size="small"
                      sx={{
                        bgcolor: `${col.color}20`,
                        color: col.color,
                        fontWeight: 800,
                        height: 22,
                      }}
                    />
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setDefaultStatus(col.key);
                      setFormOpen(true);
                    }}
                  >
                    <AddRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Column Cards Container */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, overflowY: 'auto' }}>
                  {colTasks.length === 0 ? (
                    <Box
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        opacity: 0.6,
                      }}
                    >
                      <Typography variant="caption">No tasks in {col.title}</Typography>
                    </Box>
                  ) : (
                    colTasks.map((task) => (
                      <Card key={task.id} className="kanban-card" sx={{ p: 2, bgcolor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <PriorityChip priority={task.priority} size="small" />
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            {task.storyTitle || `#${task.storyId}`}
                          </Typography>
                        </Box>

                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
                          {task.title}
                        </Typography>

                        {task.description && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              mb: 2,
                            }}
                          >
                            {task.description}
                          </Typography>
                        )}

                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccountCircleRoundedIcon fontSize="small" color="action" />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              {task.assignee || 'Unassigned'}
                            </Typography>
                          </Box>

                          {task.dueDate && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <EventRoundedIcon fontSize="small" color={col.key === 'OVERDUE' ? 'error' : 'action'} />
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: col.key === 'OVERDUE' ? 800 : 500,
                                  color: col.key === 'OVERDUE' ? 'error.main' : 'text.secondary',
                                }}
                              >
                                {task.dueDate}
                              </Typography>
                            </Box>
                          )}
                        </Stack>

                        {/* Move Actions */}
                        <Box
                          sx={{
                            display: 'flex',
                            justify: 'space-between',
                            alignItems: 'center',
                            pt: 1,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          {col.prev ? (
                            <Tooltip title={`Move to ${col.prev.replace('_', ' ')}`}>
                              <IconButton
                                size="small"
                                onClick={() => handleStatusChange(task.id, col.prev)}
                              >
                                <ArrowBackIosNewRoundedIcon fontSize="inherit" />
                              </IconButton>
                            </Tooltip>
                          ) : <Box />}

                          {col.next ? (
                            <Tooltip title={`Move to ${col.next.replace('_', ' ')}`}>
                              <IconButton
                                size="small"
                                onClick={() => handleStatusChange(task.id, col.next)}
                              >
                                <ArrowForwardIosRoundedIcon fontSize="inherit" />
                              </IconButton>
                            </Tooltip>
                          ) : <Box />}
                        </Box>
                      </Card>
                    ))
                  )}
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Task Form Modal */}
      <TaskFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreateTask}
        stories={stories}
      />
    </Box>
  );
};
