import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router';
import {
  Box,
  Button,
  Chip,
  Paper,
  Snackbar,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { DashboardPage } from '../components/DashboardPage.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { RevisionCalendar } from '../components/RevisionCalendar.jsx';
import { RevisionDialog } from '../components/RevisionDialog.jsx';
import { useDemoData } from '../hooks/useDemoData.js';
import { formatDate, localDate } from '../utils/revisionDates.js';
import { paths } from '../../../routes/paths.js';

export function RevisionsPage() {
  const { userId } = useParams();
  const { data, addRevision, updateRevision } = useDemoData();
  const [view, setView] = useState('calendar');
  const [month, setMonth] = useState(localDate());
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');
  const revisions = data.revisions
    .filter((revision) => revision.userId === userId)
    .toSorted((first, second) => first.date.localeCompare(second.date));
  const planned = revisions.filter((revision) => !revision.completed).length;

  function saveRevision(values) {
    if (editing.id) {
      updateRevision(editing.id, values);
      setNotice('Revision updated. Your plan is ready.');
    } else {
      addRevision({ ...values, userId, completed: false });
      setNotice('Revision added to your plan.');
    }
    setMonth(values.date);
    setEditing(null);
  }

  function toggleCompleted(revision) {
    updateRevision(revision.id, { completed: !revision.completed });
    setNotice(
      revision.completed ? 'Revision moved back to planned.' : 'Revision complete. Keep growing!',
    );
  }

  return (
    <DashboardPage
      eyebrow="YOUR LEARNING ROUTINE"
      title="Make room for revision."
      description="Turn what you’ve learned into what you know. Plan a little practice, one day at a time."
      action={
        <Button variant="contained" onClick={() => setEditing({})}>
          + Plan a revision
        </Button>
      }
    >
      <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: 'brand.paper' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between' }}
        >
          <Box>
            <Typography variant="h6">Small steps. Lasting progress.</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {planned} planned {planned === 1 ? 'revision' : 'revisions'} ·{' '}
              {revisions.length - planned} completed
            </Typography>
          </Box>
          <ToggleButtonGroup
            exclusive
            value={view}
            onChange={(_, next) => next && setView(next)}
            size="small"
            aria-label="Revision view"
          >
            <ToggleButton value="calendar">Calendar</ToggleButton>
            <ToggleButton value="grid">Grid</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Paper>
      {view === 'calendar' ? (
        <RevisionCalendar
          month={month}
          onMonthChange={setMonth}
          revisions={revisions}
          onSelect={setEditing}
          onCreate={(date) => setEditing({ date })}
        />
      ) : revisions.length ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
            gap: 3,
          }}
        >
          {revisions.map((revision) => (
            <Paper key={revision.id} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Stack
                direction="row"
                spacing={2}
                sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Typography variant="body2" color="text.secondary">
                  {formatDate(revision.date)}
                  {revision.time && ` · ${revision.time} (${revision.timeZone})`}
                </Typography>
                <Chip
                  size="small"
                  label={revision.completed ? 'Completed' : 'Planned'}
                  color={revision.completed ? 'success' : 'default'}
                  variant="outlined"
                />
              </Stack>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {revision.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ minHeight: 44, whiteSpace: 'pre-wrap' }}
              >
                {revision.description || 'A focused moment to revisit what matters.'}
              </Typography>
              {revision.origin && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 2 }}
                >
                  {revision.source?.highlightId
                    ? 'From a highlighted passage'
                    : 'From your test report'}
                </Typography>
              )}
              <Stack direction="row" useFlexGap spacing={1} sx={{ mt: 3, flexWrap: 'wrap' }}>
                <Button variant="outlined" onClick={() => setEditing(revision)}>
                  Edit / reschedule
                </Button>
                <Button onClick={() => toggleCompleted(revision)}>
                  {revision.completed ? 'Mark as planned' : 'Mark complete'}
                </Button>
                {revision.source?.highlightId && (
                  <Button
                    component={RouterLink}
                    to={`${paths.chat(paths.user(userId), revision.source.chatId)}#passage-${revision.source.highlightId}`}
                  >
                    Back to passage
                  </Button>
                )}
              </Stack>
            </Paper>
          ))}
        </Box>
      ) : (
        <EmptyState
          title="Your next step starts here"
          description="Schedule your first revision and give your learning a little room to grow."
          action={
            <Button variant="contained" onClick={() => setEditing({})}>
              Plan a revision
            </Button>
          }
        />
      )}
      {editing && (
        <RevisionDialog
          key={editing.id || editing.date || 'new'}
          revision={editing}
          onClose={() => setEditing(null)}
          onSubmit={saveRevision}
        />
      )}
      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={4000}
        onClose={() => setNotice('')}
        message={notice}
      />
    </DashboardPage>
  );
}
