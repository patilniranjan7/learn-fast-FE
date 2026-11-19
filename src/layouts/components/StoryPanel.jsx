import { Box, Typography } from '@mui/material';
import { appConfig } from '../../shared/config/appConfig.js';
import { KnowledgeIllustration } from './KnowledgeIllustration.jsx';

export function StoryPanel({ brand }) {
  return (
    <Box
      component="section"
      aria-label={`About ${appConfig.companyName}`}
      sx={{
        bgcolor: 'brand.dark',
        color: 'brand.onDark',
        p: { xs: 3, md: 5, lg: 6 },
        pb: { md: 4 },
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {brand}
      <Box sx={{ width: '100%', maxWidth: 475, mx: 'auto', mt: { xs: 4, md: 9 }, mb: 3 }}>
        <Typography
          sx={{
            fontSize: { xs: 8, lg: 9 },
            fontWeight: 600,
            letterSpacing: 1.5,
            color: 'brand.muted',
          }}
        >
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              width: 5,
              height: 5,
              bgcolor: 'brand.highlight',
              borderRadius: '50%',
              mr: 1,
            }}
          />
          A LITTLE CURIOSITY. ENDLESS POSSIBILITY.
        </Typography>
        <Typography
          component="p"
          variant="h1"
          sx={{ fontSize: { xs: 39, md: 44, lg: 58 }, mt: 3, mb: 2.5 }}
        >
          Your knowledge.
          <br />
          Woven together.
        </Typography>
        <Typography
          sx={{
            color: 'brand.muted',
            fontSize: { xs: 13, md: 15 },
            lineHeight: 1.8,
            maxWidth: 365,
          }}
        >
          Bring your books, notes, and questions into one place. Make every moment of learning
          connect.
        </Typography>
        <KnowledgeIllustration />
      </Box>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 1.5,
          mt: 'auto',
          color: 'brand.muted',
        }}
      >
        <Box sx={{ width: 25, height: '1px', bgcolor: 'brand.muted' }} />
        <Typography sx={{ fontSize: 10 }}>A space for your next big idea.</Typography>
      </Box>
    </Box>
  );
}
