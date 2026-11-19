import { ThemeProvider } from '@mui/material/styles';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../../routes/AppRoutes.jsx';
import { theme } from '../../theme/theme.js';

function renderRoute(entry) {
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[entry]}>
        <AppRoutes />
      </MemoryRouter>
    </ThemeProvider>,
  );
  return userEvent.setup();
}

describe('group and class management', () => {
  it('creates a pending invitation from the organisation-linked drawer action', async () => {
    const user = renderRoute('/org/1/group/2');
    const invite = await screen.findByRole('link', { name: 'Invite User' });
    expect(invite.getAttribute('href')).toBe('/org/1/group/2/invite');
    await user.click(invite);
    const dialog = screen.getByRole('dialog');
    await user.type(
      within(dialog).getByLabelText(/student email address/i),
      'new-learner@example.com',
    );
    await user.click(within(dialog).getByRole('button', { name: 'Create invitation' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    screen.getByRole('row', { name: /new-learner@example.com Pending/i });
    const roster = screen.getByRole('link', { name: 'Students / Users' });
    expect(roster.getAttribute('aria-current')).toBe('page');
    within(screen.getByRole('navigation', { name: 'Workspace context' })).getByText(
      'JEE Study Club',
    );
  });

  it('scopes the student directory and pending invitations to the selected group', async () => {
    const user = renderRoute('/group/1');
    await screen.findByRole('heading', { name: 'Students', exact: true });
    screen.getByText('aarav@example.com');
    screen.getByText('kabir@example.com');
    expect(screen.queryByText('ananya@example.com')).toBeNull();
    expect(screen.queryByText('riya@example.com')).toBeNull();
    await user.type(screen.getByRole('textbox', { name: 'Search students' }), 'kabir');
    screen.getByText('kabir@example.com');
    expect(screen.queryByText('aarav@example.com')).toBeNull();
    await user.clear(screen.getByRole('textbox', { name: 'Search students' }));

    await user.click(screen.getByRole('button', { name: /invite student/i }));
    let dialog = screen.getByRole('dialog');
    await user.type(within(dialog).getByLabelText(/student email address/i), 'riya@example.com');
    await user.click(within(dialog).getByRole('button', { name: 'Create invitation' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    const invitation = screen.getByRole('row', { name: /riya@example.com Pending/i });
    within(invitation).getByText('Pending');

    await user.click(screen.getByRole('button', { name: /invite student/i }));
    dialog = screen.getByRole('dialog');
    await user.type(within(dialog).getByLabelText(/student email address/i), 'RIYA@example.com');
    await user.click(within(dialog).getByRole('button', { name: 'Create invitation' }));
    within(dialog).getByText('An invitation already exists for this email address.');
    await user.clear(within(dialog).getByLabelText(/student email address/i));
    await user.type(within(dialog).getByLabelText(/student email address/i), 'aarav@example.com');
    await user.click(within(dialog).getByRole('button', { name: 'Create invitation' }));
    within(dialog).getByText('This student already belongs to this group or class.');
  });

  it('creates a class test draft with its paper, answer key, and marking scheme', async () => {
    const user = renderRoute('/class/1/tests');
    await screen.findByRole('heading', { name: 'Tests', exact: true });
    screen.getByRole('row', { name: /Motion & Newton’s laws/i });
    expect(screen.queryByRole('row', { name: /Waves & oscillations/i })).toBeNull();
    await user.click(screen.getByRole('button', { name: /create test/i }));
    const dialog = screen.getByRole('dialog');
    await user.type(within(dialog).getByLabelText(/test title/i), 'Momentum diagnostic');
    await user.type(within(dialog).getByLabelText(/^subject/i), 'Physics');
    await user.type(within(dialog).getByLabelText(/test date/i), '2026-12-01');
    await user.clear(within(dialog).getByLabelText(/number of questions/i));
    await user.type(within(dialog).getByLabelText(/number of questions/i), '10');
    await user.clear(within(dialog).getByLabelText(/maximum marks/i));
    await user.type(within(dialog).getByLabelText(/maximum marks/i), '40');
    await user.upload(
      within(dialog).getByLabelText('Question paper'),
      new File(['sample paper'], 'momentum-paper.pdf', { type: 'application/pdf' }),
    );
    await user.upload(
      within(dialog).getByLabelText('Answer key'),
      new File(['sample key'], 'momentum-key.pdf', { type: 'application/pdf' }),
    );
    await user.type(within(dialog).getByLabelText(/marking scheme/i), '+4 correct; -1 incorrect');
    await user.click(within(dialog).getByRole('button', { name: 'Create draft test' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

    const draft = screen.getByRole('row', { name: /Momentum diagnostic/i });
    within(draft).getByText('Draft');
    within(draft).getByText('10');
    within(draft).getByText('40');
    within(draft).getByText('momentum-paper.pdf · momentum-key.pdf');
    within(draft).getByText('+4 correct; -1 incorrect');
    screen.getByText('3 total');
  });

  it('graphs evaluated group percentages while excluding processing attempts and class evidence', async () => {
    renderRoute('/group/1/progress');
    await screen.findByRole('heading', { name: 'Progress', exact: true });
    screen.getByRole('img', { name: /Average score over time.*Finding resonance: 74%/i });
    const resonance = screen.getByRole('row', { name: /Finding resonance/i });
    within(resonance).getByRole('cell', { name: '74%', exact: true });
    const waves = screen.getByRole('row', { name: /Waves & oscillations/i });
    within(waves).getByRole('cell', { name: '80%', exact: true });
    within(waves).getByRole('cell', { name: '1', exact: true });
    screen.getByText('2 / 2');
    screen.getByText('+6 pp');
    expect(screen.queryByRole('row', { name: /Motion & Newton’s laws/i })).toBeNull();
  });

  it('shows an empty progress state when the selected group has no evaluated evidence', async () => {
    renderRoute('/org/1/group/2/progress');
    await screen.findByRole('heading', { name: 'Progress begins with a test' });
    expect(screen.queryByRole('img', { name: /Average score over time/i })).toBeNull();
    screen.getByText('No evaluated assessment scores yet.');
    screen.getByText('0 / 2');
  });

  it('opens a student report inside the class without switching the manager’s personal chat history', async () => {
    const user = renderRoute('/class/1');
    const row = (await screen.findByText('ananya@example.com')).closest('tr');
    const report = within(row).getByRole('link', { name: /view report/i });
    expect(report.getAttribute('href')).toBe('/class/1/students/2/reports/attempt-4');
    await user.click(report);
    await screen.findByRole('heading', { name: 'Motion & Newton’s laws', exact: true });
    const context = screen.getByRole('navigation', { name: 'Workspace context' });
    within(context).getByText('Class 12 · Science');
    screen.getByRole('link', { name: 'Students / Users' });
    expect(screen.queryByRole('button', { name: 'Plan a revision' })).toBeNull();
    const history = screen.getByRole('list', { name: 'Previous conversations' });
    await user.click(within(history).getByRole('link', { name: 'Understanding Newton’s laws' }));
    within(screen.getByRole('log', { name: 'Conversation' })).getByText(
      'How do I start drawing a free-body diagram?',
    );
    within(context).getByText('Class 12 · Science');
    await user.click(screen.getByRole('link', { name: 'Students / Users' }));
    await screen.findByText('ananya@example.com');
  });

  it('rejects a report whose test belongs to a different class or group', async () => {
    renderRoute('/group/1/students/1/reports/attempt-1');
    await screen.findByRole('heading', { name: 'Workspace not found' });
    expect(screen.queryByRole('heading', { name: 'Your strengths' })).toBeNull();
  });
});
