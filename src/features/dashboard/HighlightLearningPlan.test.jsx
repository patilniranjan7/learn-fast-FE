import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { AppRoutes } from '../../routes/AppRoutes.jsx';
import { theme } from '../../theme/theme.js';

const passage = 'ionic bond, electrons transfer';

function RouteControls() {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate('/user/1/revisions')}>Open learning plan</button>
      <button onClick={() => navigate('/user/1/chat/chat-2')}>Return to conversation</button>
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
  const message = screen
    .getByRole('log', { name: 'Conversation' })
    .querySelector('[data-message-id="m-4"]');
  const start = message.textContent.indexOf(passage);
  const range = document.createRange();
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

async function openLearningDialog(user) {
  const menu = await screen.findByRole('menu', { name: 'Passage actions' });
  await user.click(within(menu).getByRole('menuitem', { name: 'Learn later' }));
  return screen.getByRole('dialog', { name: 'Learn later' });
}

function setSchedule(dialog, date, time) {
  fireEvent.change(within(dialog).getByLabelText(/Learning date/), { target: { value: date } });
  fireEvent.change(within(dialog).getByLabelText(/Learning time/), { target: { value: time } });
}

afterEach(() => window.getSelection().removeAllRanges());

describe('learning later from a saved passage', () => {
  it('requires a future schedule and shows separate disconnected delivery statuses', async () => {
    const user = renderChat();
    const dialog = await openLearningDialog(user);
    within(dialog).getByText(passage, { exact: true });
    within(dialog).getByText('WhatsApp · Not connected');
    within(dialog).getByText('Google Calendar · Not connected');
    expect(within(dialog).getByRole('alert').textContent).toContain(
      'no message or calendar event will be created',
    );
    expect(dialog.textContent).toContain(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const save = within(dialog).getByRole('button', { name: 'Save learning plan' });
    setSchedule(dialog, '', '');
    await user.click(save);
    within(dialog).getByText('Choose a valid learning date.');
    within(dialog).getByText('Choose a valid learning time.');
    setSchedule(dialog, '2000-01-01', '09:00');
    await user.click(save);
    within(dialog).getByText('Choose a date in the future.');

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    screen.getByRole('button', { name: `Saved passage: ${passage}` });
  });

  it('updates one linked revision when a saved learning plan is reopened and rescheduled', async () => {
    const user = renderChat();
    let dialog = await openLearningDialog(user);
    const year = new Date().getFullYear() + 1;
    const firstDate = `${year}-12-08`;
    const nextDate = `${year}-12-09`;
    setSchedule(dialog, firstDate, '14:35');
    await user.click(within(dialog).getByRole('button', { name: 'Save learning plan' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await screen.findByText('Learning plan saved to Revision Plan.');

    await user.click(screen.getByRole('button', { name: `Saved passage: ${passage}` }));
    dialog = await openLearningDialog(user);
    expect(within(dialog).getByLabelText(/Learning date/).value).toBe(firstDate);
    expect(within(dialog).getByLabelText(/Learning time/).value).toBe('14:35');
    setSchedule(dialog, nextDate, '15:45');
    await user.click(within(dialog).getByRole('button', { name: 'Save learning plan' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await user.click(screen.getByRole('button', { name: 'Open learning plan' }));
    await screen.findByRole('heading', { name: 'Make room for revision.' });
    await user.click(screen.getByRole('button', { name: 'Grid' }));

    const headings = screen.getAllByRole('heading', { name: `Learn: ${passage}` });
    expect(headings).toHaveLength(1);
    const card = headings[0].parentElement;
    within(card).getByText(passage, { exact: true });
    within(card).getByText(`Dec 9, ${year}`);
    expect(card.textContent).toContain('15:45');
    expect(card.textContent).toContain(Intl.DateTimeFormat().resolvedOptions().timeZone);
    expect(within(card).queryByText(`Dec 8, ${year}`)).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Return to conversation' }));
    await user.click(await screen.findByRole('button', { name: `Saved passage: ${passage}` }));
    dialog = await openLearningDialog(user);
    expect(within(dialog).getByLabelText(/Learning date/).value).toBe(nextDate);
    expect(within(dialog).getByLabelText(/Learning time/).value).toBe('15:45');
  });
});
