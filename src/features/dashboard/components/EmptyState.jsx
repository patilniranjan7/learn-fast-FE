import { Paper, Stack, Typography } from '@mui/material';
import { Icon } from '../../../shared/components/Icon.jsx';

export function EmptyState({ title, description, action }) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: { xs: 3, md: 6 }, textAlign: 'center', borderStyle: 'dashed' }}
    >
      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <Icon name="book" width={32} height={32} />
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        {description && (
          <Typography color="text.secondary" sx={{ maxWidth: 480 }}>
            {description}
          </Typography>
        )}
        {action}
      </Stack>
    </Paper>
  );
}
