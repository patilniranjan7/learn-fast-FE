import { paths } from '../../../routes/paths.js';
import { appConfig } from '../../../shared/config/appConfig.js';
import { AuthPageFooter } from '../components/AuthPageFooter.jsx';
import { AuthPageHeader } from '../components/AuthPageHeader.jsx';
import { LoginForm } from '../components/LoginForm.jsx';
import { useLoginForm } from '../hooks/useLoginForm.js';

export function LoginPage() {
  const form = useLoginForm();

  return (
    <>
      <AuthPageHeader
        title="Welcome back"
        heading="Welcome back."
        subtitle="A fresh perspective is just a sign-in away."
        eyebrow="YOUR LEARNING JOURNEY, CONTINUED"
      />
      <LoginForm {...form} />
      <AuthPageFooter
        to={paths.signup}
        linkText={`New to ${appConfig.companyName}?`}
        description="Create an account to begin your learning journey."
      />
    </>
  );
}
