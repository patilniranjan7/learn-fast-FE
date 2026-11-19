import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Link,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { paths } from '../../../routes/paths.js';
import { DashboardPage } from '../components/DashboardPage.jsx';
import { DataTable } from '../components/DataTable.jsx';
import { InviteDialog } from '../components/InviteDialog.jsx';
import { StatusChip } from '../components/StatusChip.jsx';
import { useDemoData } from '../hooks/useDemoData.js';
import { averageScore, cohortEvidence } from '../components/management/managementData.js';

export function StudentsPage({ cohort, basePath }) {
  const { data, addInvitation } = useDemoData();
  const [search, setSearch] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const { evaluated } = cohortEvidence(data, cohort);
  const students = data.users
    .filter((user) => cohort.studentIds.includes(user.id))
    .map((user) => {
      const attempts = evaluated.filter((attempt) => attempt.userId === user.id);
      return { ...user, attempts, average: averageScore(attempts) };
    });
  const matches = (value) => value.toLowerCase().includes(search.trim().toLowerCase());
  const invitations = data.invitations.filter(
    (invitation) => invitation.cohortId === cohort.id && invitation.cohortKind === cohort.kind,
  );
  const rows = students.filter((user) => matches(`${user.name} ${user.email}`));

  function handleInvite(invitation) {
    addInvitation(invitation);
    setInviteOpen(false);
    setNotice('Sample invitation created. No email was sent.');
  }

  return (
    <DashboardPage
      eyebrow={cohort.name}
      title="Students"
      description="A little context for every learner. Keep your roster in view and follow their progress."
      action={
        <Button variant="contained" onClick={() => setInviteOpen(true)}>
          + Invite student
        </Button>
      }
    >
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ mb: 3, justifyContent: 'space-between', gap: 2 }}
        >
          <Box>
            <Typography variant="h6">Student directory</Typography>
            <Typography variant="body2" color="text.secondary">
              {students.length} students · {invitations.length} invitations
            </Typography>
          </Box>
          <TextField
            label="Search students"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ maxWidth: { sm: 290 } }}
          />
        </Stack>
        <DataTable
          rows={rows}
          emptyMessage={
            search
              ? 'No students match your search.'
              : 'No students yet. Invite your first learner.'
          }
          columns={[
            {
              key: 'name',
              label: 'Student',
              render: (user) => (
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: user.color, width: 36, height: 36, fontSize: 13 }}>
                    {user.initials}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Stack>
              ),
            },
            { key: 'studentLabel', label: 'Learning profile' },
            {
              key: 'completed',
              label: 'Evaluated attempts',
              render: (user) => user.attempts.length,
            },
            {
              key: 'average',
              label: 'Average score',
              render: (user) => (user.average === null ? '—' : `${user.average}%`),
            },
            {
              key: 'report',
              label: 'Report',
              render: (user) =>
                user.attempts.length ? (
                  <Link
                    component={RouterLink}
                    to={paths.cohortReport(
                      basePath,
                      user.id,
                      [...user.attempts].sort((a, b) => b.date.localeCompare(a.date))[0].id,
                    )}
                  >
                    View report ↗
                  </Link>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No report yet
                  </Typography>
                ),
            },
          ]}
        />
      </Paper>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Invitations
        </Typography>
        <DataTable
          rows={invitations.filter((invitation) => matches(invitation.email))}
          emptyMessage="No invitations to show."
          columns={[
            { key: 'email', label: 'Email address' },
            { key: 'status', label: 'Status', render: (row) => <StatusChip status={row.status} /> },
          ]}
        />
      </Paper>
      {inviteOpen && (
        <InviteDialog
          open
          onClose={() => setInviteOpen(false)}
          cohort={cohort}
          data={data}
          onInvite={handleInvite}
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
