import { Alert, Box, Link, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { paths } from '../../../routes/paths.js';
import { DashboardPage } from '../components/DashboardPage.jsx';
import { DataTable } from '../components/DataTable.jsx';
import { MetricCards } from '../components/MetricCards.jsx';
import { ScoreTrend } from '../components/ScoreTrend.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { useDemoData } from '../hooks/useDemoData.js';
import {
  averageScore,
  cohortEvidence,
  formatDate,
  testScorePoints,
} from '../components/management/managementData.js';

export function AnalyticsPage() {
  const { data } = useDemoData();
  const evaluated = data.attempts.filter((attempt) => attempt.status === 'Evaluated');
  const average = averageScore(evaluated);
  const learnerCount = new Set(evaluated.map((attempt) => attempt.userId)).size;
  const points = testScorePoints(data.tests, evaluated);
  const cohorts = data.cohorts.map((cohort) => ({ ...cohort, ...cohortEvidence(data, cohort) }));

  return (
    <DashboardPage
      eyebrow="Workspace overview"
      title="Learning analytics"
      description="A wider perspective on learning. Understand participation, assessment results, and where your communities stand."
    >
      <MetricCards
        items={[
          { label: 'Users', value: data.users.length, detail: 'Unique sample accounts' },
          {
            label: 'Groups',
            value: data.cohorts.filter((cohort) => cohort.kind === 'group').length,
            detail: 'Independent and organisation groups',
          },
          {
            label: 'Classes',
            value: data.cohorts.filter((cohort) => cohort.kind === 'class').length,
            detail: 'Learning spaces across the platform',
          },
          {
            label: 'Organisations',
            value: data.organisations.length,
            detail: 'Connected learning communities',
          },
        ]}
      />
      <MetricCards
        items={[
          {
            label: 'Students',
            value: new Set(data.users.map((user) => user.id)).size,
            detail: `${learnerCount} with evaluated attempts`,
          },
          {
            label: 'Evaluated attempts',
            value: evaluated.length,
            detail: `${data.attempts.filter((attempt) => attempt.status === 'Processing').length} currently processing`,
          },
          {
            label: 'Average score',
            value: average === null ? '—' : `${average}%`,
            detail: 'One equally weighted result per attempt',
          },
          {
            label: 'Published tests',
            value: data.tests.filter((test) => test.status === 'Published').length,
            detail: `${data.tests.length} total assessments`,
          },
        ]}
      />
      <Alert severity="info">
        Sample analytics · Totals use unique students and individual evaluated attempts. Students
        can belong to multiple communities; community rows should not be added together.
      </Alert>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        {points.length ? (
          <ScoreTrend points={points} title="Assessment score overview" />
        ) : (
          <EmptyState
            title="No evaluated results yet"
            description="Assessment averages will appear here when evaluated attempts are available."
          />
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Sample evidence: {points.length} assessments with evaluated attempts. Assessments may have
          different participants and subjects.
        </Typography>
        <DataTable
          rows={points}
          emptyMessage="No assessment scores to show."
          columns={[
            { key: 'sequence', label: 'Chart point', render: (row) => points.indexOf(row) + 1 },
            { key: 'label', label: 'Assessment' },
            { key: 'date', label: 'Date', render: (row) => formatDate(row.date) },
            { key: 'count', label: 'Evaluated attempts' },
            { key: 'score', label: 'Average score', render: (row) => `${row.score}%` },
          ]}
        />
      </Paper>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction="row" sx={{ mb: 3, justifyContent: 'space-between' }}>
          <Typography variant="h6">Community overview</Typography>
          <Typography variant="body2" color="text.secondary">
            {cohorts.length} spaces
          </Typography>
        </Stack>
        <DataTable
          rows={cohorts}
          rowKey={(row) => `${row.kind}-${row.id}`}
          emptyMessage="Create a group or class to start building your community."
          columns={[
            {
              key: 'name',
              label: 'Community',
              render: (row) => (
                <Box>
                  <Link component={RouterLink} to={paths.cohort(row)} sx={{ fontWeight: 600 }}>
                    {row.name}
                  </Link>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {row.kind === 'class' ? 'Class' : 'Group'} ·{' '}
                    {data.organisations.find((organisation) => organisation.id === row.orgId)
                      ?.name || 'Standalone'}
                  </Typography>
                </Box>
              ),
            },
            { key: 'students', label: 'Students', render: (row) => new Set(row.studentIds).size },
            { key: 'tests', label: 'Tests', render: (row) => row.tests.length },
            {
              key: 'evaluated',
              label: 'Evaluated attempts',
              render: (row) => row.evaluated.length,
            },
            {
              key: 'average',
              label: 'Average score',
              render: (row) => (row.average === null ? '—' : `${row.average}%`),
            },
          ]}
        />
      </Paper>
    </DashboardPage>
  );
}
