import { ThemeProvider } from '@mui/material/styles';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../../routes/AppRoutes.jsx';
import { theme } from '../../theme/theme.js';

function CurrentUrl() {
  return <div aria-label="Current URL">{useLocation().pathname}</div>;
}

function renderAdmin() {
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/admin']}>
        <AppRoutes />
        <CurrentUrl />
      </MemoryRouter>
    </ThemeProvider>,
  );
  return userEvent.setup();
}

function expectMetric(label, value) {
  within(screen.getByText(label, { exact: true }).parentElement).getByText(String(value), {
    exact: true,
  });
}

async function previewAdmin(user) {
  await user.click(screen.getByRole('combobox', { name: 'Preview dashboard' }));
  await user.click(screen.getByRole('option', { name: 'Admin', exact: true }));
  await screen.findByRole('heading', { name: 'Organisations & groups' });
}

async function openCreate(user, kind) {
  await user.click(screen.getByRole('button', { name: '+ Create new' }));
  await user.click(screen.getByRole('menuitem', { name: `Create ${kind}` }));
  return screen.getByRole('dialog');
}

describe('admin directory and derived totals', () => {
  it('filters communities by type, organisation scope, and search', async () => {
    const user = renderAdmin();
    const organisation = (
      await screen.findByRole('link', { name: 'Northstar Academy', exact: true })
    ).closest('tr');
    within(organisation).getByRole('cell', { name: '3', exact: true });
    await user.click(screen.getByRole('combobox', { name: 'Type' }));
    await user.click(screen.getByRole('option', { name: 'Groups', exact: true }));
    screen.getByRole('link', { name: 'Physics Circle', exact: true });
    screen.getByRole('link', { name: 'JEE Study Club', exact: true });
    expect(screen.queryByRole('link', { name: 'Class 12 · Science', exact: true })).toBeNull();
    await user.click(screen.getByRole('combobox', { name: 'Organisation', exact: true }));
    await user.click(screen.getByRole('option', { name: 'Standalone only' }));
    screen.getByRole('link', { name: 'Physics Circle', exact: true });
    expect(screen.queryByRole('link', { name: 'JEE Study Club', exact: true })).toBeNull();
    await user.type(screen.getByRole('textbox', { name: 'Search directory' }), 'not a community');
    screen.getByText('No results. Try another search or create a new community.');
  });

  it('creates an organisation, a linked class, and a standalone group and updates their totals', async () => {
    const user = renderAdmin();
    await screen.findByRole('heading', { name: 'Organisations & groups' });
    expectMetric('Organisations', 2);
    expectMetric('Groups', 2);
    expectMetric('Classes', 2);

    let dialog = await openCreate(user, 'organisation');
    await user.type(within(dialog).getByLabelText(/organisation name/i), 'Horizon Academy');
    await user.click(within(dialog).getByRole('button', { name: 'Create organisation' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await screen.findByRole('heading', { name: 'Horizon Academy' });
    expect(screen.getByLabelText('Current URL').textContent).toMatch(/^\/org\/[^/]+$/);
    await previewAdmin(user);
    expectMetric('Organisations', 3);

    dialog = await openCreate(user, 'class');
    await user.type(within(dialog).getByLabelText(/class name/i), 'Evening Physics');
    await user.click(within(dialog).getByRole('combobox', { name: 'Organisation', exact: true }));
    await user.click(screen.getByRole('option', { name: 'Horizon Academy', exact: true }));
    await user.click(within(dialog).getByRole('button', { name: 'Create class' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await screen.findByRole('heading', { name: 'Students', exact: true });
    screen.getByText('No students yet. Invite your first learner.');
    expect(screen.getByLabelText('Current URL').textContent).toMatch(
      /^\/org\/[^/]+\/class\/[^/]+$/,
    );
    await previewAdmin(user);
    const classRow = screen.getByRole('row', { name: /Evening Physics/i });
    within(classRow).getByText('Horizon Academy');
    expectMetric('Classes', 3);

    dialog = await openCreate(user, 'group');
    await user.type(within(dialog).getByLabelText(/group name/i), 'Weekend Study');
    await user.click(within(dialog).getByRole('button', { name: 'Create group' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await screen.findByRole('heading', { name: 'Students', exact: true });
    expect(screen.getByLabelText('Current URL').textContent).toMatch(/^\/group\/[^/]+$/);
    await previewAdmin(user);
    const groupRow = screen.getByRole('row', { name: /Weekend Study/i });
    within(groupRow).getByText('Standalone');
    expectMetric('Organisations', 3);
    expectMetric('Groups', 3);
    expectMetric('Classes', 3);
    await user.click(screen.getByRole('link', { name: 'Analytics', exact: true }));
    await screen.findByRole('heading', { name: 'Learning analytics' });
    expectMetric('Users', 4);
    expectMetric('Organisations', 3);
    expectMetric('Groups', 3);
    expectMetric('Classes', 3);
    screen.getByText('6 spaces');
  });
});
