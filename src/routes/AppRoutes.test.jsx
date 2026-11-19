import { ThemeProvider } from '@mui/material/styles';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation, useNavigate } from 'react-router';
import { describe, expect, it } from 'vitest';
import { appConfig } from '../shared/config/appConfig.js';
import { theme } from '../theme/theme.js';
import { AppRoutes } from './AppRoutes.jsx';

function HistoryControls() {
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();

  return (
    <>
      <div aria-label="Current URL">
        {pathname}
        {search}
        {hash}
      </div>
      <button onClick={() => navigate(-1)}>History back</button>
      <button onClick={() => navigate(1)}>History forward</button>
    </>
  );
}

function renderRoute(entry) {
  const user = userEvent.setup();
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[entry]}>
        <AppRoutes />
        <HistoryControls />
      </MemoryRouter>
    </ThemeProvider>,
  );
  return user;
}

describe('application routes', () => {
  it('redirects the root to login', async () => {
    renderRoute('/');
    await screen.findByRole('heading', { name: 'Welcome back.' });
    expect(screen.getByLabelText('Current URL').textContent).toBe('/login');
  });

  it('opens signup directly and focuses its heading', async () => {
    renderRoute('/signup');
    const heading = await screen.findByRole('heading', { name: 'Start your story.' });
    expect(document.activeElement).toBe(heading);
    expect(document.title).toBe(`Create account · ${appConfig.companyName}`);
    screen.getByRole('textbox', { name: /full name/i });
  });

  it('uses clean links and supports history in both directions', async () => {
    const user = renderRoute('/login');
    const signupLink = screen.getByRole('link', { name: `New to ${appConfig.companyName}?` });
    expect(signupLink.getAttribute('href')).toBe('/signup');
    await user.click(signupLink);
    await screen.findByRole('heading', { name: 'Start your story.' });
    expect(screen.getByLabelText('Current URL').textContent).toBe('/signup');
    await user.click(screen.getByRole('button', { name: 'History back' }));
    await screen.findByRole('heading', { name: 'Welcome back.' });
    await user.click(screen.getByRole('button', { name: 'History forward' }));
    await screen.findByRole('heading', { name: 'Start your story.' });
    await user.click(screen.getByRole('link', { name: 'Sign in' }));
    await screen.findByRole('heading', { name: 'Welcome back.' });
  });

  it.each([
    ['/#signup', '/signup', 'Start your story.'],
    ['/?invite=abc#signup', '/signup?invite=abc', 'Start your story.'],
    ['/#login', '/login', 'Welcome back.'],
    ['/login#signup', '/signup', 'Start your story.'],
  ])('migrates old link %s without retaining the hash', async (entry, path, heading) => {
    renderRoute(entry);
    await screen.findByRole('heading', { name: heading });
    expect(screen.getByLabelText('Current URL').textContent).toBe(path);
  });

  it('shows a not-found screen and a route back to login', async () => {
    const user = renderRoute('/missing-page');
    screen.getByRole('heading', { name: 'Page not found.' });
    await user.click(screen.getByRole('link', { name: 'Back to sign in' }));
    await screen.findByRole('heading', { name: 'Welcome back.' });
  });

  it('does not interpret auth fragments on unrelated paths', () => {
    renderRoute('/missing-page#signup');
    screen.getByRole('heading', { name: 'Page not found.' });
  });

  it('clears form state and password visibility after leaving a page', async () => {
    const user = renderRoute('/login');
    await user.type(screen.getByLabelText(/^email address/i), 'learner@example.com');
    await user.type(screen.getByLabelText(/^password\s*\*/i), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Show password' }));
    await user.click(screen.getByRole('link', { name: `New to ${appConfig.companyName}?` }));
    await user.click(screen.getByRole('link', { name: 'Sign in' }));
    expect(screen.getByLabelText(/^email address/i).value).toBe('');
    const password = screen.getByLabelText(/^password\s*\*/i);
    expect(password.value).toBe('');
    expect(password.type).toBe('password');
  });

  it('validates login fields and accepts only the demo credentials', async () => {
    const user = renderRoute('/login');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    screen.getByText('Enter a valid email address.');
    screen.getByText('Enter your password.');
    await user.type(screen.getByLabelText(/^email address/i), '123@g.com');
    await user.type(screen.getByLabelText(/^password\s*\*/i), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByRole('status').textContent).toBe('Incorrect demo email or password.');
    await user.clear(screen.getByLabelText(/^password\s*\*/i));
    await user.type(screen.getByLabelText(/^password\s*\*/i), '123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByRole('status').textContent).toBe(
      'Demo sign-in accepted. No account or session was created.',
    );
    await user.clear(screen.getByLabelText(/^email address/i));
    await user.type(screen.getByLabelText(/^email address/i), 'learner@example.com');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByRole('status').textContent).toBe('Incorrect demo email or password.');
    expect(screen.getByLabelText('Current URL').textContent).toBe('/login');
  });

  it('validates password confirmation before accepting signup details', async () => {
    const user = renderRoute('/signup');
    await user.type(screen.getByLabelText(/^full name/i), 'A Learner');
    await user.type(screen.getByLabelText(/^email address/i), 'learner@example.com');
    await user.type(screen.getByLabelText(/^password\s*\*/i), 'secret123');
    await user.type(screen.getByLabelText(/^confirm password/i), 'different123');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    screen.getByText('Passwords must match.');
    expect(screen.queryByRole('status')).toBeNull();
    await user.clear(screen.getByLabelText(/^confirm password/i));
    await user.type(screen.getByLabelText(/^confirm password/i), 'secret123');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    await waitFor(() => {
      expect(screen.getByRole('status').textContent).toContain('No account has been created.');
    });
  });
});
