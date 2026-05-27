import { RedirectIfAuthenticated } from '@/routes/redirect-if-authenticated';

import { LoginForm } from '@/components/login-form';

export const LoginPage = () => {
  return (
    <RedirectIfAuthenticated>
      <div className="bg-muted flex min-h-screen min-w-max flex-col items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-sm md:max-w-2xl">
          <LoginForm />
        </div>
      </div>
    </RedirectIfAuthenticated>
  );
};
