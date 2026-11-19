import { useState } from 'react';
import { Box, Button, Chip, Link, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router';
import { paths } from '../../../routes/paths.js';
import { DashboardPage } from '../components/DashboardPage.jsx';
import { DataTable } from '../components/DataTable.jsx';
import { MetricCards } from '../components/MetricCards.jsx';
import { CreateEntityDialog } from '../components/CreateEntityDialog.jsx';
import { useDemoData } from '../hooks/useDemoData.js';
import { cohortEvidence } from '../components/management/managementData.js';

export function OrganisationPage({ organisation }) {
  const { data, createCohort } = useDemoData();
  const navigate = useNavigate();
  const [createKind, setCreateKind] = useState('');
  const cohorts = data.cohorts.filter((cohort) => cohort.orgId === organisation.id);
  const studentCount = new Set(cohorts.flatMap((cohort) => cohort.studentIds)).size;
  const rows = cohorts.map((cohort) => ({ ...cohort, ...cohortEvidence(data, cohort) }));

  function handleCreate(values) {
    const cohort = createCohort({ ...values, orgId: organisation.id });
    setCreateKind('');
    navigate(paths.cohort(cohort));
  }

  return (
    <DashboardPage
      eyebrow="Organisation"
      title={organisation.name}
      description={
        organisation.description ||
        'Bring your classes, groups, and learners together in one thoughtful space.'
      }
      action={
        <Stack direction="row" sx={{ gap: 1 }}>
          <Button variant="outlined" onClick={() => setCreateKind('class')}>
            + Add class
          </Button>
          <Button variant="contained" onClick={() => setCreateKind('group')}>
            + Add group
          </Button>
        </Stack>
      }
    >
      <MetricCards
        items={[
          {
            label: 'Students',
            value: studentCount,
            detail: 'Unique members across this organisation',
          },
          {
            label: 'Groups',
            value: cohorts.filter((cohort) => cohort.kind === 'group').length,
            detail: 'Learning and practice communities',
          },
          {
            label: 'Classes',
            value: cohorts.filter((cohort) => cohort.kind === 'class').length,
            detail: 'Connected to this organisation',
          },
        ]}
      />
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Groups & classes
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Only spaces belonging to {organisation.name} appear here.
        </Typography>
        <DataTable
          rows={rows}
          rowKey={(row) => `${row.kind}-${row.id}`}
          emptyMessage="This organisation has no groups or classes yet. Add one to get started."
          columns={[
            {
              key: 'name',
              label: 'Name',
              render: (row) => (
                <Box>
                  <Link component={RouterLink} to={paths.cohort(row)} sx={{ fontWeight: 600 }}>
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
                  label={row.kind === 'class' ? 'Class' : 'Group'}
                  size="small"
                  variant="outlined"
                />
              ),
            },
            { key: 'students', label: 'Students', render: (row) => row.studentIds.length },
            { key: 'tests', label: 'Tests', render: (row) => row.tests.length },
            {
              key: 'average',
              label: 'Average score',
              render: (row) => (row.average === null ? '—' : `${row.average}%`),
            },
            {
              key: 'open',
              label: 'Explore',
              render: (row) => (
                <Button
                  component={RouterLink}
                  to={paths.cohort(row)}
                  size="small"
                  aria-label={`Open ${row.name}`}
                >
                  Open ↗
                </Button>
              ),
            },
          ]}
        />
      </Paper>
      {createKind && (
        <CreateEntityDialog
          open
          kind={createKind}
          organisations={[organisation]}
          defaultOrgId={organisation.id}
          fixedOrganisation
          onClose={() => setCreateKind('')}
          onCreate={handleCreate}
        />
      )}
    </DashboardPage>
  );
}
