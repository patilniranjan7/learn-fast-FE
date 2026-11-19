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

describe('learner revision workflow', () => {
  it('uses the same saved item in calendar and grid after creating, rescheduling, and completing it', async () => {
    const user = renderRoute('/user/1/revisions');
    await user.click(await screen.findByRole('button', { name: '+ Plan a revision' }));
    let dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Create revision' }));
    within(dialog).getByText('Give your revision a title.');
    await user.type(within(dialog).getByLabelText(/revision title/i), 'Practise momentum');
    await user.clear(within(dialog).getByLabelText(/revision date/i));
    await user.type(within(dialog).getByLabelText(/revision date/i), '2026-12-08');
    await user.type(
      within(dialog).getByLabelText('What will you work on?'),
      'Solve three collisions.',
    );
    await user.click(within(dialog).getByRole('button', { name: 'Create revision' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    screen.getByRole('button', { name: 'Edit Practise momentum, planned' });

    await user.click(screen.getByRole('button', { name: 'Grid' }));
    screen.getByRole('heading', { name: 'Practise momentum' });
    screen.getByText('Dec 8, 2026');
    screen.getByText('Solve three collisions.');
    await user.click(screen.getByRole('button', { name: 'Calendar' }));
    await user.click(screen.getByRole('button', { name: 'Edit Practise momentum, planned' }));
    dialog = screen.getByRole('dialog');
    expect(within(dialog).getByLabelText(/revision title/i).value).toBe('Practise momentum');
    await user.clear(within(dialog).getByLabelText(/revision date/i));
    await user.type(within(dialog).getByLabelText(/revision date/i), '2027-01-04');
    await user.click(
      within(dialog).getByRole('checkbox', { name: "I've completed this revision" }),
    );
    await user.click(within(dialog).getByRole('button', { name: 'Save changes' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    screen.getByRole('button', { name: 'Edit Practise momentum, completed' });

    await user.click(screen.getByRole('button', { name: 'Grid' }));
    screen.getByRole('heading', { name: 'Practise momentum' });
    screen.getByText('Jan 4, 2027');
    expect(screen.queryByText('Dec 8, 2026')).toBeNull();
  });
});

describe('learner test reports', () => {
  it('opens report evidence and saves a revision with its concern and report origin', async () => {
    const user = renderRoute('/user/1/tests/attempt-1');
    await screen.findByRole('heading', { name: 'Motion & Newton’s laws' });
    screen.getByRole('heading', { name: 'Your strengths' });
    screen.getByText('Newton’s laws · correct force calculation in Q1');
    screen.getByRole('heading', { name: 'Room to grow' });
    screen.getByText('Circular motion · revisit the speed-squared relationship in Q2');
    await user.click(
      screen.getByRole('button', { name: /What happens to centripetal force when speed doubles/i }),
    );
    screen.getByText('It quadruples', { exact: false });
    screen.getByText('F = mv²/r. Doubling v multiplies v², and therefore force, by four.');
    await user.click(screen.getByRole('button', { name: 'Plan a revision' }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByLabelText(/revision title/i).value).toBe('Revise: Physics');
    expect(within(dialog).getByLabelText('What will you work on?').value).toContain(
      'Circular motion',
    );
    await user.click(within(dialog).getByRole('button', { name: 'Create revision' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await user.click(screen.getByRole('link', { name: 'View plan' }));
    await user.click(screen.getByRole('button', { name: 'Grid' }));
    const revisionCard = screen.getByRole('heading', { name: 'Revise: Physics' }).parentElement;
    within(revisionCard).getByText('From your test report');
  });

  it('keeps a processing attempt pending until its report is available', async () => {
    const user = renderRoute('/user/1/tests');
    await screen.findByRole('heading', { name: 'Every attempt tells a story.' });
    screen.getByText('Pending');
    await user.click(screen.getByRole('link', { name: 'View status' }));
    screen.getByRole('heading', { name: 'Waves & oscillations' });
    screen.getByRole('heading', { name: 'Your insights are taking shape.' });
    expect(screen.queryByRole('heading', { name: 'Your strengths' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Plan a revision' })).toBeNull();
    await user.click(screen.getByRole('link', { name: /all reports/i }));
    await screen.findByRole('heading', { name: 'Every attempt tells a story.' });
  });

  it('does not expose another learner’s attempt through a direct report URL', async () => {
    renderRoute('/user/1/tests/attempt-4');
    await screen.findByRole('heading', { name: 'Report not found' });
    expect(screen.queryByRole('heading', { name: 'Your strengths' })).toBeNull();
    screen.getByRole('link', { name: /all reports/i });
  });
});
