import { Link as RouterLink, useParams } from 'react-router';
import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { paths } from '../../../routes/paths.js';
import { DashboardPage } from '../components/DashboardPage.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { StatusChip } from '../components/StatusChip.jsx';
import { useDemoData } from '../hooks/useDemoData.js';
import { formatDate } from '../utils/revisionDates.js';

export function ReportsPage() {
  const { userId } = useParams();
  const { data } = useDemoData();
  const attempts = data.attempts
    .filter((attempt) => attempt.userId === userId)
    .toSorted((first, second) => second.date.localeCompare(first.date));
  const evaluated = attempts.filter((attempt) => attempt.status === 'Evaluated');
  return (
    <DashboardPage
      eyebrow="REFLECT & GROW"
      title="Every attempt tells a story."
      description="Explore your results, celebrate your strengths, and find your next learning opportunity."
    >
      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}
      >
        {[
          ['Tests attempted', attempts.length, 'Every attempt is a step forward.'],
          ['Reports ready', evaluated.length, 'Insights to guide your next step.'],
        ].map(([label, value, description]) => (
          <Paper
            key={label}
            variant="outlined"
            sx={{ p: 3, borderRadius: 3, bgcolor: 'brand.paper' }}
          >
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h3" sx={{ my: 1 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Paper>
        ))}
      </Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Your test reports
      </Typography>
      {attempts.length ? (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
          {attempts.map((attempt, index) => {
            const test = data.tests.find((item) => item.id === attempt.testId);
            return (
              <Box key={attempt.id}>
                {index > 0 && <Divider />}
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={3}
                  sx={{
                    p: 3,
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                  }}
                >
                  <Box>
                    <Stack direction="row" spacing={1.5} sx={{ mb: 1, alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {test?.subject || 'Practice test'}
                      </Typography>
                      <StatusChip status={attempt.status} />
                    </Stack>
                    <Typography variant="h6">{test?.title || 'Test report'}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Attempted {formatDate(attempt.date)}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
                    <Box sx={{ minWidth: 70 }}>
                      <Typography variant="caption" color="text.secondary">
                        Score
                      </Typography>
                      <Typography variant="h6">
                        {attempt.status === 'Evaluated'
                          ? `${attempt.score} / ${attempt.maxScore}`
                          : 'Pending'}
                      </Typography>
                    </Box>
                    <Button
                      component={RouterLink}
                      to={paths.userReport(userId, attempt.id)}
                      variant="outlined"
                    >
                      {attempt.status === 'Evaluated' ? 'View report' : 'View status'}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            );
          })}
        </Paper>
      ) : (
        <EmptyState
          title="A fresh page in your learning story"
          description="After your first test attempt, your results and personalized insights will appear here."
          action={
            <Button component={RouterLink} to={paths.user(userId)} variant="contained">
              Explore your dashboard
            </Button>
          }
        />
      )}
    </DashboardPage>
  );
}
