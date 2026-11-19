import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

export function CreateTestDialog({ open, onClose, cohort, onCreate }) {
  const [values, setValues] = useState({
    title: '',
    subject: '',
    date: '',
    questionCount: '20',
    maxScore: '100',
    markingScheme: '',
  });
  const [paperName, setPaperName] = useState('');
  const [answerKeyName, setAnswerKeyName] = useState('');
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!values.title.trim() || !values.subject.trim()) {
      setError('Enter a test title and subject.');
      return;
    }
    if (!values.markingScheme.trim()) {
      setError('Describe how this test will be marked.');
      return;
    }
    onCreate({
      ...values,
      title: values.title.trim(),
      subject: values.subject.trim(),
      markingScheme: values.markingScheme.trim(),
      cohortId: cohort.id,
      cohortKind: cohort.kind,
      questionCount: Number(values.questionCount),
      maxScore: Number(values.maxScore),
      paperName,
      answerKeyName,
      status: 'Draft',
    });
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pt: 3 }}>Create a test</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              autoFocus
              required
              label="Test title"
              name="title"
              value={values.title}
              onChange={handleChange}
            />
            <TextField
              required
              label="Subject"
              name="subject"
              value={values.subject}
              onChange={handleChange}
            />
            <TextField
              required
              label="Test date"
              type="date"
              name="date"
              value={values.date}
              onChange={handleChange}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                required
                type="number"
                label="Number of questions"
                name="questionCount"
                value={values.questionCount}
                onChange={handleChange}
                slotProps={{ htmlInput: { min: 1, max: 500, step: 1 } }}
              />
              <TextField
                required
                type="number"
                label="Maximum marks"
                name="maxScore"
                value={values.maxScore}
                onChange={handleChange}
                slotProps={{ htmlInput: { min: 1, max: 10000, step: 1 } }}
              />
            </Stack>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Test materials
              </Typography>
              <Stack spacing={2}>
                <TextField
                  type="file"
                  label="Question paper"
                  onChange={(event) => setPaperName(event.target.files?.[0]?.name || '')}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { accept: '.pdf,.png,.jpg,.jpeg,.docx' },
                  }}
                />
                <TextField
                  type="file"
                  label="Answer key"
                  onChange={(event) => setAnswerKeyName(event.target.files?.[0]?.name || '')}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { accept: '.pdf,.png,.jpg,.jpeg,.docx' },
                  }}
                />
              </Stack>
            </Box>
            <TextField
              required
              multiline
              minRows={3}
              label="Marking scheme"
              placeholder="e.g. +4 for a correct answer, −1 for an incorrect answer"
              name="markingScheme"
              value={values.markingScheme}
              onChange={handleChange}
            />
            <Alert severity="info">
              This creates a sample draft. Only file names are saved in this browser; documents are
              not uploaded or evaluated.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create draft test
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
