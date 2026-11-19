import { Box } from '@mui/material';

export function HighlightedMessage({ content, highlights, onOpen }) {
  const parts = [];
  let offset = 0;
  const ordered = [...highlights].sort((first, second) => first.start - second.start);
  for (const highlight of ordered) {
    if (
      highlight.start < offset ||
      content.slice(highlight.start, highlight.end) !== highlight.text
    )
      continue;
    parts.push(content.slice(offset, highlight.start));
    parts.push(
      <Box
        key={highlight.id}
        component="mark"
        id={`passage-${highlight.id}`}
        role="button"
        tabIndex={0}
        aria-label={`Saved passage: ${highlight.text}${highlight.note ? '. Note attached' : ''}`}
        onClick={(event) => {
          if (!window.getSelection()?.toString())
            onOpen(highlight, event.currentTarget.getBoundingClientRect());
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpen(highlight, event.currentTarget.getBoundingClientRect());
          }
        }}
        sx={{
          bgcolor: 'brand.insight',
          color: 'inherit',
          borderRadius: 0.5,
          cursor: 'pointer',
          '&::after': highlight.note
            ? { content: '" •"', color: 'primary.main', fontWeight: 700 }
            : undefined,
        }}
      >
        {highlight.text}
      </Box>,
    );
    offset = highlight.end;
  }
  parts.push(content.slice(offset));
  return parts;
}
