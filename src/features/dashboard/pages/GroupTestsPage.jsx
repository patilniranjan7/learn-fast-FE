import { useState } from 'react';
import { Box, Button, Paper, Snackbar, Stack, Typography } from '@mui/material';
import { DashboardPage } from '../components/DashboardPage.jsx';
import { DataTable } from '../components/DataTable.jsx';
import { CreateTestDialog } from '../components/CreateTestDialog.jsx';
import { MetricCards } from '../components/MetricCards.jsx';
import { StatusChip } from '../components/StatusChip.jsx';
import { useDemoData } from '../hooks/useDemoData.js';
import { cohortEvidence, formatDate } from '../components/management/managementData.js';

export function GroupTestsPage({ cohort }) {
  const { data, addTest } = useDemoData();
  const [createOpen, setCreateOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const { tests, evaluated, average } = cohortEvidence(data, cohort);

  function handleCreate(test) {
    addTest(test);
    setCreateOpen(false);
    setNotice('Draft test created. You can see its details in the list below.');
  }

  return (
    <DashboardPage
      eyebrow={cohort.name}
      title="Tests"
      description="Thoughtful assessments, clearer understanding. Manage the tests that move learning forward."
      action={
        <Button variant="contained" onClick={() => setCreateOpen(true)}>
          + Create test
        </Button>
      }
    >
      <MetricCards
        items={[
          {
            label: 'Total tests',
            value: tests.length,
            detail: `${tests.filter((test) => test.status === 'Published').length} published`,
          },
          {
            label: 'Evaluated attempts',
            value: evaluated.length,
            detail: 'From sample assessment records',
          },
          {
            label: 'Average score',
            value: average === null ? '—' : `${average}%`,
            detail: 'Across evaluated attempts',
          },
        ]}
      />
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mt: 3 }}>
        <Stack direction="row" sx={{ mb: 3, justifyContent: 'space-between' }}>
          <Typography variant="h6">All tests</Typography>
          <Typography variant="body2" color="text.secondary">
            {tests.length} total
          </Typography>
        </Stack>
        <DataTable
          rows={[...tests].sort((a, b) => b.date.localeCompare(a.date))}
          emptyMessage="No tests yet. Create your first draft to get started."
          columns={[
            {
              key: 'title',
              label: 'Test',
              render: (test) => (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {test.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {test.subject}
                  </Typography>
                </Box>
              ),
            },
            { key: 'date', label: 'Date', render: (test) => formatDate(test.date) },
            { key: 'questionCount', label: 'Questions' },
            { key: 'maxScore', label: 'Max. marks' },
            {
              key: 'materials',
              label: 'Materials',
              render: (test) => (
                <Box sx={{ maxWidth: 220 }}>
                  <Typography variant="caption" component="div" sx={{ overflowWrap: 'anywhere' }}>
                    {test.paperName || 'Sample paper'}
                    {test.answerKeyName ? ` · ${test.answerKeyName}` : ''}
                  </Typography>
                  {test.markingScheme && (
                    <Typography variant="caption" color="text.secondary" component="div">
                      {test.markingScheme}
                    </Typography>
                  )}
                </Box>
              ),
            },
            {
              key: 'status',
              label: 'Status',
              render: (test) => <StatusChip status={test.status} />,
            },
          ]}
        />
      </Paper>
      {createOpen && (
        <CreateTestDialog
          open
          onClose={() => setCreateOpen(false)}
          cohort={cohort}
          onCreate={handleCreate}
        />
      )}
      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={6000}
        onClose={() => setNotice('')}
        message={notice}
      />
    </DashboardPage>
  );
}
