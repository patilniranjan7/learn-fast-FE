import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router';
import { BrandLogo } from '../../../shared/components/BrandLogo.jsx';
import { Icon } from '../../../shared/components/Icon.jsx';
import { paths } from '../../../routes/paths.js';

export function DashboardNavigation({
  navigation,
  conversations,
  viewer,
  basePath,
  onNewChat,
  onReset,
}) {
  const { pathname } = useLocation();

  return (
    <>
      <Box sx={{ px: 3, pt: 4, pb: 4 }}>
        <BrandLogo to={paths.user(viewer.id)} />
      </Box>
      <Box component="nav" aria-label="Dashboard navigation" sx={{ px: 2 }}>
        <Typography
          variant="overline"
          sx={{ px: 1.5, color: 'text.secondary', fontSize: 10, letterSpacing: 2 }}
        >
          Your workspace
        </Typography>
        <List sx={{ mb: 2 }}>
          {navigation.map((item) => (
            <ListItemButton
              key={item.label}
              component={RouterLink}
              to={item.to}
              selected={item.active}
              aria-current={item.active ? 'page' : undefined}
              sx={{
                borderRadius: 1.5,
                mb: 0.75,
                '&.Mui-selected': { bgcolor: 'brand.tile' },
                '&.Mui-selected:hover': { bgcolor: 'brand.tile' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                <Icon name={item.icon} width={19} height={19} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{ primary: { fontSize: 13, fontWeight: item.active ? 650 : 450 } }}
              />
            </ListItemButton>
          ))}
        </List>
        <Divider />
        <Button
          onClick={onNewChat}
          startIcon={<Icon name="plus" width={17} height={17} />}
          fullWidth
          variant="outlined"
          sx={{ justifyContent: 'flex-start', my: 2.5, minHeight: 42, borderColor: 'divider' }}
        >
          New Chat
        </Button>
        <Typography
          variant="overline"
          sx={{ px: 1.5, color: 'text.secondary', fontSize: 10, letterSpacing: 2 }}
        >
          Previous conversations
        </Typography>
        <List aria-label="Previous conversations">
          {[...conversations].reverse().map((chat) => (
            <ListItemButton
              key={chat.id}
              component={RouterLink}
              to={paths.chat(basePath, chat.id)}
              selected={pathname === paths.chat(basePath, chat.id)}
              sx={{ borderRadius: 1.5, py: 1 }}
            >
              <ListItemIcon sx={{ minWidth: 28, color: 'text.secondary' }}>
                <Icon name="chat" width={15} height={15} />
              </ListItemIcon>
              <ListItemText
                primary={chat.title}
                slotProps={{ primary: { fontSize: 12, noWrap: true } }}
              />
            </ListItemButton>
          ))}
          {!conversations.length && (
            <Typography variant="caption" color="text.secondary" sx={{ px: 1.5 }}>
              Your next question starts here.
            </Typography>
          )}
        </List>
      </Box>
      <Box sx={{ mt: 'auto', px: 3, pt: 5, pb: 2.5 }}>
        <Box sx={{ bgcolor: 'brand.card', borderRadius: 2, p: 2, mb: 2.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 650, mb: 0.75 }}>
            A space to explore.
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', lineHeight: 1.6 }}
          >
            Sample data. Changes last until you refresh.
          </Typography>
          <Button size="small" onClick={onReset} sx={{ p: 0, mt: 1, fontSize: 11 }}>
            Reset demo
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: 'brand.tile',
              color: 'primary.main',
              fontSize: 12,
            }}
          >
            {viewer.initials}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {viewer.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sample account
            </Typography>
          </Box>
        </Stack>
        <Button
          component={RouterLink}
          to={paths.login}
          size="small"
          sx={{ mt: 1.5, px: 0, fontSize: 11 }}
        >
          Back to sign in
        </Button>
      </Box>
    </>
  );
}
