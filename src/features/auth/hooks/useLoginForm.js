import { useState } from 'react';
import { validateLogin } from '../utils/authValidation.js';

const DEMO_EMAIL = '12@g.c';
const DEMO_PASSWORD = '123';

export function useLoginForm() {
  const [values, setValues] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');

  function handleChange(event) {
    const { name, type, checked, value } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setNotice('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateLogin(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      event.currentTarget.elements.namedItem(Object.keys(nextErrors)[0])?.focus();
      return;
    }

    setNotice(
      values.email === DEMO_EMAIL && values.password === DEMO_PASSWORD
        ? 'Demo sign-in accepted. No account or session was created.'
        : 'Incorrect demo email or password.',
    );
  }

  function handlePasswordReset() {
    setNotice('Password reset will be available once authentication is connected.');
  }

  return { values, errors, notice, handleChange, handleSubmit, handlePasswordReset };
}
