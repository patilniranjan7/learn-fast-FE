import { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Snackbar, Stack, Typography } from '@mui/material';
import { useLocation } from 'react-router';
import { Icon } from '../../../../shared/components/Icon.jsx';
import { useDemoData } from '../../hooks/useDemoData.js';
import { usePassageSelection } from '../../hooks/usePassageSelection.js';
import { HighlightedMessage } from './HighlightedMessage.jsx';
import { PassageActionsMenu } from './PassageActionsMenu.jsx';
import { HighlightActionDialog } from './HighlightActionDialog.jsx';
import { LearnLaterDialog } from './LearnLaterDialog.jsx';
import { SideConversationPanel } from './SideConversationPanel.jsx';

export function ConversationMessages({ conversation, viewer }) {
  const container = useRef(null);
  const { hash } = useLocation();
  const [targetId, setTargetId] = useState(null);
  const [anchor, setAnchor] = useState(null);
  const [action, setAction] = useState(null);
  const [notice, setNotice] = useState('');
  const {
    data,
    viewerId,
    saveHighlight,
    updateHighlightNote,
    sendMessage,
    sendSideMessage,
    saveHighlightReminder,
  } = useDemoData();
  const highlights = data.highlights.filter(
    (item) => item.chatId === conversation.id && item.userId === viewerId,
  );
  const target = highlights.find((item) => item.id === targetId);

  useEffect(() => {
    if (!hash.startsWith('#passage-')) return;
    const frame = requestAnimationFrame(() => {
      const source = document.getElementById(hash.slice(1));
      if (source && container.current?.contains(source)) {
        source.scrollIntoView?.({ block: 'center' });
        source.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, conversation.id]);

  function openActions(highlight, rect) {
    setTargetId(highlight.id);
    setAnchor({ top: Math.round(rect.bottom + 8), left: Math.round(rect.left) });
  }

  function closeMenu() {
    setAnchor(null);
    window.getSelection()?.removeAllRanges();
  }

  usePassageSelection(
    container,
    (passage) => {
      const highlight = saveHighlight({ ...passage, chatId: conversation.id });
      if (highlight) openActions(highlight, passage.rect);
    },
    () => {
      if (anchor) closeMenu();
    },
  );

  function chooseAction(nextAction) {
    closeMenu();
    setAction(nextAction);
  }

  function submitText(value) {
    if (action === 'ask') {
      sendMessage(conversation.id, `About this passage:\n“${target.text}”\n\n${value}`);
    } else {
      updateHighlightNote(target.id, value);
      setNotice(
        value ? 'Note saved with this passage.' : 'Note removed. Your highlight is still saved.',
      );
    }
    setAction(null);
  }

  function savePlan(values) {
    saveHighlightReminder(target.id, values);
    setAction(null);
    setNotice('Learning plan saved to Revision Plan.');
  }

  function backToSource() {
    setAction(null);
    requestAnimationFrame(() => {
      const source = document.getElementById(`passage-${target.id}`);
      source?.scrollIntoView?.({ block: 'center' });
      source?.focus({ preventScroll: true });
    });
  }

  return (
    <>
      <Stack ref={container} role="log" aria-label="Conversation" spacing={3} sx={{ my: 4 }}>
        {conversation.messages.map((message) => (
          <Stack key={message.id} direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
            <Avatar
              sx={{
                width: 30,
                height: 30,
                flexShrink: 0,
                bgcolor: message.role === 'assistant' ? 'primary.main' : 'brand.tile',
                color: message.role === 'assistant' ? 'background.paper' : 'primary.main',
                fontSize: 11,
              }}
            >
              {message.role === 'assistant' ? (
                <Icon name="spark" width={17} height={17} />
              ) : (
                viewer.initials
              )}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" sx={{ fontWeight: 650 }}>
                {message.role === 'assistant' ? 'Learning assistant' : 'You'}
              </Typography>
              <Typography
                component="div"
                data-assistant-message={message.role === 'assistant' ? 'true' : undefined}
                data-message-id={message.id}
                sx={{
                  mt: 0.75,
                  lineHeight: 1.85,
                  fontSize: 14,
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                  userSelect: 'text',
                }}
              >
                {message.role === 'assistant' ? (
                  <HighlightedMessage
                    content={message.content}
                    highlights={highlights.filter((item) => item.messageId === message.id)}
                    onOpen={openActions}
                  />
                ) : (
                  message.content
                )}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
      <PassageActionsMenu
        anchor={anchor}
        highlight={target}
        onClose={closeMenu}
        onAction={chooseAction}
      />
      {target && (action === 'ask' || action === 'note') && (
        <HighlightActionDialog
          key={`${action}-${target.id}`}
          action={action}
          highlight={target}
          onClose={() => setAction(null)}
          onSubmit={submitText}
        />
      )}
      {target && action === 'later' && (
        <LearnLaterDialog highlight={target} onClose={() => setAction(null)} onSave={savePlan} />
      )}
      {target && (
        <SideConversationPanel
          open={action === 'side'}
          highlight={target}
          messages={target.sideMessages}
          onClose={() => setAction(null)}
          onSend={(text) => sendSideMessage(target.id, text)}
          onBackToSource={backToSource}
        />
      )}
      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={4000}
        onClose={() => setNotice('')}
        message={notice}
      />
    </>
  );
}
