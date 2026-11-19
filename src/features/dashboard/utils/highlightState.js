function ownedHighlight(data, viewerId, id) {
  return data.highlights.find((item) => item.id === id && item.userId === viewerId);
}

function replaceHighlight(data, record) {
  return {
    data: {
      ...data,
      highlights: data.highlights.map((item) => (item.id === record.id ? record : item)),
    },
    record,
  };
}

/** Returns the existing overlapping record, a new record, or null for an invalid selection. */
export function saveHighlightState(data, viewerId, selection, id) {
  if (!selection || typeof selection !== 'object') return null;
  const { chatId, messageId, start, end, text } = selection;
  const conversation = data.conversations.find(
    (chat) => chat.id === chatId && chat.userId === viewerId,
  );
  const message = conversation?.messages.find((item) => item.id === messageId);
  if (
    message?.role !== 'assistant' ||
    typeof text !== 'string' ||
    !text.trim() ||
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 0 ||
    end <= start ||
    end > message.content.length ||
    message.content.slice(start, end) !== text
  ) {
    return null;
  }

  const existing = data.highlights.find(
    (item) =>
      item.userId === viewerId &&
      item.chatId === chatId &&
      item.messageId === messageId &&
      start < item.end &&
      end > item.start,
  );
  if (existing) return { data, record: existing };

  const record = {
    id,
    userId: viewerId,
    chatId,
    messageId,
    start,
    end,
    text,
    note: '',
    sideMessages: [],
    reminder: null,
  };
  return { data: { ...data, highlights: [...data.highlights, record] }, record };
}

export function updateHighlightNoteState(data, viewerId, id, note) {
  const highlight = ownedHighlight(data, viewerId, id);
  if (!highlight || typeof note !== 'string') return null;
  return replaceHighlight(data, { ...highlight, note });
}

export function sendSideMessageState(data, viewerId, id, text, messageIds) {
  const highlight = ownedHighlight(data, viewerId, id);
  if (!highlight || typeof text !== 'string' || !text.trim()) return null;
  return replaceHighlight(data, {
    ...highlight,
    sideMessages: [
      ...highlight.sideMessages,
      { id: messageIds[0], role: 'user', content: text.trim() },
      {
        id: messageIds[1],
        role: 'assistant',
        content:
          'This is a sample side discussion about your highlighted passage. Try explaining the idea in your own words, then connect it to a simple example. Live answers will be available when the learning library is connected.',
      },
    ],
  });
}

export function saveHighlightReminderState(data, viewerId, id, values, revisionId) {
  const highlight = ownedHighlight(data, viewerId, id);
  if (!highlight || !values || typeof values !== 'object') return null;
  const { date, time, timeZone } = values;
  if ([date, time, timeZone].some((value) => typeof value !== 'string' || !value.trim())) {
    return null;
  }

  const existing = data.revisions.find(
    (item) => item.userId === viewerId && item.source?.highlightId === id,
  );
  const revision = {
    id: existing?.id || revisionId,
    userId: viewerId,
    title: `Learn: ${highlight.text}`.slice(0, 120),
    description: highlight.text,
    date,
    time,
    timeZone,
    completed: false,
    origin: 'Highlighted passage',
    source: { chatId: highlight.chatId, messageId: highlight.messageId, highlightId: id },
  };
  const result = replaceHighlight(data, {
    ...highlight,
    reminder: { date, time, timeZone, revisionId: revision.id },
  });
  return {
    ...result,
    data: {
      ...result.data,
      revisions: existing
        ? data.revisions.map((item) => (item.id === revision.id ? revision : item))
        : [...data.revisions, revision],
    },
  };
}
