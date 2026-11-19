import { Chip } from '@mui/material';

const colors = {
  Evaluated: 'success',
  Published: 'success',
  Completed: 'success',
  Processing: 'warning',
  Pending: 'warning',
  Draft: 'default',
  Upcoming: 'info',
};

export function StatusChip({ status }) {
  return (
    <Chip
      size="small"
      label={status}
      color={colors[status] || 'default'}
      variant="outlined"
      sx={{ fontSize: 11, fontWeight: 600 }}
    />
  );
}
