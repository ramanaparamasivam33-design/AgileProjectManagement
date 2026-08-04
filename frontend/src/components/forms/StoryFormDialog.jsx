import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export const StoryFormDialog = ({ open, onClose, onSubmit, initialValues, projects = [], defaultProjectId = null }) => {
  const [formData, setFormData] = useState({
    projectId: defaultProjectId || '',
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    storyPoints: 3,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData({
        projectId: initialValues.projectId || defaultProjectId || '',
        title: initialValues.title || '',
        description: initialValues.description || '',
        priority: initialValues.priority || 'MEDIUM',
        status: initialValues.status || 'TODO',
        storyPoints: initialValues.storyPoints ?? 3,
      });
    } else {
      setFormData({
        projectId: defaultProjectId || (projects[0]?.id || ''),
        title: '',
        description: '',
        priority: 'MEDIUM',
        status: 'TODO',
        storyPoints: 3,
      });
    }
    setErrors({});
  }, [initialValues, defaultProjectId, projects, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.projectId) newErrors.projectId = 'Project selection is required';
    if (!formData.title.trim()) newErrors.title = 'Story title is required';
    if (formData.storyPoints < 1) newErrors.storyPoints = 'Points must be at least 1';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        projectId: Number(formData.projectId),
        storyPoints: Number(formData.storyPoints),
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {initialValues ? 'Edit User Story' : 'Create User Story'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {!defaultProjectId && (
            <TextField
              select
              name="projectId"
              label="Select Project *"
              value={formData.projectId}
              onChange={handleChange}
              error={!!errors.projectId}
              helperText={errors.projectId}
              fullWidth
            >
              {projects.map((proj) => (
                <MenuItem key={proj.id} value={proj.id}>
                  {proj.name}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            name="title"
            label="Story Title *"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            autoFocus
          />

          <TextField
            name="description"
            label="User Story Description (As a... I want to... So that...)"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
            <TextField
              select
              name="priority"
              label="Priority"
              value={formData.priority}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </TextField>

            <TextField
              select
              name="status"
              label="Status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="TODO">To Do</MenuItem>
              <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
              <MenuItem value="DONE">Done</MenuItem>
            </TextField>

            <TextField
              type="number"
              name="storyPoints"
              label="Story Points *"
              value={formData.storyPoints}
              onChange={handleChange}
              error={!!errors.storyPoints}
              helperText={errors.storyPoints}
              inputProps={{ min: 1, max: 100 }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {initialValues ? 'Update Story' : 'Create Story'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
