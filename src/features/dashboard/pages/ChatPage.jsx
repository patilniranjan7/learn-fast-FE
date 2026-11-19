import { useEffect, useState } from 'react';
import { Box, Button, Chip, Paper, Stack, TextField, Typography } from '@mui/material';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import { Icon } from '../../../shared/components/Icon.jsx';
import { PageHeading } from '../../../shared/components/PageHeading.jsx';
import { paths } from '../../../routes/paths.js';
import { useDemoData } from '../hooks/useDemoData.js';
import { EmptyState } from '../components/EmptyState.jsx';
import { ConversationMessages } from '../components/chat/ConversationMessages.jsx';

const suggestions = [
  {
    title: 'Untangle a concept',
    text: 'Explain centripetal force with an everyday example.',
    icon: 'spark',
  },
  {
    title: 'Think it through',
    text: 'How should I approach a physics problem I have not seen before?',
    icon: 'book',
  },
  {
    title: 'Build a little confidence',
    text: 'Help me practise chemical bonding step by step.',
    icon: 'report',
  },
];

export function ChatPage() {
  const { chatId } = useParams();
  const { basePath } = useOutletContext();
  const navigate = useNavigate();
  const { data, viewerId, sendMessage, setActiveChatId } = useDemoData();
  const [message, setMessage] = useState('');
  const conversation = data.conversations.find(
    (chat) => chat.id === chatId && chat.userId === viewerId,
  );
  const viewer = data.users.find((user) => user.id === viewerId);

  useEffect(() => {
    setMessage('');
    if (conversation) setActiveChatId(conversation.id);
  }, [chatId, conversation?.id, setActiveChatId]);

  function submit(text) {
    const content = text.trim();
    if (!content) return;
    const id = sendMessage(chatId, content);
    setMessage('');
    if (id !== chatId) navigate(paths.chat(basePath, id), { replace: true });
  }

  if (chatId && !conversation)
    return (
      <EmptyState
        title="Conversation not found"
        description="This conversation is not available for the current sample account. Start a new chat from the drawer."
      />
    );

  const hasMessages = Boolean(conversation?.messages.length);

  return (
    <Stack sx={{ maxWidth: 880, mx: 'auto', minHeight: 'calc(100svh - 160px)' }}>
      {!hasMessages ? (
        <Stack
          spacing={2}
          sx={{ alignItems: 'center', textAlign: 'center', pt: { xs: 4, md: 8 }, pb: 5 }}
        >
          <Box
            sx={{
              width: 58,
              height: 58,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              bgcolor: 'brand.tile',
              color: 'primary.main',
              mb: 1,
            }}
          >
            <Icon name="spark" width={28} height={28} />
          </Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
            A little more curious, every day
          </Typography>
          <PageHeading title="Chat">What will you discover today?</PageHeading>
          <Typography color="text.secondary" sx={{ maxWidth: 470, lineHeight: 1.8 }}>
            Hi {viewer.name.split(' ')[0]}. Bring a tricky question, a half-formed idea, or a topic
            you want to understand a little better.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 2,
              width: '100%',
              pt: 3,
            }}
          >
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion.title}
                onClick={() => submit(suggestion.text)}
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  textAlign: 'left',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}
              >
                <Stack spacing={2}>
                  <Icon name={suggestion.icon} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {suggestion.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {suggestion.text}
                  </Typography>
                </Stack>
              </Button>
            ))}
          </Box>
        </Stack>
      ) : (
        <>
          <PageHeading title={conversation.title}>{conversation.title}</PageHeading>
          <ConversationMessages key={conversation.id} conversation={conversation} viewer={viewer} />
        </>
      )}
      <Box sx={{ mt: 'auto', pt: 3 }}>
        <Paper
          component="form"
          variant="outlined"
          onSubmit={(event) => {
            event.preventDefault();
            submit(message);
          }}
          sx={{ p: 2, borderRadius: 2.5, borderColor: 'brand.line' }}
        >
          <TextField
            label="Message your learning assistant"
            placeholder="Ask a question. Follow your curiosity."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            multiline
            minRows={2}
            maxRows={6}
            slotProps={{ htmlInput: { maxLength: 2000 } }}
            sx={{ '& fieldset': { border: 'none' }, '& .MuiInputBase-root': { p: 0 } }}
          />
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 1.5, justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Chip
              label="Sample responses"
              size="small"
              variant="outlined"
              sx={{ fontSize: 10, borderColor: 'divider' }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!message.trim()}
              endIcon={<Icon name="arrow" width={16} height={16} />}
            >
              Send message
            </Button>
          </Stack>
        </Paper>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', textAlign: 'center', mt: 1.5, fontSize: 10 }}
        >
          A preview of your learning space. Responses use sample content.
        </Typography>
      </Box>
    </Stack>
  );
}
