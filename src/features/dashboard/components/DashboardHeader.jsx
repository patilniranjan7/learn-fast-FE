import { Box, Breadcrumbs, Chip, Link, MenuItem, TextField, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router';
import { paths } from '../../../routes/paths.js';

export function DashboardHeader({ contextType, contextName, organisation, viewerId }) {
  const navigate = useNavigate();
  const destinations = {
    user: paths.user(viewerId),
    group: '/group/1',
    class: '/class/1',
    org: paths.organisation('1'),
    admin: paths.admin,
  };

  return (
    <>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Breadcrumbs
          aria-label="Workspace context"
          sx={{
            '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap' },
            '& li:last-child': { minWidth: 0 },
          }}
        >
          {organisation && (
            <Link
              component={RouterLink}
              to={paths.organisation(organisation.id)}
              color="text.secondary"
              sx={{ fontSize: 12 }}
            >
              {organisation.name}
            </Link>
          )}
          <Typography noWrap sx={{ fontSize: 13, fontWeight: 550 }}>
            {contextName}
          </Typography>
        </Breadcrumbs>
      </Box>
      <Chip
        size="small"
        label="Sample workspace"
        variant="outlined"
        sx={{
          display: { xs: 'none', lg: 'flex' },
          fontSize: 10,
          borderColor: 'brand.line',
          color: 'text.secondary',
        }}
      />
      <TextField
        select
        label="Preview dashboard"
        value={contextType}
        onChange={(event) => navigate(destinations[event.target.value])}
        sx={{ width: { xs: 130, sm: 170 }, flexShrink: 0 }}
      >
        <MenuItem value="user">Learner</MenuItem>
        <MenuItem value="group">Group</MenuItem>
        <MenuItem value="class">Class</MenuItem>
        <MenuItem value="org">Organisation</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </TextField>
    </>
  );
}
