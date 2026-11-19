import { useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';

export function CreateEntityDialog({
  open,
  onClose,
  kind = 'organisation',
  organisations = [],
  defaultOrgId = '',
  fixedOrganisation = false,
  onCreate,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [orgId, setOrgId] = useState(defaultOrgId);
  const [error, setError] = useState('');
  const label = kind === 'organisation' ? 'organisation' : kind;

  function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim()) {
      setError(`Enter a name for your ${label}.`);
      return;
    }
    onCreate({
      name: name.trim(),
      description: description.trim(),
      ...(kind !== 'organisation' && {
        kind,
        orgId: orgId || null,
        studentIds: [],
      }),
    });
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pt: 3 }}>Create {label}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              autoFocus
              required
              label={`${label[0].toUpperCase()}${label.slice(1)} name`}
              value={name}
              onChange={(event) => setName(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
            {kind !== 'organisation' && (
              <TextField
                select
                disabled={fixedOrganisation}
                label="Organisation"
                value={orgId}
                onChange={(event) => setOrgId(event.target.value)}
                helperText={
                  fixedOrganisation
                    ? 'This belongs to the current organisation.'
                    : 'Choose an organisation or keep this independent.'
                }
              >
                <MenuItem value="">Standalone</MenuItem>
                {organisations.map((organisation) => (
                  <MenuItem key={organisation.id} value={organisation.id}>
                    {organisation.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <TextField
              label="Description"
              multiline
              minRows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 500 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create {label}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
