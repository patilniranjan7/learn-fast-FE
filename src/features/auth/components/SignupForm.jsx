import { Alert, Box, Button, Stack, TextField } from '@mui/material';
import { Icon } from '../../../shared/components/Icon.jsx';
import { PasswordField } from './PasswordField.jsx';

export function SignupForm({ values, errors, notice, handleChange, handleSubmit }) {
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2.5}>
        <TextField
          id="fullName"
          name="fullName"
          label="Full name"
          autoComplete="name"
          value={values.fullName}
          onChange={handleChange}
          error={Boolean(errors.fullName)}
          helperText={errors.fullName}
          slotProps={{ htmlInput: { maxLength: 100 } }}
          required
        />
        <TextField
          id="email"
          name="email"
          type="email"
          label="Email address"
          autoComplete="email"
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
          isNewPassword
        />
        <PasswordField
          name="confirmPassword"
          label="Confirm password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          isNewPassword
        />
        <Button
          variant="contained"
          fullWidth
          type="submit"
          endIcon={<Icon name="arrow" />}
          sx={{ minHeight: 48 }}
        >
          Create account
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
