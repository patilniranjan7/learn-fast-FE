import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { formatDate, localDate, monthDays, shiftMonth } from '../utils/revisionDates.js';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function RevisionCalendar({ month, onMonthChange, revisions, onSelect, onCreate }) {
  const today = localDate();
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: 3 }}>
      <Stack
        direction="row"
        sx={{
          p: { xs: 2, md: 3 },
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="h6">
          {formatDate(month, { month: 'long', day: undefined, year: 'numeric' })}
        </Typography>
        <Stack direction="row" spacing={0.5}>
          <Button
            aria-label="Previous month"
            onClick={() => onMonthChange(shiftMonth(month, -1))}
            sx={{ minWidth: 36 }}
          >
            ←
          </Button>
          <Button onClick={() => onMonthChange(today)}>Today</Button>
          <Button
            aria-label="Next month"
            onClick={() => onMonthChange(shiftMonth(month, 1))}
            sx={{ minWidth: 36 }}
          >
            →
          </Button>
        </Stack>
      </Stack>
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: 650 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              bgcolor: 'background.default',
            }}
          >
            {weekdays.map((day) => (
              <Typography key={day} variant="caption" sx={{ py: 1.5, px: 2, fontWeight: 700 }}>
                {day}
              </Typography>
            ))}
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
            {monthDays(month).map((date) => {
              const items = revisions.filter((revision) => revision.date === date);
              const inMonth = date.slice(0, 7) === month.slice(0, 7);
              return (
                <Box
                  key={date}
                  sx={{
                    minHeight: 136,
                    p: 1,
                    borderTop: 1,
                    borderRight: 1,
                    borderColor: 'divider',
                    bgcolor: inMonth ? 'background.paper' : 'background.default',
                  }}
                >
                  <Button
                    onClick={() => onCreate(date)}
                    aria-label={`Plan a revision for ${formatDate(date)}`}
                    sx={{
                      minWidth: 30,
                      width: 30,
                      height: 30,
                      p: 0,
                      mb: 0.5,
                      borderRadius: '50%',
                      color:
                        date === today
                          ? 'primary.contrastText'
                          : inMonth
                            ? 'text.primary'
                            : 'text.secondary',
                      bgcolor: date === today ? 'primary.main' : 'transparent',
                    }}
                  >
                    {Number(date.slice(8))}
                  </Button>
                  <Stack spacing={0.5}>
                    {items.map((revision) => (
                      <Chip
                        key={revision.id}
                        label={`${revision.completed ? '✓ ' : ''}${revision.title}`}
                        onClick={() => onSelect(revision)}
                        aria-label={`Edit ${revision.title}, ${revision.completed ? 'completed' : 'planned'}`}
                        size="small"
                        sx={{
                          width: '100%',
                          justifyContent: 'flex-start',
                          bgcolor: revision.completed ? 'action.selected' : 'brand.insight',
                          '& .MuiChip-label': {
                            textDecoration: revision.completed ? 'line-through' : 'none',
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
