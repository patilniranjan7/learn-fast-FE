import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { AppRoutes } from '../../routes/AppRoutes.jsx';
import { theme } from '../../theme/theme.js';

const passage = 'ionic bond, electrons transfer';
const actions = ['Ask more', 'Add note', 'Create side conversation', 'Learn later'];

function RouteControls() {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate('/user/2/chat/chat-2')}>Other learner</button>
      <button onClick={() => navigate('/user/1/chat/chat-2')}>Owner conversation</button>
    </>
  );
}

function renderChat() {
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/admin/chat/chat-2']}>
        <AppRoutes />
        <RouteControls />
      </MemoryRouter>
    </ThemeProvider>,
  );
  return userEvent.setup();
}

function selectText(element, text, event = 'pointerUp') {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const start = element.textContent.indexOf(text);
  const end = start + text.length;
  const range = document.createRange();
  let offset = 0;
  let node = walker.nextNode();
  while (node) {
    const next = offset + node.textContent.length;
    if (offset <= start && start < next) range.setStart(node, start - offset);
    if (offset < end && end <= next) {
      range.setEnd(node, end - offset);
      break;
    }
    offset = next;
    node = walker.nextNode();
  }
  range.getBoundingClientRect = () => ({
    top: 200,
    bottom: 220,
    left: 140,
    right: 360,
    width: 220,
    height: 20,
  });
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  fireEvent[event](document, event === 'keyUp' ? { key: 'Shift' } : {});
}

function assistantMessage() {
  return screen.getByRole('log', { name: 'Conversation' }).querySelector('[data-message-id="m-4"]');
}

afterEach(() => window.getSelection().removeAllRanges());

describe('saved assistant passages', () => {
  it('offers all four actions only for an assistant passage without changing its text', async () => {
    renderChat();
    const log = screen.getByRole('log', { name: 'Conversation' });
    selectText(within(log).getByText('Why do atoms form chemical bonds?'), 'atoms');
    expect(screen.queryByRole('menu', { name: 'Passage actions' })).toBeNull();

    const message = assistantMessage();
    const original = message.textContent;
    selectText(message, passage);
    const menu = await screen.findByRole('menu', { name: 'Passage actions' });

    expect(
      within(menu)
        .getAllByRole('menuitem')
        .map((item) => item.textContent),
    ).toEqual(actions);
    expect(message.textContent).toBe(original);
    expect(screen.getByRole('button', { name: `Saved passage: ${passage}` }).textContent).toBe(
      passage,
    );
  });

  it('opens from keyboard selection, dismisses with Escape, and reopens a saved mark', async () => {
    const user = renderChat();
    selectText(assistantMessage(), passage, 'keyUp');
    await screen.findByRole('menu', { name: 'Passage actions' });
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu', { name: 'Passage actions' })).toBeNull();

    const mark = screen.getByRole('button', { name: `Saved passage: ${passage}` });
    mark.focus();
    await user.keyboard('{Enter}');
    const menu = await screen.findByRole('menu', { name: 'Passage actions' });
    within(menu).getByRole('menuitem', { name: 'Learn later' });
  });

  it('does not turn a selection spanning user and assistant messages into a highlight', () => {
    renderChat();
    const log = screen.getByRole('log', { name: 'Conversation' });
    const userText = within(log).getByText('Why do atoms form chemical bonds?').firstChild;
    const assistantText = assistantMessage().firstChild;
    const range = document.createRange();
    range.setStart(userText, 0);
    range.setEnd(assistantText, 10);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    fireEvent.pointerUp(document);

    expect(screen.queryByRole('menu', { name: 'Passage actions' })).toBeNull();
    expect(screen.queryByRole('button', { name: /^Saved passage:/ })).toBeNull();
  });

  it('restores a saved passage after navigation while isolating another learner', async () => {
    const user = renderChat();
    selectText(assistantMessage(), passage);
    await screen.findByRole('menu', { name: 'Passage actions' });
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: 'Other learner' }));
    await screen.findByRole('heading', { name: 'Conversation not found' });
    expect(screen.queryByRole('button', { name: /^Saved passage:/ })).toBeNull();
    expect(screen.queryByRole('log', { name: 'Conversation' })).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Owner conversation' }));
    const mark = await screen.findByRole('button', { name: `Saved passage: ${passage}` });
    await user.click(mark);
    await screen.findByRole('menu', { name: 'Passage actions' });
    expect(assistantMessage().querySelectorAll('mark').length).toBe(1);
  });
});
