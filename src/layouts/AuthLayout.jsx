import { Box, Typography } from '@mui/material';
import { Outlet } from 'react-router';
import { appConfig } from '../shared/config/appConfig.js';
import { BrandLogo } from '../shared/components/BrandLogo.jsx';
import { StoryPanel } from './components/StoryPanel.jsx';

export function AuthLayout({ homePath }) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100svh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
      }}
    >
      <StoryPanel brand={<BrandLogo to={homePath} />} />
      <Box
        component="section"
        aria-label="Account access"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          px: { xs: 3, md: 5, lg: 6 },
          pt: { xs: 4, md: 6 },
          pb: 3,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: 420, md: 365, xl: 390 },
            m: 'auto',
            py: { xs: 1, md: 6 },
          }}
        >
          <Outlet />
        </Box>
        <Box
          component="footer"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            color: 'text.secondary',
            mt: 4,
          }}
        >
          <Typography sx={{ fontSize: 10 }}>Learn a little. Connect a lot.</Typography>
          <Typography sx={{ fontSize: 10 }}>
            © {new Date().getFullYear()} {appConfig.companyName}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
