import { useEffect, useRef } from 'react';
import { Typography } from '@mui/material';
import { appConfig } from '../config/appConfig.js';

export function PageHeading({ title, children }) {
  const heading = useRef(null);

  useEffect(() => {
    document.title = `${title} · ${appConfig.companyName}`;
    heading.current?.focus();
  }, [title]);

  return (
    <Typography
      ref={heading}
      component="h1"
      variant="h2"
      tabIndex={-1}
      sx={{ fontSize: { xs: 29, md: 36 }, mb: 1, outline: 'none' }}
    >
      {children}
    </Typography>
  );
}
