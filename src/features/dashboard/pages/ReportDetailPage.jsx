import { useState } from 'react';
import { Link as RouterLink, useOutletContext, useParams } from 'react-router';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { paths } from '../../../routes/paths.js';
import { DashboardPage } from '../components/DashboardPage.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { RevisionDialog } from '../components/RevisionDialog.jsx';
import { StatusChip } from '../components/StatusChip.jsx';
import { useDemoData } from '../hooks/useDemoData.js';
import { formatDate } from '../utils/revisionDates.js';

function InsightCard({ title, items, description }) {
  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
      {items.length ? (
        <Stack component="ul" spacing={1.5} sx={{ pl: 2.5, mb: 0 }}>
          {items.map((item) => (
            <Typography component="li" variant="body2" key={item}>
              {item}
            </Typography>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No observations recorded for this attempt.
        </Typography>
      )}
    </Paper>
  );
}

export function ReportDetailPage() {
  const { userId, attemptId } = useParams();
  const { contextType, basePath } = useOutletContext();
  const isLearner = contextType === 'user';
  const { data, addRevision } = useDemoData();
  const student = data.users.find((user) => user.id === userId);
  const [isPlanning, setIsPlanning] = useState(false);
  const [notice, setNotice] = useState(false);
  const attempt = data.attempts.find((item) => item.id === attemptId && item.userId === userId);
  const test = data.tests.find((item) => item.id === attempt?.testId);
  const backButton = (
    <Button
      component={RouterLink}
      to={isLearner ? paths.userReports(userId) : paths.groupPage(basePath, 'students')}
    >
      {isLearner ? '← All reports' : '← Back to students'}
    </Button>
  );

  if (!attempt) {
    return (
      <DashboardPage title="Report not found" action={backButton}>
        <EmptyState
          title="This report isn't available"
          description="Return to your reports to choose a test attempt."
        />
      </DashboardPage>
    );
  }

  function createRevision(values) {
    addRevision({ ...values, userId, completed: false, origin: attempt.id });
    setIsPlanning(false);
    setNotice(true);
  }

  return (
    <DashboardPage
      eyebrow={isLearner ? 'YOUR TEST REPORT' : 'STUDENT TEST REPORT'}
      title={test?.title || 'Your test report'}
      description={`${isLearner ? '' : `${student?.name || 'Student'} · `}Attempted ${formatDate(attempt.date)}${test?.subject ? ` · ${test.subject}` : ''}`}
      action={backButton}
    >
      {attempt.status === 'Processing' ? (
        <Paper
          variant="outlined"
          sx={{ p: { xs: 3, md: 6 }, borderRadius: 3, textAlign: 'center', bgcolor: 'brand.paper' }}
        >
          <StatusChip status={attempt.status} />
          <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>
            Your insights are taking shape.
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 480, mx: 'auto' }}>
            Your attempt has been submitted and is being evaluated. Your score, question review, and
            learning insights will appear here once evaluation is complete.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={4}>
          <Paper
            variant="outlined"
            sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, bgcolor: 'brand.paper' }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
            >
              <Box>
                <StatusChip status={attempt.status} />
                <Typography component="p" variant="h3" sx={{ mt: 2, mb: 0.5 }}>
                  {attempt.score}{' '}
                  <Box component="span" sx={{ fontSize: '1.25rem', color: 'text.secondary' }}>
                    / {attempt.maxScore}
                  </Box>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isLearner ? 'Your score for this attempt' : 'Student score for this attempt'}
                </Typography>
              </Box>
              {isLearner && (
                <Box sx={{ maxWidth: 380 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Keep your progress growing.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Use these insights to plan a focused revision and build on what you’ve learned.
                  </Typography>
                  <Button variant="contained" onClick={() => setIsPlanning(true)}>
                    Plan a revision
                  </Button>
                </Box>
              )}
            </Stack>
          </Paper>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <InsightCard
              title={isLearner ? 'Your strengths' : 'Student strengths'}
              description="Skills you showed in this attempt."
              items={attempt.strengths || []}
            />
            <InsightCard
              title="Room to grow"
              description="Areas to return to in your next revision."
              items={attempt.concerns || []}
            />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {isLearner ? 'A closer look at your answers' : 'A closer look at student answers'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Review each question and the reasoning behind the answer.
            </Typography>
            {attempt.answers?.length ? (
              attempt.answers.map((answer, index) => (
                <Accordion
                  key={answer.id}
                  disableGutters
                  variant="outlined"
                  sx={{
                    mb: 1.5,
                    borderRadius: 3,
                    '&:first-of-type, &:last-of-type': { borderRadius: 3 },
                    '&::before': { display: 'none' },
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <Box component="span" aria-hidden="true">
                        +
                      </Box>
                    }
                  >
                    <Box sx={{ py: 1, pr: 2 }}>
                      <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          QUESTION {index + 1}
                        </Typography>
                        <Chip
                          size="small"
                          variant="outlined"
                          color={answer.selected === answer.correct ? 'success' : 'warning'}
                          label={answer.selected === answer.correct ? 'Correct' : 'Review'}
                        />
                      </Stack>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {answer.question}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3, pb: 3 }}>
                    <Stack spacing={2}>
                      {answer.topic && (
                        <Typography variant="caption" color="text.secondary">
                          Topic: {answer.topic}
                        </Typography>
                      )}
                      <Typography variant="body2">
                        <strong>{isLearner ? 'Your answer:' : 'Student answer:'}</strong>{' '}
                        {answer.selected ?? 'Not answered'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Correct answer:</strong> {answer.correct}
                      </Typography>
                      {answer.explanation && (
                        <Alert severity="info" icon={false}>
                          {answer.explanation}
                        </Alert>
                      )}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <EmptyState
                title="No question review available"
                description="There are no answer details recorded for this attempt."
              />
            )}
          </Box>
        </Stack>
      )}
      {isLearner && isPlanning && (
        <RevisionDialog
          revision={{
            title: `Revise: ${test?.subject || test?.title || 'test topics'}`,
            description: (attempt.concerns || []).join('\n'),
          }}
          onClose={() => setIsPlanning(false)}
          onSubmit={createRevision}
        />
      )}
      <Snackbar
        open={notice}
        autoHideDuration={5000}
        onClose={() => setNotice(false)}
        message="Revision added to your plan."
        action={
          <Button color="inherit" component={RouterLink} to={paths.userRevisions(userId)}>
            View plan
          </Button>
        }
      />
    </DashboardPage>
  );
}
