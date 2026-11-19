import { paths } from '../../../routes/paths.js';
import { AuthPageFooter } from '../components/AuthPageFooter.jsx';
import { AuthPageHeader } from '../components/AuthPageHeader.jsx';
import { SignupForm } from '../components/SignupForm.jsx';
import { useSignupForm } from '../hooks/useSignupForm.js';

export function SignupPage() {
  const form = useSignupForm();

  return (
    <>
      <AuthPageHeader
        title="Create account"
        heading="Start your story."
        subtitle="Create your account and make room for discovery."
        eyebrow="YOUR LEARNING JOURNEY STARTS HERE"
      />
      <SignupForm {...form} />
      <AuthPageFooter
        to={paths.login}
        prefix="Already have an account?"
        linkText="Sign in"
        description="Your next discovery is waiting for you."
      />
    </>
  );
}
