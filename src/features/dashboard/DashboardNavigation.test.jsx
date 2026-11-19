import { ThemeProvider } from '@mui/material/styles';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation, useNavigate } from 'react-router';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../../routes/AppRoutes.jsx';
import { theme } from '../../theme/theme.js';

function HistoryControls() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <div aria-label="Current URL">{pathname}</div>
      <button onClick={() => navigate(-1)}>History back</button>
      <button onClick={() => navigate(1)}>History forward</button>
    </>
  );
}

function renderRoute(entry) {
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[entry]}>
        <AppRoutes />
        <HistoryControls />
      </MemoryRouter>
    </ThemeProvider>,
  );
  return userEvent.setup();
}

describe('dashboard routes and shared navigation', () => {
  it.each([
    ['/admin', 'Organisations & groups', 'Platform administration'],
    ['/user/1', 'What will you discover today?', 'My learning space'],
    ['/org/1', 'Northstar Academy', 'Northstar Academy'],
    ['/group/1', 'Students', 'Physics Circle'],
    ['/class/1', 'Students', 'Class 12 · Science'],
    ['/org/1/class/1', 'Students', 'Class 12 · Science'],
    ['/org/1/group/2', 'Students', 'JEE Study Club'],
  ])(
    'opens %s directly with its context and conversation drawer',
    async (entry, title, context) => {
      renderRoute(entry);
      await screen.findByRole('heading', { name: title, exact: true });
      within(screen.getByRole('navigation', { name: 'Workspace context' })).getByText(context);
      const navigation = screen.getByRole('navigation', { name: 'Dashboard navigation' });
      within(navigation).getByRole('button', { name: 'New Chat' });
      const history = within(navigation).getByRole('list', { name: 'Previous conversations' });
      within(history).getByRole('link', { name: 'Understanding Newton’s laws' });
      expect(screen.getByLabelText('Current URL').textContent).toBe(entry);
    },
  );

  it.each([
    '/user/missing',
    '/org/missing',
    '/class/missing',
    '/group/missing',
    '/org/2/class/1',
    '/org/1/group/1',
  ])('rejects an unknown or mismatched workspace at %s', async (entry) => {
    renderRoute(entry);
    await screen.findByRole('heading', { name: 'Workspace not found' });
    const main = screen.getByRole('main');
    expect(within(main).queryByRole('table')).toBeNull();
    expect(within(main).queryByRole('textbox')).toBeNull();
    within(main).getByRole('link', { name: 'Browse workspaces' });
  });

  it('keeps the organisation parent when opening its group and returning through the breadcrumb', async () => {
    const user = renderRoute('/org/1');
    await screen.findByRole('heading', { name: 'Northstar Academy', exact: true });
    const group = screen.getByRole('link', { name: 'JEE Study Club', exact: true });
    expect(group.getAttribute('href')).toBe('/org/1/group/2');
    expect(screen.queryByRole('link', { name: 'Physics Circle', exact: true })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Class 11 · Foundations', exact: true })).toBeNull();
    await user.click(group);
    await screen.findByRole('heading', { name: 'Students', exact: true });
    screen.getByText('aarav@example.com');
    screen.getByText('ananya@example.com');
    expect(screen.queryByText('kabir@example.com')).toBeNull();
    expect(screen.getByLabelText('Current URL').textContent).toBe('/org/1/group/2');
    const breadcrumb = screen.getByRole('navigation', { name: 'Workspace context' });
    await user.click(within(breadcrumb).getByRole('link', { name: 'Northstar Academy' }));
    await screen.findByRole('heading', { name: 'Northstar Academy', exact: true });
    expect(screen.getByLabelText('Current URL').textContent).toBe('/org/1');
  });

  it('retains a conversation across dashboard pages and contexts, new chats, and history', async () => {
    const user = renderRoute('/user/1');
    const question = 'How can I compare momentum and force?';
    const send = screen.getByRole('button', { name: 'Send message' });
    expect(send.disabled).toBe(true);
    await user.type(
      screen.getByRole('textbox', { name: 'Message your learning assistant' }),
      question,
    );
    await user.click(send);
    within(screen.getByRole('log', { name: 'Conversation' })).getByText(question);
    const personalChatUrl = screen.getByLabelText('Current URL').textContent;
    expect(personalChatUrl).toMatch(/^\/user\/1\/chat\//);
    await user.click(screen.getByRole('link', { name: 'Revision Plan' }));
    await screen.findByRole('heading', { name: 'Make room for revision.' });
    await user.click(screen.getByRole('link', { name: 'Chat', exact: true }));
    expect(screen.getByLabelText('Current URL').textContent).toBe(personalChatUrl);
    within(screen.getByRole('log', { name: 'Conversation' })).getByText(question);

    await user.click(screen.getByRole('combobox', { name: 'Preview dashboard' }));
    await user.click(screen.getByRole('option', { name: 'Group', exact: true }));
    await screen.findByRole('heading', { name: 'Students', exact: true });
    await user.click(screen.getByRole('link', { name: question }));
    expect(screen.getByLabelText('Current URL').textContent).toMatch(/^\/group\/1\/chat\//);
    within(screen.getByRole('log', { name: 'Conversation' })).getByText(question);

    await user.click(screen.getByRole('button', { name: 'New Chat' }));
    await screen.findByRole('heading', { name: 'What will you discover today?' });
    expect(screen.queryByRole('log', { name: 'Conversation' })).toBeNull();
    await user.click(screen.getByRole('link', { name: question }));
    within(screen.getByRole('log', { name: 'Conversation' })).getByText(question);
    await user.click(screen.getByRole('button', { name: 'History back' }));
    await screen.findByRole('heading', { name: 'What will you discover today?' });
    await user.click(screen.getByRole('button', { name: 'History forward' }));
    within(screen.getByRole('log', { name: 'Conversation' })).getByText(question);
  });

  it('does not expose another sample learner’s conversation', async () => {
    renderRoute('/user/2/chat/chat-1');
    await screen.findByRole('heading', { name: 'Conversation not found' });
    expect(screen.queryByRole('link', { name: 'Understanding Newton’s laws' })).toBeNull();
    expect(screen.queryByRole('log', { name: 'Conversation' })).toBeNull();
  });
});
