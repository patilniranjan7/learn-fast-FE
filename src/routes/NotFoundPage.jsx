import { Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { PageHeading } from '../shared/components/PageHeading.jsx';
import { paths } from './paths.js';

export function NotFoundPage() {
  return (
    <Box component="main" sx={{ minHeight: '100svh', display: 'grid', placeItems: 'center', p: 3 }}>
      <Stack spacing={3} alignItems="center" textAlign="center">
        <Typography color="text.secondary">404</Typography>
        <PageHeading title="Page not found">Page not found.</PageHeading>
        <Typography color="text.secondary">
          This page may have moved. Return to your learning space.
        </Typography>
        <Button component={RouterLink} to={paths.login} variant="contained">
          Back to sign in
        </Button>
      </Stack>
    </Box>
  );
}
