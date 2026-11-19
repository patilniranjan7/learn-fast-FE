import { Box } from '@mui/material';
import { Icon } from '../../shared/components/Icon.jsx';
import {
  CardBottom,
  CardTop,
  Illustration,
  KnowledgeCard,
  Lines,
  MiniCard,
  Orbit,
  Tile,
} from './KnowledgeIllustration.styles.js';

export function KnowledgeIllustration() {
  return (
    <Illustration aria-hidden="true">
      <Orbit />
      <Orbit />
      <MiniCard style={{ left: 6, top: 28, transform: 'rotate(-7deg)' }}>
        <Tile>
          <Icon name="book" />
        </Tile>
        <div>
          <strong>Your library</strong>
          <small>Ideas worth keeping</small>
        </div>
        <Box
          sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'brand.highlight', ml: 1.5 }}
        />
      </MiniCard>
      <KnowledgeCard>
        <CardTop>
          <Tile>
            <Icon name="spark" width="16" />
          </Tile>
          <span>THE BIG PICTURE</span>
          <span>•••</span>
        </CardTop>
        <h2>
          Small discoveries.
          <br />
          Deeper understanding.
        </h2>
        <Lines>
          <i />
          <i />
          <i />
        </Lines>
        <CardBottom>
          <Icon name="check" width="13" height="13" />
          Connected to your learning
        </CardBottom>
      </KnowledgeCard>
      <MiniCard
        as={Box}
        sx={{ right: 0, bottom: 4, transform: 'rotate(5deg)', bgcolor: 'brand.insight' }}
      >
        <Box component="span" sx={{ fontSize: 31 }}>
          ✧
        </Box>
        <div>
          <strong>That “aha!” feeling</strong>
          <small>One connection at a time</small>
        </div>
      </MiniCard>
      <Box
        sx={{ position: 'absolute', right: 21, top: 40, fontSize: 33, color: 'brand.highlight' }}
      >
        ✳
      </Box>
      <Box
        sx={{ position: 'absolute', left: 18, bottom: 27, fontSize: 24, color: 'brand.highlight' }}
      >
        +
      </Box>
    </Illustration>
  );
}
