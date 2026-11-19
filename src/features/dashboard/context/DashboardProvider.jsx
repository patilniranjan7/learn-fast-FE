import { useRef, useState } from 'react';
import { createSampleData } from '../data/sampleData.js';
import {
  saveHighlightState,
  saveHighlightReminderState,
  sendSideMessageState,
  updateHighlightNoteState,
} from '../utils/highlightState.js';
import { DashboardContext } from './DashboardContext.js';

const makeId = () => crypto.randomUUID();

export function DashboardProvider({ children }) {
  const [data, setDataState] = useState(createSampleData);
  const dataRef = useRef(data);
  const [viewerId, setViewerId] = useState('1');
  const [activeChatId, setActiveChatId] = useState(null);

  // Event handlers share pending updates so a saved selection can return its ID immediately.
  function setData(update) {
    const next = typeof update === 'function' ? update(dataRef.current) : update;
    dataRef.current = next;
    setDataState(next);
  }

  function applyHighlightAction(action, ...args) {
    const result = action(dataRef.current, viewerId, ...args);
    if (!result) return null;
    if (result.data !== dataRef.current) setData(result.data);
    return result.record;
  }

  function saveHighlight(selection) {
    return applyHighlightAction(saveHighlightState, selection, makeId());
  }

  function updateHighlightNote(id, note) {
    return applyHighlightAction(updateHighlightNoteState, id, note);
  }

  function sendSideMessage(id, text) {
    return applyHighlightAction(sendSideMessageState, id, text, [makeId(), makeId()]);
  }

  function saveHighlightReminder(id, values) {
    return applyHighlightAction(saveHighlightReminderState, id, values, makeId());
  }

  function addRecord(collection, values) {
    const record = { ...values, id: makeId() };
    setData((current) => ({ ...current, [collection]: [...current[collection], record] }));
    return record;
  }

  function addRevision(values) {
    return addRecord('revisions', { completed: false, ...values });
  }

  function updateRevision(id, changes) {
    setData((current) => {
      const existing = current.revisions.find((item) => item.id === id);
      if (!existing) return current;
      const revision = { ...existing, ...changes };
      return {
        ...current,
        revisions: current.revisions.map((item) => (item.id === id ? revision : item)),
        highlights: revision.source?.highlightId
          ? current.highlights.map((item) =>
              item.id === revision.source.highlightId
                ? {
                    ...item,
                    reminder: {
                      ...item.reminder,
                      date: revision.date,
                      time: revision.time,
                      timeZone: revision.timeZone,
                    },
                  }
                : item,
            )
          : current.highlights,
      };
    });
  }

  function addInvitation(values) {
    return addRecord('invitations', { ...values, status: 'Pending' });
  }

  function addTest(values) {
    return addRecord('tests', { ...values, status: 'Draft' });
  }

  function createOrganisation(values) {
    return addRecord('organisations', values);
  }

  function createCohort(values) {
    return addRecord('cohorts', { studentIds: [], ...values });
  }

  function newChat() {
    const conversation = addRecord('conversations', {
      userId: viewerId,
      title: 'New conversation',
      messages: [],
    });
    setActiveChatId(conversation.id);
    return conversation;
  }

  function sendMessage(chatId, text) {
    const existing = data.conversations.find(
      (chat) => chat.id === chatId && chat.userId === viewerId,
    );
    const id = existing?.id || makeId();
    const messages = [
      { id: makeId(), role: 'user', content: text },
      {
        id: makeId(),
        role: 'assistant',
        content:
          'Let’s work through it together. Start by identifying what you already know, what the question asks, and the principle that connects them. Try writing a small example or drawing a diagram.\n\nThis is a sample response for exploring the dashboard. Live answers and citations will be available when the learning library is connected.',
      },
    ];
    setData((current) => {
      const conversation = current.conversations.find((chat) => chat.id === id);
      const next = conversation
        ? {
            ...conversation,
            title: conversation.messages.length ? conversation.title : text.slice(0, 48),
            messages: [...conversation.messages, ...messages],
          }
        : { id, userId: viewerId, title: text.slice(0, 48), messages };
      return {
        ...current,
        conversations: conversation
          ? current.conversations.map((chat) => (chat.id === id ? next : chat))
          : [...current.conversations, next],
      };
    });
    setActiveChatId(id);
    return id;
  }

  function selectViewer(id) {
    if (id !== viewerId) {
      setViewerId(id);
      setActiveChatId(null);
    }
  }

  function resetDemo() {
    setData(createSampleData());
    setViewerId('1');
    setActiveChatId(null);
  }

  return (
    <DashboardContext.Provider
      value={{
        data,
        viewerId,
        selectViewer,
        activeChatId,
        setActiveChatId,
        addRevision,
        updateRevision,
        addInvitation,
        addTest,
        createOrganisation,
        createCohort,
        newChat,
        sendMessage,
        saveHighlight,
        updateHighlightNote,
        sendSideMessage,
        saveHighlightReminder,
        resetDemo,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
