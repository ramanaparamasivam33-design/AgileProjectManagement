import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export const TaskFormDialog = ({ open, onClose, onSubmit, initialValues, stories = [], defaultStoryId = null }) => {
  const [formData, setFormData] = useState({
    storyId: defaultStoryId || '',
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    assignee: '',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData({
        storyId: initialValues.storyId || defaultStoryId || '',
        title: initialValues.title || '',
        description: initialValues.description || '',
        status: initialValues.status || 'TODO',
        priority: initialValues.priority || 'MEDIUM',
        assignee: initialValues.assignee || '',
        dueDate: initialValues.dueDate || '',
      });
    } else {
      setFormData({
        storyId: defaultStoryId || (stories[0]?.id || ''),
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        assignee: '',
        dueDate: '',
      });
    }
    setErrors({});
  }, [initialValues, defaultStoryId, stories, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.storyId) newErrors.storyId = 'User story is required';
    if (!formData.title.trim()) newErrors.title = 'Task title is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        storyId: Number(formData.storyId),
        dueDate: formData.dueDate || null,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {initialValues ? 'Edit Task' : 'Create Task'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {!defaultStoryId && (
            <TextField
              select
              name="storyId"
              label="Select Parent User Story *"
              value={formData.storyId}
              onChange={handleChange}
              error={!!errors.storyId}
              helperText={errors.storyId}
              fullWidth
            >
              {stories.map((story) => (
                <MenuItem key={story.id} value={story.id}>
                  {story.title}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            name="title"
            label="Task Title *"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            autoFocus
          />

          <TextField
            name="description"
            label="Task Description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
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
              <MenuItem value="OVERDUE">Overdue</MenuItem>
            </TextField>

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
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              name="assignee"
              label="Assignee Name"
              value={formData.assignee}
              onChange={handleChange}
              placeholder="e.g. Alex Rivera"
              fullWidth
            />

            <TextField
              type="date"
              name="dueDate"
              label="Due Date"
              value={formData.dueDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {initialValues ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
