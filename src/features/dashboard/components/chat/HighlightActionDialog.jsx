import { useId, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { SelectedQuote } from './SelectedQuote.jsx';

export function HighlightActionDialog({ action, highlight, onClose, onSubmit }) {
  const isQuestion = action === 'ask';
  const [value, setValue] = useState(isQuestion ? '' : highlight.note || '');
  const titleId = useId();

  function handleSubmit(event) {
    event.preventDefault();
    const content = value.trim();
    if (isQuestion && !content) return;
    onSubmit(content);
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" aria-labelledby={titleId}>
      <form onSubmit={handleSubmit}>
        <DialogTitle id={titleId}>{isQuestion ? 'Ask more' : 'Your note'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 0.5 }}>
            <SelectedQuote text={highlight.text} />
            <Typography variant="body2" color="text.secondary">
              {isQuestion
                ? 'Your question and a sample response will appear in the main chat, linked to this passage.'
                : 'Save a personal note with this passage. Saving a note does not ask the assistant for a response.'}
            </Typography>
            <TextField
              autoFocus
              required={isQuestion}
              label={isQuestion ? 'Question' : 'Your note'}
              name={isQuestion ? 'question' : 'note'}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              multiline
              minRows={4}
              maxRows={10}
              fullWidth
              helperText={
                !isQuestion && highlight.note
                  ? 'Clear the text and save to remove this note. The highlight stays saved.'
                  : undefined
              }
              slotProps={{ htmlInput: { maxLength: 4000 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button type="button" color="inherit" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isQuestion && !value.trim()}>
            {isQuestion ? 'Send' : 'Save note'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
