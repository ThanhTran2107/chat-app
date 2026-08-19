import { RedirectIfAuthenticated } from '@/routes/redirect-if-authenticated';

import { LoginForm } from '@/pages/login-page/components/login-form.component';

import { ThemeToggleFloat } from '@/components/ui/theme-toggle-float.component';

export const LoginPage = () => {
  return (
    <RedirectIfAuthenticated>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-6 sm:px-6 lg:px-8 dark:bg-[#051424]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 -left-10 h-64 w-64 rounded-full bg-violet-400/20 blur-2xl dark:bg-[#d68cff]/12" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-violet-500/15 blur-2xl dark:bg-[#d68cff]/10" />
          <div className="absolute top-1/2 left-1/2 h-128 w-lg -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/12 blur-[80px] dark:bg-[#7c3aed]/10" />
        </div>

        <ThemeToggleFloat />

        <div className="relative w-full max-w-6xl">
          <LoginForm />
        </div>
      </div>
    </RedirectIfAuthenticated>
  );
};
