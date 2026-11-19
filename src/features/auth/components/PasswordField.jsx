import { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Icon } from '../../../shared/components/Icon.jsx';

export function PasswordField({ name, label, value, onChange, error, isNewPassword = false }) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      id={name}
      name={name}
      label={label}
      type={visible ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      autoComplete={isNewPassword ? 'new-password' : 'current-password'}
      error={Boolean(error)}
      helperText={
        error || (isNewPassword && name === 'password' ? 'Use at least 8 characters.' : undefined)
      }
      required
      slotProps={{
        htmlInput: { minLength: isNewPassword ? 8 : undefined },
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="button"
                edge="end"
                aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
                aria-pressed={visible}
                onClick={() => setVisible((current) => !current)}
              >
                <Icon name="eye" width="19" height="19" />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
