import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Link,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router';
import { paths } from '../../../routes/paths.js';
import { DashboardPage } from '../components/DashboardPage.jsx';
import { DataTable } from '../components/DataTable.jsx';
import { MetricCards } from '../components/MetricCards.jsx';
import { CreateEntityDialog } from '../components/CreateEntityDialog.jsx';
import { useDemoData } from '../hooks/useDemoData.js';

export function AdminDirectoryPage() {
  const { data, createOrganisation, createCohort } = useDemoData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [kind, setKind] = useState('all');
  const [scope, setScope] = useState('all');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [createKind, setCreateKind] = useState('');
  const organisationRows = data.organisations.map((organisation) => {
    const cohorts = data.cohorts.filter((cohort) => cohort.orgId === organisation.id);
    return {
      ...organisation,
      kind: 'organisation',
      orgId: organisation.id,
      studentCount: new Set(cohorts.flatMap((cohort) => cohort.studentIds)).size,
      context: `${cohorts.length} groups & classes`,
      url: paths.organisation(organisation.id),
    };
  });
  const cohortRows = data.cohorts.map((cohort) => ({
    ...cohort,
    studentCount: new Set(cohort.studentIds).size,
    context: data.organisations.find((org) => org.id === cohort.orgId)?.name || 'Standalone',
    url: paths.cohort(cohort),
  }));
  const rows = [...organisationRows, ...cohortRows].filter((row) => {
    const matchesKind = kind === 'all' || row.kind === kind;
    const matchesScope =
      scope === 'all' || (scope === 'standalone' ? !row.orgId : row.orgId === scope);
    return (
      matchesKind &&
      matchesScope &&
      `${row.name} ${row.description || ''}`.toLowerCase().includes(search.trim().toLowerCase())
    );
  });

  function handleCreate(values) {
    const record =
      createKind === 'organisation' ? createOrganisation(values) : createCohort(values);
    setCreateKind('');
    navigate(createKind === 'organisation' ? paths.organisation(record.id) : paths.cohort(record));
  }

  function chooseCreate(nextKind) {
    setMenuAnchor(null);
    setCreateKind(nextKind);
  }

  return (
    <DashboardPage
      eyebrow="Workspace overview"
      title="Organisations & groups"
      description="A connected view of your learning communities. Find a class, manage a group, or make room for something new."
      action={
        <Button
          variant="contained"
          aria-haspopup="menu"
          aria-expanded={Boolean(menuAnchor)}
          onClick={(event) => setMenuAnchor(event.currentTarget)}
        >
          + Create new
        </Button>
      }
    >
      <MetricCards
        items={[
          {
            label: 'Organisations',
            value: data.organisations.length,
            detail: 'Connected learning communities',
          },
          {
            label: 'Groups',
            value: data.cohorts.filter((cohort) => cohort.kind === 'group').length,
            detail: 'Independent and organisation groups',
          },
          {
            label: 'Classes',
            value: data.cohorts.filter((cohort) => cohort.kind === 'class').length,
            detail: 'Spaces for structured learning',
          },
        ]}
      />
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ mb: 2.5 }}>
          Your directory
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} sx={{ mb: 3, gap: 2 }}>
          <TextField
            label="Search directory"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ flex: 2 }}
          />
          <TextField
            select
            label="Type"
            value={kind}
            onChange={(event) => setKind(event.target.value)}
            sx={{ flex: 1 }}
          >
            <MenuItem value="all">All types</MenuItem>
            <MenuItem value="organisation">Organisations</MenuItem>
            <MenuItem value="group">Groups</MenuItem>
            <MenuItem value="class">Classes</MenuItem>
          </TextField>
          <TextField
            select
            label="Organisation"
            value={scope}
            onChange={(event) => setScope(event.target.value)}
            sx={{ flex: 1 }}
          >
            <MenuItem value="all">All organisations</MenuItem>
            <MenuItem value="standalone">Standalone only</MenuItem>
            {data.organisations.map((organisation) => (
              <MenuItem key={organisation.id} value={organisation.id}>
                {organisation.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <DataTable
          rows={rows}
          rowKey={(row) => `${row.kind}-${row.id}`}
          emptyMessage="No results. Try another search or create a new community."
          columns={[
            {
              key: 'name',
              label: 'Name',
              render: (row) => (
                <Box>
                  <Link component={RouterLink} to={row.url} sx={{ fontWeight: 600 }}>
                    {row.name}
                  </Link>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, display: 'block' }}
                  >
                    {row.description}
                  </Typography>
                </Box>
              ),
            },
            {
              key: 'kind',
              label: 'Type',
              render: (row) => (
                <Chip
                  size="small"
                  label={row.kind[0].toUpperCase() + row.kind.slice(1)}
                  variant="outlined"
                />
              ),
            },
            { key: 'context', label: 'Organisation / spaces' },
            { key: 'studentCount', label: 'Students' },
            {
              key: 'open',
              label: 'Explore',
              render: (row) => (
                <Button
                  component={RouterLink}
                  to={row.url}
                  size="small"
                  aria-label={`Open ${row.name}`}
                >
                  Open ↗
                </Button>
              ),
            },
          ]}
        />
        <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 2, mb: 0 }}>
          Organisation student totals count each member once across its groups and classes.
        </Typography>
      </Paper>
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => chooseCreate('organisation')}>Create organisation</MenuItem>
        <MenuItem onClick={() => chooseCreate('group')}>Create group</MenuItem>
        <MenuItem onClick={() => chooseCreate('class')}>Create class</MenuItem>
      </Menu>
      {createKind && (
        <CreateEntityDialog
          open
          kind={createKind}
          organisations={data.organisations}
          defaultOrgId={scope !== 'all' && scope !== 'standalone' ? scope : ''}
          onClose={() => setCreateKind('')}
          onCreate={handleCreate}
        />
      )}
    </DashboardPage>
  );
}
