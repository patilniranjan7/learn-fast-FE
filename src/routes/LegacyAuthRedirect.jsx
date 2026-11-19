import { Navigate, useLocation } from 'react-router';
import { paths } from './paths.js';

// Preserve links shared before clean URL routes were introduced.
export function LegacyAuthRedirect({ children }) {
  const { pathname, search, hash } = useLocation();
  const isAuthPath = [paths.home, paths.login, paths.signup].includes(pathname);
  const destination = { '#login': paths.login, '#signup': paths.signup }[hash];

  if (isAuthPath && destination) {
    return <Navigate to={{ pathname: destination, search }} replace />;
  }

  return children;
}
