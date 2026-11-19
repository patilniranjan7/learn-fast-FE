import { createTheme } from '@mui/material/styles';
import { components } from './components.js';
import { palette } from './palette.js';
import { typography } from './typography.js';

export const theme = createTheme({
  palette,
  typography,
  components,
  shape: { borderRadius: 7 },
});
