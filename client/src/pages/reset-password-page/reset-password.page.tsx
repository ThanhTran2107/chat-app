import { RedirectIfAuthenticated } from '@/routes/redirect-if-authenticated';

import { ResetPasswordForm } from '@/pages/reset-password-page/components/reset-password-form.component';

export const ResetPasswordPage = () => {
  return (
    <RedirectIfAuthenticated>
      <div className="bg-muted flex min-h-screen min-w-max flex-col items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-sm md:max-w-2xl">
          <ResetPasswordForm />
        </div>
      </div>
    </RedirectIfAuthenticated>
  );
};
