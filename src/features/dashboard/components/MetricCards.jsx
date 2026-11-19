import { Box, Paper, Typography } from '@mui/material';

export function MetricCards({ items }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: `repeat(${Math.min(items.length, 4)}, minmax(0, 1fr))`,
        },
        gap: 2,
      }}
    >
      {items.map(({ label, value, detail }) => (
        <Paper key={label} variant="outlined" sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography
            component="p"
            sx={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 36,
              letterSpacing: '-0.04em',
              my: 1,
            }}
          >
            {value}
          </Typography>
          {detail && (
            <Typography variant="caption" color="text.secondary">
              {detail}
            </Typography>
          )}
        </Paper>
      ))}
    </Box>
  );
}
