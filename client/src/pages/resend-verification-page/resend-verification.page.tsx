import { Mail } from 'lucide-react';
import { toast } from 'sonner';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Spin } from '@/components/antd/spin.component';
import { AuthIllustration } from '@/components/ui/auth-illustration.component';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ThemeToggleFloat } from '@/components/ui/theme-toggle-float';

import { APP_NAME } from '@/utils/constants';
import { ROUTES } from '@/utils/constants';
import { authService } from '@/utils/services/auth.service';

export const ResendVerificationPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const emailInput = document.getElementById('email') as HTMLInputElement | null;
      emailInput?.focus();
    }, 120);

    return () => window.clearTimeout(timer);
  }, []);

  const handleResend = async () => {
    try {
      setLoading(true);
      const res = await authService.resendVerificationEmail(email);
      toast.success(res.message || 'Verification email resent.');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error((error as Error).message || 'Unable to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-6 sm:px-6 lg:px-8 dark:bg-[#051424]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 -left-10 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl dark:bg-[#d68cff]/12" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl dark:bg-[#d68cff]/10" />
        <div className="absolute top-1/2 left-1/2 h-128 w-lg -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/12 blur-[120px] dark:bg-[#7c3aed]/10" />
      </div>

      <ThemeToggleFloat />

      <div className="relative w-full max-w-6xl">
        <div className="grid overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_30px_90px_rgba(15,23,42,0.16)] lg:grid-cols-[1.05fr_0.95fr] dark:border-white/10 dark:bg-[#0d1c2d] dark:shadow-[0_40px_140px_rgba(0,0,0,0.35)]">
          <div className="relative flex flex-col justify-between bg-white/90 px-5 py-6 sm:px-7 lg:px-8 dark:bg-[#0d1c2d]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.12),transparent_40%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(214,140,255,0.15),transparent_40%)]" />
            <div className="relative">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden">
                  <img src="/main-logo.png" alt={`${APP_NAME} logo`} className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="text-base font-semibold tracking-[0.24em] text-slate-900 uppercase dark:text-white">
                    {APP_NAME}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Verify access</p>
                </div>
              </div>

              <div className="mb-4">
                <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-white">
                  Resend verification
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Enter your email and we’ll send a fresh verification link right away.
                </p>
              </div>

              <div className="space-y-3">
                <FieldGroup className="gap-3">
                  <Field>
                    <FieldLabel
                      htmlFor="email"
                      className="text-[0.7rem] font-semibold tracking-[0.22em] text-slate-600 uppercase dark:text-slate-400"
                    >
                      Email
                    </FieldLabel>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                      <Input
                        id="email"
                        type="email"
                        autoFocus
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        placeholder="user@example.com"
                        className="h-11 rounded-2xl border border-slate-200 bg-white pr-3 pl-10 text-sm text-slate-900 shadow-inner shadow-slate-900/5 transition placeholder:text-slate-400 focus:border-violet-400/70 focus:ring-0 dark:border-white/10 dark:bg-[#071424] dark:text-white dark:shadow-black/20 dark:placeholder:text-slate-500 dark:focus:border-[#d68cff]/60"
                      />
                    </div>
                  </Field>

                  <Button
                    type="button"
                    className="h-11 w-full cursor-pointer rounded-2xl bg-[#d68cff] text-sm font-semibold text-white shadow-lg shadow-[#d68cff]/25 transition hover:brightness-110"
                    onClick={handleResend}
                    disabled={loading || !email}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {loading && <Spin className="size-4" />}
                      Resend verification email
                    </div>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full rounded-2xl border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-transparent dark:text-slate-200 dark:hover:bg-white/5"
                    onClick={() => navigate(ROUTES.LOGIN, { replace: true })}
                  >
                    Back to login
                  </Button>
                </FieldGroup>
              </div>
            </div>
          </div>

          <AuthIllustration />
        </div>
      </div>
    </div>
  );
};
