import { Alert, Box, Button, Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { paths } from '../../../routes/paths.js';
import { Icon } from '../../../shared/components/Icon.jsx';
import { PasswordField } from './PasswordField.jsx';

export function LoginForm({
  values,
  errors,
  notice,
  handleChange,
  handleSubmit,
  handlePasswordReset,
}) {
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2.5}>
        <TextField
          id="email"
          name="email"
          type="email"
          label="Email address"
          autoComplete="username"
          value={values.email}
          onChange={handleChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
          required
        />
        <PasswordField
          name="password"
          label="Password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                name="remember"
                size="small"
                checked={values.remember}
                onChange={handleChange}
              />
            }
            label="Keep me signed in"
            sx={{ '& .MuiFormControlLabel-label': { fontSize: 12 } }}
          />
          <Button type="button" size="small" onClick={handlePasswordReset} sx={{ fontSize: 11 }}>
            Forgot password?
          </Button>
        </Box>
        <Button
          variant="contained"
          fullWidth
          type="submit"
          endIcon={<Icon name="arrow" />}
          sx={{ minHeight: 48 }}
        >
          Sign in
        </Button>
        <Button component={RouterLink} to={paths.user('1')} variant="outlined" fullWidth>
          Explore sample workspace
        </Button>
        {notice && (
          <Alert severity="info" role="status">
            {notice}
          </Alert>
        )}
      </Stack>
    </Box>
  );
}
