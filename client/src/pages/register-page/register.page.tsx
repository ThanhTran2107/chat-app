import { RedirectIfAuthenticated } from '@/routes/redirect-if-authenticated';

import { RegisterForm } from '@/pages/register-page/components/register-form.component';

export const RegisterPage = () => {
  return (
    <RedirectIfAuthenticated>
      <div className="bg-muted flex min-h-screen min-w-max flex-col items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-sm md:max-w-2xl">
          <RegisterForm />
        </div>
      </div>
    </RedirectIfAuthenticated>
  );
};
