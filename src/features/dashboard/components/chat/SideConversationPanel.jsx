import { useEffect, useId, useRef, useState } from 'react';
import { Box, Button, Chip, Divider, Drawer, Stack, TextField, Typography } from '@mui/material';
import { SelectedQuote } from './SelectedQuote.jsx';

function SideComposer({ onSend }) {
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const content = message.trim();
    if (!content) return;
    onSend(content);
    setMessage('');
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={1.5} sx={{ p: 2.5 }}>
      <TextField
        label="Message in side conversation"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        multiline
        minRows={2}
        maxRows={5}
        fullWidth
        slotProps={{ htmlInput: { maxLength: 2000 } }}
      />
      <Button type="submit" variant="contained" disabled={!message.trim()}>
        Send to side conversation
      </Button>
    </Stack>
  );
}

export function SideConversationPanel({
  open,
  highlight,
  messages = [],
  onClose,
  onSend,
  onBackToSource,
}) {
  const titleId = useId();
  const messagesEnd = useRef(null);

  useEffect(() => {
    if (open) messagesEnd.current?.scrollIntoView?.({ block: 'nearest' });
  }, [open, messages.length]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          role: 'dialog',
          'aria-modal': true,
          'aria-labelledby': titleId,
          sx: { width: { xs: '100%', sm: 420 }, maxWidth: '100%', height: '100dvh' },
        },
      }}
    >
      <Stack sx={{ height: '100%', minHeight: 0 }}>
        <Stack spacing={2} sx={{ p: 2.5, flexShrink: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography id={titleId} component="h2" variant="h6" sx={{ flex: 1 }}>
              Side conversation
            </Typography>
            <Button color="inherit" onClick={onClose} aria-label="Close side conversation">
              Close
            </Button>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip label="Sample responses" size="small" variant="outlined" />
            <Button size="small" onClick={onBackToSource}>
              Back to source
            </Button>
          </Stack>
          <SelectedQuote text={highlight?.text || ''} />
        </Stack>
        <Divider />
        <Box
          role="log"
          aria-label="Side conversation messages"
          aria-live="polite"
          aria-relevant="additions text"
          sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 2.5 }}
        >
          {messages.length ? (
            <Stack spacing={2.5}>
              {messages.map((message) => (
                <Box key={message.id}>
                  <Typography variant="caption" sx={{ fontWeight: 650 }}>
                    {message.role === 'assistant' ? 'Learning assistant' : 'You'}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 0.75,
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'anywhere',
                      lineHeight: 1.8,
                    }}
                  >
                    {message.content}
                  </Typography>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Explore the selected passage here. Questions and sample replies stay in this side
              conversation, and you can reopen it from the highlight.
            </Typography>
          )}
          <Box ref={messagesEnd} />
        </Box>
        <Divider />
        <SideComposer key={highlight?.id} onSend={onSend} />
      </Stack>
    </Drawer>
  );
}
