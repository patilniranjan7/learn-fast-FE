import {
  Divider,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { Icon } from '../../../../shared/components/Icon.jsx';

const actions = [
  { key: 'ask', label: 'Ask more', icon: 'spark' },
  { key: 'note', label: 'Add note', icon: 'report' },
  { key: 'side', label: 'Create side conversation', icon: 'chat' },
  { key: 'later', label: 'Learn later', icon: 'calendar' },
];

export function PassageActionsMenu({ anchor, highlight, onClose, onAction }) {
  return (
    <Menu
      open={Boolean(anchor && highlight)}
      anchorReference="anchorPosition"
      anchorPosition={anchor || undefined}
      onClose={onClose}
      disableScrollLock
      marginThreshold={12}
      data-passage-actions
      slotProps={{
        list: { 'aria-label': 'Passage actions', sx: { py: 0.75 } },
        paper: {
          sx: {
            width: 272,
            maxWidth: 'calc(100vw - 24px)',
            border: 1,
            borderColor: 'brand.line',
            borderRadius: 2,
            boxShadow: 4,
          },
        },
      }}
    >
      <ListSubheader
        disableSticky
        sx={{
          px: 2,
          pt: 1,
          pb: 1.5,
          maxWidth: '100%',
          lineHeight: 'normal',
          bgcolor: 'background.paper',
        }}
      >
        <Typography
          component="p"
          variant="overline"
          color="text.secondary"
          sx={{ fontSize: 9, letterSpacing: 1.5 }}
        >
          Selected passage
        </Typography>
        <Typography
          component="p"
          variant="caption"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            overflowWrap: 'anywhere',
            lineHeight: 1.6,
          }}
        >
          {highlight?.text}
        </Typography>
      </ListSubheader>
      <Divider />
      {actions.map((action) => (
        <MenuItem
          key={action.key}
          aria-label={action.label}
          onClick={() => onAction(action.key)}
          sx={{
            py: 1.25,
            mx: 0.75,
            my: 0.25,
            borderRadius: 1,
            ...(action.key === 'later' ? { bgcolor: 'brand.tile', color: 'primary.main' } : {}),
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            <Icon name={action.icon} width={18} height={18} />
          </ListItemIcon>
          <ListItemText
            primary={action.label}
            secondary={
              action.key === 'note' && highlight?.note
                ? 'Note saved'
                : action.key === 'later' && highlight?.reminder
                  ? `${highlight.reminder.date} · ${highlight.reminder.time}`
                  : undefined
            }
            slotProps={{
              primary: { sx: { fontSize: 12, fontWeight: action.key === 'later' ? 650 : 500 } },
              secondary: { sx: { fontSize: 10 } },
            }}
          />
        </MenuItem>
      ))}
    </Menu>
  );
}
