import { Alert, Paper, Typography } from '@mui/material';
import { DashboardPage } from '../components/DashboardPage.jsx';
import { DataTable } from '../components/DataTable.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { MetricCards } from '../components/MetricCards.jsx';
import { ScoreTrend } from '../components/ScoreTrend.jsx';
import { useDemoData } from '../hooks/useDemoData.js';
import {
  cohortEvidence,
  formatDate,
  testScorePoints,
} from '../components/management/managementData.js';

export function ProgressPage({ cohort }) {
  const { data } = useDemoData();
  const { tests, evaluated, average } = cohortEvidence(data, cohort);
  const points = testScorePoints(tests, evaluated);
  const activeStudentIds = new Set(evaluated.map((attempt) => attempt.userId));
  const coveredStudents = cohort.studentIds.filter((id) => activeStudentIds.has(id)).length;
  const change = points.length > 1 ? points.at(-1).score - points[0].score : null;

  return (
    <DashboardPage
      eyebrow={cohort.name}
      title="Progress"
      description="See the learning behind the numbers, one assessment at a time."
    >
      <MetricCards
        items={[
          {
            label: 'Average score',
            value: average === null ? '—' : `${average}%`,
            detail: 'Each evaluated attempt weighted equally',
          },
          {
            label: 'Student coverage',
            value: `${coveredStudents} / ${cohort.studentIds.length}`,
            detail: 'Students with an evaluated attempt',
          },
          {
            label: 'Score change',
            value: change === null ? '—' : `${change > 0 ? '+' : ''}${change} pp`,
            detail: 'First to latest assessment average',
          },
        ]}
      />
      <Alert severity="info" sx={{ my: 3 }}>
        Sample evidence · {evaluated.length} evaluated attempts across {points.length} assessments.
        Processing attempts and draft tests without evaluated attempts are excluded. Different
        student participation can affect comparisons.
      </Alert>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        {points.length ? (
          <ScoreTrend points={points} />
        ) : (
          <EmptyState
            title="Progress begins with a test"
            description="Evaluated student attempts will appear here when they are available."
          />
        )}
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Assessment scores
        </Typography>
        <DataTable
          rows={points}
          emptyMessage="No evaluated assessment scores yet."
          columns={[
            { key: 'sequence', label: 'Chart point', render: (row) => points.indexOf(row) + 1 },
            { key: 'label', label: 'Assessment' },
            { key: 'date', label: 'Date', render: (row) => formatDate(row.date) },
            { key: 'count', label: 'Evaluated attempts' },
            { key: 'score', label: 'Average score', render: (row) => `${row.score}%` },
          ]}
        />
      </Paper>
    </DashboardPage>
  );
}
