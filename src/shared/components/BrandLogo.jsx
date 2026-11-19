import { Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { appConfig } from '../config/appConfig.js';
import { Icon } from './Icon.jsx';

export function BrandLogo({ to }) {
  return (
    <Link
      component={RouterLink}
      to={to}
      aria-label={`${appConfig.companyName} home`}
      underline="none"
      color="inherit"
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: 'fit-content',
        fontFamily: 'h2.fontFamily',
        fontWeight: 750,
        fontSize: { xs: 22, md: 25 },
        letterSpacing: -1,
      }}
    >
      <Box
        component="span"
        sx={{
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'brand.accent',
          color: 'brand.dark',
          width: 38,
          height: 38,
          borderRadius: 1.5,
          mr: 1.5,
        }}
      >
        <Icon name="book" />
      </Box>
      {appConfig.companyName}
      <Box component="span" sx={{ color: 'brand.highlight' }}>
        .
      </Box>
    </Link>
  );
}
