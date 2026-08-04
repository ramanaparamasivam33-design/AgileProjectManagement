import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';

// Icons
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

import { projectService } from '../services/projectService';
import { useNotification } from '../contexts/NotificationContext';
import { StatusChip } from '../components/common/StatusChip';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ProjectFormDialog } from '../components/forms/ProjectFormDialog';

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modal States
  const [formOpen, setFormOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectService.getAll(search, statusFilter);
      if (res.success) {
        setProjects(res.data || []);
      }
    } catch (err) {
      showNotification(err.message || 'Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editProject) {
        const res = await projectService.update(editProject.id, formData);
        if (res.success) showNotification('Project updated successfully!', 'success');
      } else {
        const res = await projectService.create(formData);
        if (res.success) showNotification('Project created successfully!', 'success');
      }
      setFormOpen(false);
      setEditProject(null);
      fetchProjects();
    } catch (err) {
      showNotification(err.message || 'Save failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      const res = await projectService.delete(deleteId);
      if (res.success) {
        showNotification('Project and associated stories deleted', 'success');
        setDeleteId(null);
        fetchProjects();
      }
    } catch (err) {
      showNotification(err.message || 'Delete failed', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'completion') return b.completionPercentage - a.completionPercentage;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); // newest first
  });

  return (
    <Box className="animate-fade-in">
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Agile Projects
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage software projects, track status, and drill down into User Stories and Tasks.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => {
            setEditProject(null);
            setFormOpen(true);
          }}
          sx={{ borderRadius: 2 }}
        >
          New Project
        </Button>
      </Box>

      {/* Filter and Search Bar */}
      <Card sx={{ p: 2.5, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 5 }}>
            <TextField
              placeholder="Search projects by name..."
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

          <Grid size={{ xs: 6, sm: 3, md: 3.5 }}>
            <TextField
              select
              label="Filter Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="PLANNED">Planned</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="ON_HOLD">On Hold</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 6, sm: 3, md: 3.5 }}>
            <TextField
              select
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="name">Project Name (A-Z)</MenuItem>
              <MenuItem value="completion">Completion %</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Card>

      {/* Projects Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching projects list..." />
      ) : sortedProjects.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No projects found matching your criteria.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setSearch('');
              setStatusFilter('');
            }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {sortedProjects.map((proj) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={proj.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <StatusChip status={proj.status} />
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Edit Project">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditProject(proj);
                            setFormOpen(true);
                          }}
                        >
                          <EditRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Project">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteId(proj.id)}
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      cursor: 'pointer',
                      '&:hover': { color: 'primary.main' },
                    }}
                    onClick={() => navigate(`/projects/${proj.id}`)}
                  >
                    {proj.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: 40,
                    }}
                  >
                    {proj.description || 'No description provided.'}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                        Progress
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        {proj.completionPercentage}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={proj.completionPercentage}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>

                  <Stack direction="row" spacing={3} sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <AutoStoriesRoundedIcon fontSize="small" color="action" />
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        {proj.totalStories} Stories
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <CheckCircleOutlineRoundedIcon fontSize="small" color="action" />
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        {proj.completedTasks}/{proj.totalTasks} Tasks
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    variant="contained"
                    endIcon={<VisibilityRoundedIcon />}
                    onClick={() => navigate(`/projects/${proj.id}`)}
                    fullWidth
                    sx={{ borderRadius: 2 }}
                  >
                    View Project Hierarchy
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Project Form Modal */}
      <ProjectFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditProject(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialValues={editProject}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Project Hierarchy"
        message="Deleting this project will permanently erase all user stories and tasks associated with it. This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </Box>
  );
};
