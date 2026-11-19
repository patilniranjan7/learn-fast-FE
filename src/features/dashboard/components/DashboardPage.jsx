import { Box, Stack, Typography } from '@mui/material';
import { PageHeading } from '../../../shared/components/PageHeading.jsx';

export function DashboardPage({ title, description, eyebrow, action, children }) {
  return (
    <Stack spacing={4}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
      >
        <Box>
          {eyebrow && (
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
              {eyebrow}
            </Typography>
          )}
          <PageHeading title={title}>{title}</PageHeading>
          {description && (
            <Typography color="text.secondary" sx={{ maxWidth: 680, lineHeight: 1.7 }}>
              {description}
            </Typography>
          )}
        </Box>
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Stack>
      {children}
    </Stack>
  );
}
