function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+$/.test(email.trim()) ? '' : 'Enter a valid email address.';
}

/** Return field-keyed messages; an empty object means the form is valid. */
export function validateLogin(values) {
  const errors = {};
  const emailError = validateEmail(values.email);

  if (emailError) errors.email = emailError;
  if (!values.password) errors.password = 'Enter your password.';

  return errors;
}

export function validateSignup(values) {
  const errors = validateLogin(values);

  if (!values.fullName.trim()) errors.fullName = 'Enter your name.';
  if (values.password.length < 8) {
    errors.password = 'Use at least 8 characters.';
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords must match.';
  }

  return errors;
}
