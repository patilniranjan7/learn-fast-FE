import { Box, Typography } from '@mui/material';

export function SelectedQuote({ text }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 650 }}>
        Selected passage
      </Typography>
      <Box
        component="blockquote"
        sx={{
          m: 0,
          mt: 0.75,
          px: 2,
          py: 1.5,
          borderLeft: 3,
          borderColor: 'primary.main',
          borderRadius: 1,
          bgcolor: 'brand.paper',
          maxHeight: 180,
          overflowY: 'auto',
        }}
      >
        <Typography
          variant="body2"
          sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
}
