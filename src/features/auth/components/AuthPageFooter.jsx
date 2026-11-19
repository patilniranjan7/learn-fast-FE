import { Box, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';

export function AuthPageFooter({ to, linkText, prefix, description }) {
  return (
    <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, textAlign: 'center' }}>
      {prefix && (
        <Typography component="span" variant="body2">
          {prefix}{' '}
        </Typography>
      )}
      <Link component={RouterLink} to={to} fontWeight={600} variant="body2">
        {linkText}
      </Link>
      <Typography color="text.secondary" sx={{ fontSize: 12, mt: 1 }}>
        {description}
      </Typography>
    </Box>
  );
}
