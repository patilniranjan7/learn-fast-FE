import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { AppRoutes } from '../../routes/AppRoutes.jsx';
import { theme } from '../../theme/theme.js';

const passage = 'ionic bond, electrons transfer';

function renderChat() {
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/admin/chat/chat-2']}>
        <AppRoutes />
      </MemoryRouter>
    </ThemeProvider>,
  );
  const message = screen
    .getByRole('log', { name: 'Conversation' })
    .querySelector('[data-message-id="m-4"]');
  const range = document.createRange();
  const start = message.textContent.indexOf(passage);
  range.setStart(message.firstChild, start);
  range.setEnd(message.firstChild, start + passage.length);
  range.getBoundingClientRect = () => ({
    top: 180,
    bottom: 200,
    left: 160,
    right: 360,
    width: 200,
    height: 20,
  });
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  fireEvent.pointerUp(document);
  return userEvent.setup();
}

async function chooseAction(user, name) {
  const menu = await screen.findByRole('menu', { name: 'Passage actions' });
  await user.click(within(menu).getByRole('menuitem', { name, exact: true }));
}

async function reopenAction(user, name) {
  await user.click(screen.getByRole('button', { name: /^Saved passage:/ }));
  await chooseAction(user, name);
}

afterEach(() => window.getSelection().removeAllRanges());

describe('highlight questions and notes', () => {
  it('sends a nonempty question and its quoted passage into the main conversation', async () => {
    const user = renderChat();
    const log = screen.getByRole('log', { name: 'Conversation' });
    const source = log.querySelector('[data-message-id="m-4"]');
    const original = source.textContent;
    await chooseAction(user, 'Ask more');
    const dialog = screen.getByRole('dialog', { name: 'Ask more' });
    within(dialog).getByText(passage, { exact: true });
    const send = within(dialog).getByRole('button', { name: 'Send', exact: true });
    expect(send.disabled).toBe(true);
    await user.type(within(dialog).getByRole('textbox', { name: 'Question' }), '   ');
    expect(send.disabled).toBe(true);

    const question = 'Why does transferring an electron reduce energy?';
    await user.type(within(dialog).getByRole('textbox', { name: 'Question' }), question);
    await user.click(send);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

    const followup = within(log).getByText(/About this passage:/);
    expect(followup.textContent).toContain(`“${passage}”`);
    expect(followup.textContent).toContain(question);
    expect(log.querySelectorAll('[data-assistant-message]').length).toBe(2);
    expect(source.textContent).toBe(original);
    expect(source.querySelectorAll('mark').length).toBe(1);
  });

  it('saves and edits a personal note without adding an assistant reply', async () => {
    const user = renderChat();
    const log = screen.getByRole('log', { name: 'Conversation' });
    const original = log.textContent;
    await chooseAction(user, 'Add note');
    let dialog = screen.getByRole('dialog', { name: 'Your note' });
    within(dialog).getByText(passage, { exact: true });
    const note = 'Compare electron transfer with sharing in a covalent bond.';
    await user.type(within(dialog).getByRole('textbox', { name: 'Your note' }), note);
    await user.click(within(dialog).getByRole('button', { name: 'Save note' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(log.textContent).toBe(original);
    expect(log.querySelectorAll('[data-assistant-message]').length).toBe(1);

    await reopenAction(user, 'Add note');
    dialog = screen.getByRole('dialog', { name: 'Your note' });
    expect(within(dialog).getByRole('textbox', { name: 'Your note' }).value).toBe(note);
    await user.clear(within(dialog).getByRole('textbox', { name: 'Your note' }));
    await user.type(within(dialog).getByRole('textbox', { name: 'Your note' }), 'Unsaved draft');
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await reopenAction(user, 'Add note');
    expect(screen.getByRole('textbox', { name: 'Your note' }).value).toBe(note);
    expect(log.textContent).toBe(original);
  });
});

describe('highlight side conversation', () => {
  it('keeps followups separate and restores their source passage and messages on reopen', async () => {
    const user = renderChat();
    const mainLog = screen.getByRole('log', { name: 'Conversation' });
    const original = mainLog.textContent;
    await chooseAction(user, 'Create side conversation');
    let panel = screen.getByRole('dialog', { name: 'Side conversation' });
    within(panel).getByText(passage, { exact: true });
    const send = within(panel).getByRole('button', { name: 'Send to side conversation' });
    expect(send.disabled).toBe(true);
    const question = 'Can we work through sodium and chlorine?';
    await user.type(
      within(panel).getByRole('textbox', { name: 'Message in side conversation' }),
      question,
    );
    await user.click(send);
    const sideLog = within(panel).getByRole('log', { name: 'Side conversation messages' });
    within(sideLog).getByText(question);
    expect(sideLog.textContent).toContain('Learning assistant');
    expect(mainLog.textContent).toBe(original);
    expect(within(mainLog).queryByText(question)).toBeNull();
    await user.click(within(panel).getByRole('button', { name: 'Close side conversation' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

    await reopenAction(user, 'Create side conversation');
    panel = screen.getByRole('dialog', { name: 'Side conversation' });
    within(panel).getByText(passage, { exact: true });
    within(panel).getByText(question);
    await user.click(within(panel).getByRole('button', { name: 'Back to source' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    screen.getByRole('button', { name: `Saved passage: ${passage}` });
    expect(mainLog.textContent).toBe(original);
  });
});
