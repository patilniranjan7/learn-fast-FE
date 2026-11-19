import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Box, Drawer, IconButton, Stack, useMediaQuery } from '@mui/material';
import { Icon } from '../shared/components/Icon.jsx';

const drawerWidth = 264;

export function DashboardLayout({ navigation, header, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, isDesktop]);

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {navigation}
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100svh', display: 'flex' }}>
      <Box
        component="a"
        href="#dashboard-content"
        sx={{
          position: 'fixed',
          top: -100,
          left: 16,
          zIndex: 1500,
          bgcolor: 'background.paper',
          p: 1,
          '&:focus': { top: 8 },
        }}
      >
        Skip to content
      </Box>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        open={mobileOpen && !isDesktop}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { md: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
      >
        <IconButton
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          sx={{ alignSelf: 'flex-end', mr: 1, mt: 1 }}
        >
          <Icon name="close" />
        </IconButton>
        {mobileOpen && drawerContent}
      </Drawer>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack
          component="header"
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            minHeight: 76,
            px: { xs: 2, md: 5 },
            py: 1.5,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <IconButton
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: 'none' } }}
          >
            <Icon name="menu" />
          </IconButton>
          {header}
        </Stack>
        <Box
          component="main"
          id="dashboard-content"
          tabIndex={-1}
          sx={{ maxWidth: 1350, mx: 'auto', p: { xs: 2, sm: 3, md: 5 }, outline: 'none' }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
