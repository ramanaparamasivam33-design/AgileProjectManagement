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
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';

// Icons
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

import { storyService } from '../services/storyService';
import { projectService } from '../services/projectService';
import { useNotification } from '../contexts/NotificationContext';
import { StatusChip } from '../components/common/StatusChip';
import { PriorityChip } from '../components/common/PriorityChip';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { StoryFormDialog } from '../components/forms/StoryFormDialog';

export const StoriesPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Dialog States
  const [formOpen, setFormOpen] = useState(false);
  const [editStory, setEditStory] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { showNotification } = useNotification();

  const fetchProjects = async () => {
    try {
      const res = await projectService.getAll();
      if (res.success) {
        setProjects(res.data || []);
        if (res.data && res.data.length > 0 && !selectedProjectId) {
          setSelectedProjectId(res.data[0].id);
        }
      }
    } catch (err) {
      showNotification(err.message || 'Failed to fetch projects', 'error');
    }
  };

  const fetchStories = async () => {
    if (!selectedProjectId) return;
    try {
      setLoading(true);
      const res = await storyService.getByProject(selectedProjectId);
      if (res.success) {
        setStories(res.data || []);
      }
    } catch (err) {
      showNotification(err.message || 'Failed to load user stories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchStories();
  }, [selectedProjectId]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editStory) {
        const res = await storyService.update(editStory.id, formData);
        if (res.success) showNotification('User story updated!', 'success');
      } else {
        const res = await storyService.create(formData);
        if (res.success) showNotification('User story created!', 'success');
      }
      setFormOpen(false);
      setEditStory(null);
      fetchStories();
    } catch (err) {
      showNotification(err.message || 'Story save failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      const res = await storyService.delete(deleteId);
      if (res.success) {
        showNotification('User story deleted', 'success');
        setDeleteId(null);
        fetchStories();
      }
    } catch (err) {
      showNotification(err.message || 'Delete failed', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredStories = stories.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPoints = filteredStories.reduce((acc, s) => acc + (s.storyPoints || 0), 0);

  return (
    <Box className="animate-fade-in">
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            User Stories Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage agile user stories, backlog items, story points, and task distributions.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => {
            setEditStory(null);
            setFormOpen(true);
          }}
          disabled={projects.length === 0}
          sx={{ borderRadius: 2 }}
        >
          New User Story
        </Button>
      </Box>

      {/* Filter and Search Bar */}
      <Card sx={{ p: 2.5, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              label="Select Project"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              fullWidth
              size="small"
            >
              {projects.map((proj) => (
                <MenuItem key={proj.id} value={proj.id}>
                  {proj.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              placeholder="Search stories by title..."
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
        </Grid>
      </Card>

      {/* Total Story Points Metric Badge */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          User Stories ({filteredStories.length})
        </Typography>
        <Chip
          label={`Total Story Points: ${totalPoints}`}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 800, px: 1 }}
        />
      </Box>

      {/* Stories Table */}
      {loading ? (
        <LoadingSpinner message="Fetching user stories..." />
      ) : filteredStories.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No user stories found for this project.
          </Typography>
          <Button variant="outlined" onClick={() => setFormOpen(true)}>
            Create User Story
          </Button>
        </Card>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Story Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Story Points</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Task Completion</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStories.map((story) => (
                <TableRow key={story.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {story.title}
                    </Typography>
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
                      {story.description || 'No description'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <PriorityChip priority={story.priority} />
                  </TableCell>
                  <TableCell>
                    <StatusChip status={story.status} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{story.storyPoints} pts</TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {story.completedTasks} / {story.totalTasks} Tasks
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditStory(story);
                          setFormOpen(true);
                        }}
                      >
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(story.id)}
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

      {/* Story Form Modal */}
      <StoryFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditStory(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialValues={editStory}
        projects={projects}
        defaultProjectId={selectedProjectId}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        title="Delete User Story"
        message="Deleting this user story will also delete all tasks associated with it."
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </Box>
  );
};
