import { useId } from 'react';
import { Box, Stack, Typography, useTheme } from '@mui/material';

export function ScoreTrend({ points, title = 'Average score over time' }) {
  const theme = useTheme();
  const titleId = useId();
  const descriptionId = useId();
  const width = 720;
  const height = 250;
  const left = 44;
  const right = 26;
  const top = 20;
  const bottom = 45;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const x = (index) =>
    points.length === 1 ? left + plotWidth / 2 : left + (index / (points.length - 1)) * plotWidth;
  const y = (score) => top + ((100 - score) / 100) * plotHeight;
  const coordinates = points.map((point, index) => `${x(index)},${y(point.score)}`).join(' ');

  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack direction="row" sx={{ mb: 2, justifyContent: 'space-between' }}>
        <Typography component="h2" variant="subtitle1" sx={{ fontWeight: 650 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Score %
        </Typography>
      </Stack>
      <Box
        component="svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-labelledby={`${titleId} ${descriptionId}`}
        sx={{ display: 'block', width: '100%', overflow: 'visible' }}
      >
        <title id={titleId}>{title}</title>
        <desc id={descriptionId}>
          {points.length
            ? points.map((point) => `${point.label}: ${point.score}%`).join('. ')
            : 'No evaluated attempts yet.'}{' '}
          The table below includes the same values.
        </desc>
        {[0, 25, 50, 75, 100].map((tick) => (
          <g key={tick}>
            <line
              x1={left}
              x2={width - right}
              y1={y(tick)}
              y2={y(tick)}
              stroke={theme.palette.divider}
              strokeDasharray="4 5"
            />
            <text
              x={left - 12}
              y={y(tick) + 4}
              textAnchor="end"
              fontSize="11"
              fill={theme.palette.text.secondary}
            >
              {tick}
            </text>
          </g>
        ))}
        {points.length > 1 && (
          <polyline
            points={coordinates}
            fill="none"
            stroke={theme.palette.primary.main}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        )}
        {points.map((point, index) => (
          <g key={point.id}>
            <circle
              cx={x(index)}
              cy={y(point.score)}
              r="5"
              fill={theme.palette.background.paper}
              stroke={theme.palette.primary.main}
              strokeWidth="3"
            >
              <title>{`${point.label}: ${point.score}%`}</title>
            </circle>
            <text
              x={x(index)}
              y={height - 14}
              textAnchor="middle"
              fontSize="11"
              fill={theme.palette.text.secondary}
            >
              {index + 1}
            </text>
          </g>
        ))}
      </Box>
    </Box>
  );
}
