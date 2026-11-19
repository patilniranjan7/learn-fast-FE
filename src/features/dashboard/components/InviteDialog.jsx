import { useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';

export function InviteDialog({ open, onClose, cohort, data, onInvite }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const address = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setError('Enter a valid email address.');
      return;
    }
    const isMember = data.users.some(
      (user) => user.email.toLowerCase() === address && cohort.studentIds.includes(user.id),
    );
    const isPending = data.invitations.some(
      (invitation) =>
        invitation.cohortId === cohort.id &&
        invitation.cohortKind === cohort.kind &&
        invitation.email.toLowerCase() === address,
    );
    if (isMember || isPending) {
      setError(
        isMember
          ? 'This student already belongs to this group or class.'
          : 'An invitation already exists for this email address.',
      );
      return;
    }
    onInvite({
      cohortId: cohort.id,
      cohortKind: cohort.kind,
      email: address,
    });
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pt: 3 }}>Invite a student</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5}>
            <DialogContentText>
              Add a student to {cohort.name} using their email address. Invitations in this sample
              stay in this browser; no email is sent.
            </DialogContentText>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              autoFocus
              required
              type="email"
              label="Student email address"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create invitation
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
