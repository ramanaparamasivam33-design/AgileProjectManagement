import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

import { projectService } from '../services/projectService';
import { storyService } from '../services/storyService';
import { taskService } from '../services/taskService';
import { useNotification } from '../contexts/NotificationContext';
import { StatusChip } from '../components/common/StatusChip';
import { PriorityChip } from '../components/common/PriorityChip';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { StoryFormDialog } from '../components/forms/StoryFormDialog';
import { TaskFormDialog } from '../components/forms/TaskFormDialog';
import { ProjectFormDialog } from '../components/forms/ProjectFormDialog';

export const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Accordion expansion state
  const [expandedStory, setExpandedStory] = useState(false);

  // Dialog states
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [storyFormOpen, setStoryFormOpen] = useState(false);
  const [editStory, setEditStory] = useState(null);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [targetStoryId, setTargetStoryId] = useState(null);

  // Delete states
  const [deleteTarget, setDeleteTarget] = useState({ type: null, id: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const res = await projectService.getById(id);
      if (res.success) {
        setProject(res.data);
      }
    } catch (err) {
      showNotification(err.message || 'Failed to load project details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleAccordionToggle = (storyId) => (event, isExpanded) => {
    setExpandedStory(isExpanded ? storyId : false);
  };

  const handleUpdateProject = async (formData) => {
    try {
      const res = await projectService.update(project.id, formData);
      if (res.success) {
        showNotification('Project details updated', 'success');
        setProjectFormOpen(false);
        fetchProjectDetails();
      }
    } catch (err) {
      showNotification(err.message || 'Update failed', 'error');
    }
  };

  const handleCreateOrUpdateStory = async (formData) => {
    try {
      if (editStory) {
        const res = await storyService.update(editStory.id, formData);
        if (res.success) showNotification('User story updated!', 'success');
      } else {
        const res = await storyService.create(formData);
        if (res.success) showNotification('User story created!', 'success');
      }
      setStoryFormOpen(false);
      setEditStory(null);
      fetchProjectDetails();
    } catch (err) {
      showNotification(err.message || 'Story save failed', 'error');
    }
  };

  const handleCreateOrUpdateTask = async (formData) => {
    try {
      if (editTask) {
        const res = await taskService.update(editTask.id, formData);
        if (res.success) showNotification('Task updated!', 'success');
      } else {
        const res = await taskService.create(formData);
        if (res.success) showNotification('Task created!', 'success');
      }
      setTaskFormOpen(false);
      setEditTask(null);
      setTargetStoryId(null);
      fetchProjectDetails();
    } catch (err) {
      showNotification(err.message || 'Task save failed', 'error');
    }
  };

  const handleQuickTaskStatusChange = async (taskId, newStatus) => {
    try {
      const res = await taskService.updateStatus(taskId, newStatus);
      if (res.success) {
        showNotification(`Task status changed to ${newStatus}`, 'info');
        fetchProjectDetails();
      }
    } catch (err) {
      showNotification(err.message || 'Status update failed', 'error');
    }
  };

  const handleDeleteExecute = async () => {
    const { type, id: targetId } = deleteTarget;
    if (!type || !targetId) return;

    try {
      setDeleteLoading(true);
      if (type === 'STORY') {
        const res = await storyService.delete(targetId);
        if (res.success) showNotification('User story and tasks deleted', 'success');
      } else if (type === 'TASK') {
        const res = await taskService.delete(targetId);
        if (res.success) showNotification('Task deleted', 'success');
      }
      setDeleteTarget({ type: null, id: null });
      fetchProjectDetails();
    } catch (err) {
      showNotification(err.message || 'Delete operation failed', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading hierarchical project view..." />;
  if (!project) return <Typography>Project not found</Typography>;

  return (
    <Box className="animate-fade-in">
      {/* Navigation Header */}
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
      </Box>

      {/* Project Banner Card */}
      <Card sx={{ p: 4, mb: 4, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          <Box sx={{ maxWidth: '75%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {project.name}
              </Typography>
              <StatusChip status={project.status} />
            </Box>
            <Typography variant="body1" color="text.secondary">
              {project.description || 'No description available.'}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<EditRoundedIcon />}
              onClick={() => setProjectFormOpen(true)}
            >
              Edit Project
            </Button>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => {
                setEditStory(null);
                setStoryFormOpen(true);
              }}
            >
              Add User Story
            </Button>
          </Stack>
        </Box>

        {/* Progress Bar & Key Indicators */}
        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Overall Completion Rate
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
              {project.completedTasks} / {project.totalTasks} Tasks Completed ({project.completionPercentage}%)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={project.completionPercentage}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
      </Card>

      {/* Expandable Hierarchy Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Hierarchical Work Breakdown (Stories & Tasks)
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            {project.userStories?.length || 0} User Stories Total
          </Typography>
        </Box>

        {project.userStories && project.userStories.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {project.userStories.map((story) => {
              const isExpanded = expandedStory === story.id;
              return (
                <Accordion
                  key={story.id}
                  expanded={isExpanded}
                  onChange={handleAccordionToggle(story.id)}
                  sx={{
                    borderRadius: '12px !important',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:before': { display: 'none' },
                    boxShadow: isExpanded ? '0 6px 20px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 3, py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mr: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AutoStoriesRoundedIcon color="primary" />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {story.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Points: {story.storyPoints} | Tasks: {story.completedTasks}/{story.totalTasks} Done
                          </Typography>
                        </Box>
                      </Box>

                      <Stack direction="row" spacing={1.5} alignItems="center" onClick={(e) => e.stopPropagation()}>
                        <PriorityChip priority={story.priority} />
                        <StatusChip status={story.status} />

                        <Tooltip title="Edit Story">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditStory(story);
                              setStoryFormOpen(true);
                            }}
                          >
                            <EditRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Story">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteTarget({ type: 'STORY', id: story.id })}
                          >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails sx={{ px: 3, pb: 3, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                    {story.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, fontStyle: 'italic' }}>
                        {story.description}
                      </Typography>
                    )}

                    {/* Header bar inside story details */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Tasks under this Story ({story.tasks?.length || 0})
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddRoundedIcon />}
                        onClick={() => {
                          setEditTask(null);
                          setTargetStoryId(story.id);
                          setTaskFormOpen(true);
                        }}
                      >
                        Add Task
                      </Button>
                    </Box>

                    {/* Task Table */}
                    {story.tasks && story.tasks.length > 0 ? (
                      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                        <Table size="small">
                          <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 700 }}>Task Title</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Assignee</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {story.tasks.map((task) => (
                              <TableRow key={task.id} hover>
                                <TableCell sx={{ fontWeight: 600 }}>{task.title}</TableCell>
                                <TableCell>
                                  <Select
                                    size="small"
                                    value={task.status}
                                    onChange={(e) => handleQuickTaskStatusChange(task.id, e.target.value)}
                                    sx={{ height: 28, fontSize: '0.75rem', fontWeight: 700 }}
                                  >
                                    <MenuItem value="TODO">To Do</MenuItem>
                                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                                    <MenuItem value="DONE">Done</MenuItem>
                                    <MenuItem value="OVERDUE">Overdue</MenuItem>
                                  </Select>
                                </TableCell>
                                <TableCell>
                                  <PriorityChip priority={task.priority} size="small" />
                                </TableCell>
                                <TableCell>{task.assignee || 'Unassigned'}</TableCell>
                                <TableCell>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontWeight: task.status === 'OVERDUE' ? 800 : 500,
                                      color: task.status === 'OVERDUE' ? 'error.main' : 'text.primary',
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
                                        setTargetStoryId(story.id);
                                        setTaskFormOpen(true);
                                      }}
                                    >
                                      <EditRoundedIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => setDeleteTarget({ type: 'TASK', id: task.id })}
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
                    ) : (
                      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          No tasks under this story yet. Click 'Add Task' to create one.
                        </Typography>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        ) : (
          <Card sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No user stories in this project yet.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => {
                setEditStory(null);
                setStoryFormOpen(true);
              }}
            >
              Create First User Story
            </Button>
          </Card>
        )}
      </Box>

      {/* Edit Project Dialog */}
      <ProjectFormDialog
        open={projectFormOpen}
        onClose={() => setProjectFormOpen(false)}
        onSubmit={handleUpdateProject}
        initialValues={project}
      />

      {/* Story Form Dialog */}
      <StoryFormDialog
        open={storyFormOpen}
        onClose={() => {
          setStoryFormOpen(false);
          setEditStory(null);
        }}
        onSubmit={handleCreateOrUpdateStory}
        initialValues={editStory}
        defaultProjectId={project.id}
      />

      {/* Task Form Dialog */}
      <TaskFormDialog
        open={taskFormOpen}
        onClose={() => {
          setTaskFormOpen(false);
          setEditTask(null);
          setTargetStoryId(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
        initialValues={editTask}
        stories={project.userStories || []}
        defaultStoryId={targetStoryId}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget.id}
        title={`Delete ${deleteTarget.type === 'STORY' ? 'User Story' : 'Task'}`}
        message={
          deleteTarget.type === 'STORY'
            ? 'Deleting this User Story will also delete all tasks associated with it.'
            : 'Are you sure you want to delete this task?'
        }
        onConfirm={handleDeleteExecute}
        onClose={() => setDeleteTarget({ type: null, id: null })}
        loading={deleteLoading}
      />
    </Box>
  );
};
