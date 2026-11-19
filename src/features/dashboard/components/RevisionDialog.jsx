import { useState } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { localDate, validateRevision } from '../utils/revisionDates.js';

export function RevisionDialog({ revision, onClose, onSubmit }) {
  const [values, setValues] = useState({
    title: revision?.title || '',
    description: revision?.description || '',
    date: revision?.date || localDate(),
    completed: revision?.completed || false,
  });
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(revision?.id);

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateRevision(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit({ ...values, title: values.title.trim(), description: values.description.trim() });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="revision-dialog-title">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle id="revision-dialog-title">
          {isEditing ? 'Edit revision' : 'Plan a revision'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Typography color="text.secondary" variant="body2">
              A little practice today builds a stronger understanding tomorrow.
            </Typography>
            <TextField
              autoFocus
              required
              label="Revision title"
              name="title"
              value={values.title}
              onChange={handleChange}
              error={Boolean(errors.title)}
              helperText={errors.title}
              fullWidth
              slotProps={{ htmlInput: { maxLength: 120 } }}
            />
            <TextField
              required
              label="Revision date"
              name="date"
              type="date"
              value={values.date}
              onChange={handleChange}
              error={Boolean(errors.date)}
              helperText={errors.date || 'You can reschedule this whenever you need.'}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="What will you work on?"
              name="description"
              value={values.description}
              onChange={handleChange}
              multiline
              minRows={3}
              fullWidth
              slotProps={{ htmlInput: { maxLength: 1000 } }}
            />
            {isEditing && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.completed}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, completed: event.target.checked }))
                    }
                  />
                }
                label="I've completed this revision"
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button type="button" color="inherit" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {isEditing ? 'Save changes' : 'Create revision'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
