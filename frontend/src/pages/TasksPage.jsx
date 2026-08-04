import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid2';

// Icons
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

import { taskService } from '../services/taskService';
import { storyService } from '../services/storyService';
import { projectService } from '../services/projectService';
import { useNotification } from '../contexts/NotificationContext';
import { PriorityChip } from '../components/common/PriorityChip';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { TaskFormDialog } from '../components/forms/TaskFormDialog';

export const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Dialog States
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { showNotification } = useNotification();

  const fetchTasksAndStories = async () => {
    try {
      setLoading(true);
      const [taskRes, projRes] = await Promise.all([
        taskService.getAll(statusFilter),
        projectService.getAll(),
      ]);

      if (taskRes.success) setTasks(taskRes.data || []);

      // Fetch all stories for form selector
      if (projRes.success && projRes.data) {
        const allStoriesPromises = projRes.data.map((p) => storyService.getByProject(p.id));
        const storyResults = await Promise.all(allStoriesPromises);
        const aggregatedStories = storyResults.flatMap((r) => r.data || []);
        setStories(aggregatedStories);
      }
    } catch (err) {
      showNotification(err.message || 'Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksAndStories();
  }, [statusFilter]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editTask) {
        const res = await taskService.update(editTask.id, formData);
        if (res.success) showNotification('Task updated!', 'success');
      } else {
        const res = await taskService.create(formData);
        if (res.success) showNotification('Task created!', 'success');
      }
      setFormOpen(false);
      setEditTask(null);
      fetchTasksAndStories();
    } catch (err) {
      showNotification(err.message || 'Task save failed', 'error');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await taskService.updateStatus(taskId, newStatus);
      if (res.success) {
        showNotification(`Task status updated to ${newStatus}`, 'info');
        fetchTasksAndStories();
      }
    } catch (err) {
      showNotification(err.message || 'Status update failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      const res = await taskService.delete(deleteId);
      if (res.success) {
        showNotification('Task deleted', 'success');
        setDeleteId(null);
        fetchTasksAndStories();
      }
    } catch (err) {
      showNotification(err.message || 'Delete failed', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.assignee && t.assignee.toLowerCase().includes(search.toLowerCase())) ||
      (t.storyTitle && t.storyTitle.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Box className="animate-fade-in">
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            All Tasks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage task execution, assignees, priorities, due dates, and status transitions.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => {
            setEditTask(null);
            setFormOpen(true);
          }}
          disabled={stories.length === 0}
          sx={{ borderRadius: 2 }}
        >
          New Task
        </Button>
      </Box>

      {/* Filters Bar */}
      <Card sx={{ p: 2.5, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              placeholder="Search by title, assignee, or story name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label="Filter Task Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="TODO">To Do</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="DONE">Done</MenuItem>
              <MenuItem value="OVERDUE">Overdue</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Task Table */}
      {loading ? (
        <LoadingSpinner message="Loading task catalog..." />
      ) : filteredTasks.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No tasks found matching your criteria.
          </Typography>
          <Button variant="outlined" onClick={() => setStatusFilter('')}>
            Reset Filter
          </Button>
        </Card>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Task Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Parent User Story</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Assignee</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {task.title}
                    </Typography>
                    {task.description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {task.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {task.storyTitle || `Story #${task.storyId}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      sx={{ height: 32, fontSize: '0.8rem', fontWeight: 700 }}
                    >
                      <MenuItem value="TODO">To Do</MenuItem>
                      <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                      <MenuItem value="DONE">Done</MenuItem>
                      <MenuItem value="OVERDUE">Overdue</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <PriorityChip priority={task.priority} />
                  </TableCell>
                  <TableCell>{task.assignee || 'Unassigned'}</TableCell>
                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: task.status === 'OVERDUE' ? 800 : 600,
                        color: task.status === 'OVERDUE' ? 'error.main' : 'text.secondary',
                      }}
                    >
                      {task.dueDate || 'No Date'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditTask(task);
                          setFormOpen(true);
                        }}
                      >
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(task.id)}
                      >
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Task Form Dialog */}
      <TaskFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditTask(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialValues={editTask}
        stories={stories}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task?"
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </Box>
  );
};
