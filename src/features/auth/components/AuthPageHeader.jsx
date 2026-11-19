import { Box, Typography } from '@mui/material';
import { Icon } from '../../../shared/components/Icon.jsx';
import { PageHeading } from '../../../shared/components/PageHeading.jsx';

export function AuthPageHeader({ title, heading, subtitle, eyebrow }) {
  return (
    <>
      <Typography
        sx={{
          display: { xs: 'none', md: 'block' },
          color: 'text.secondary',
          fontSize: 9,
          letterSpacing: 1.6,
          mb: 4,
        }}
      >
        {eyebrow}
      </Typography>
      <Box
        sx={{
          display: { xs: 'none', md: 'grid' },
          placeItems: 'center',
          bgcolor: 'brand.tile',
          color: 'primary.main',
          width: 47,
          height: 47,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Icon name="spark" width="25" height="25" />
      </Box>
      <PageHeading title={title}>{heading}</PageHeading>
      <Typography color="text.secondary" sx={{ fontSize: 13, mb: 4 }}>
        {subtitle}
      </Typography>
    </>
  );
}
