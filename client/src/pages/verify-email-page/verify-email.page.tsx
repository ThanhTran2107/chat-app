import { CheckCircle2, CircleAlert } from 'lucide-react';

import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { AuthIllustration } from '@/components/ui/auth-illustration.component';
import { Button } from '@/components/ui/button';
import { ThemeToggleFloat } from '@/components/ui/theme-toggle-float';

import { APP_NAME, ROUTES } from '@/utils/constants';
import { authService } from '@/utils/services/auth.service';

import { getApiErrorMessage } from '@/lib/axios';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [message, setMessage] = useState('Verifying your email...');

  const token = searchParams.get('token') ?? '';

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('failed');
        setMessage('Verification token is missing from the link.');
        setLoading(false);

        return;
      }

      try {
        const res = await authService.verifyEmail(token);

        setStatus('success');
        setMessage(res.message || 'Your email has been verified successfully.');
      } catch (error) {
        setStatus('failed');
        setMessage(getApiErrorMessage(error, 'Unable to verify your email. Please try again.'));
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-6 sm:px-6 lg:px-8 dark:bg-[#051424]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 -left-10 h-64 w-64 rounded-full bg-violet-400/20 blur-2xl dark:bg-[#d68cff]/12" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-violet-500/15 blur-2xl dark:bg-[#d68cff]/10" />
        <div className="absolute top-1/2 left-1/2 h-128 w-lg -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/12 blur-[80px] dark:bg-[#7c3aed]/10" />
      </div>

      <ThemeToggleFloat />

      <div className="relative w-full max-w-6xl">
        <div className="grid overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_30px_90px_rgba(15,23,42,0.16)] lg:grid-cols-[1.05fr_0.95fr] dark:border-white/10 dark:bg-[#0d1c2d] dark:shadow-[0_40px_140px_rgba(0,0,0,0.35)]">
          <div className="relative flex flex-col justify-between bg-white/90 px-5 py-6 sm:px-7 lg:px-8 dark:bg-[#0d1c2d]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.12),transparent_40%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(214,140,255,0.15),transparent_40%)]" />
            <div className="relative flex flex-col gap-5">
              <div className="mb-2 flex items-center gap-3">
                <Link to={ROUTES.LANDING} className="flex items-center gap-3 transition hover:opacity-80">
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden">
                    <img src="/main-logo.png" alt="Tetra logo" className="h-full w-full object-contain" />
                  </div>
                  <div>
                    <p className="text-base font-semibold tracking-[0.24em] text-slate-900 uppercase dark:text-white">
                      {APP_NAME}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Email verification</p>
                  </div>
                </Link>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-inner shadow-slate-900/5 dark:border-white/10 dark:bg-[#071424]/70 dark:shadow-black/20">
                <div className="mb-4 flex items-center gap-3">
                  {status === 'success' ? (
                    <CheckCircle2 className="size-6 text-emerald-400" />
                  ) : (
                    <CircleAlert className="size-6 text-[#d68cff]" />
                  )}
                  <div>
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Verify your email</h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400">One last step to unlock your account.</p>
                  </div>
                </div>

                <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{message}</p>
              </div>

              <div className="grid gap-3">
                <Button
                  type="button"
                  className="h-11 w-full cursor-pointer rounded-2xl bg-[#d68cff] text-sm font-semibold text-white shadow-lg shadow-[#d68cff]/25 transition hover:brightness-110"
                  onClick={() => navigate(ROUTES.LOGIN)}
                  disabled={loading}
                >
                  Back to login
                </Button>

                {status === 'failed' && (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full rounded-2xl border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-transparent dark:text-slate-200 dark:hover:bg-white/5"
                    onClick={() => navigate(ROUTES.RESEND_VERIFICATION)}
                  >
                    Resend verification email
                  </Button>
                )}
              </div>
            </div>
          </div>

          <AuthIllustration />
        </div>
      </div>
    </div>
  );
};
