import { RedirectIfAuthenticated } from '@/routes/redirect-if-authenticated';

import { ForgotPasswordForm } from '@/pages/forgot-password-page/components/forgot-password-form.component';

export const ForgotPasswordPage = () => {
  return (
    <RedirectIfAuthenticated>
      <div className="bg-muted flex min-h-screen min-w-max flex-col items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-sm md:max-w-2xl">
          <ForgotPasswordForm />
        </div>
      </div>
    </RedirectIfAuthenticated>
  );
};
