import { useId, useState } from 'react';
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { localDate } from '../../utils/revisionDates.js';
import { SelectedQuote } from './SelectedQuote.jsx';

function currentTimeInZone(timeZone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const fields = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return {
    date: `${fields.year}-${fields.month}-${fields.day}`,
    time: `${fields.hour}:${fields.minute}`,
  };
}

function validatePlan(values, timeZone) {
  const errors = {};
  const parsed = new Date(`${values.date}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(values.date) ||
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== values.date
  ) {
    errors.date = 'Choose a valid learning date.';
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(values.time)) {
    errors.time = 'Choose a valid learning time.';
  }
  if (Object.keys(errors).length) return errors;
  const now = currentTimeInZone(timeZone);
  if (values.date < now.date) errors.date = 'Choose a date in the future.';
  if (values.date === now.date && values.time <= now.time) {
    errors.time = 'Choose a time in the future.';
  }
  return errors;
}

export function LearnLaterDialog({ highlight, onClose, onSave }) {
  const titleId = useId();
  const timeZone = highlight.reminder?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [values, setValues] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
      date: highlight.reminder?.date || localDate(tomorrow),
      time: highlight.reminder?.time || '09:00',
    };
  });
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validatePlan(values, timeZone);
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) onSave({ ...values, timeZone });
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" aria-labelledby={titleId}>
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle id={titleId}>Learn later</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 0.5 }}>
            <SelectedQuote text={highlight.text} />
            <Alert severity="info">
              This saves the passage to your Revision Plan only. WhatsApp and Google Calendar are
              not connected, so no message or calendar event will be created.
            </Alert>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Chip label="WhatsApp · Not connected" variant="outlined" size="small" />
              <Chip label="Google Calendar · Not connected" variant="outlined" size="small" />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                autoFocus
                required
                fullWidth
                label="Learning date"
                name="date"
                type="date"
                value={values.date}
                onChange={handleChange}
                error={Boolean(errors.date)}
                helperText={errors.date}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                required
                fullWidth
                label="Learning time"
                name="time"
                type="time"
                value={values.time}
                onChange={handleChange}
                error={Boolean(errors.time)}
                helperText={errors.time}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Time zone: {timeZone}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button type="button" color="inherit" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save learning plan
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
