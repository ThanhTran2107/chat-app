import { LoadingOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Spin } from '@/components/antd/spin.component';
import { AuthIllustration } from '@/components/ui/auth-illustration.component';
import { Button } from '@/components/ui/button.component';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field.component';
import { Input } from '@/components/ui/input.component';

import { APP_NAME, type ForgotPasswordFormValues, ROUTES, forgotPasswordSchema } from '@/utils/constants';
import { authService } from '@/utils/services/auth.service';

import { getApiErrorMessage } from '@/lib/axios';
import { cn } from '@/lib/utils';

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleSubmitReset = async (data: ForgotPasswordFormValues) => {
    try {
      await authService.forgotPassword(data.email);

      toast.success('If that email exists, a reset link has been sent.');
      navigate(ROUTES.LOGIN);
    } catch (e) {
      toast.error(getApiErrorMessage(e, 'Unable to send reset email.'));
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const emailInput = document.getElementById('email') as HTMLInputElement | null;
      emailInput?.focus();
    }, 120);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        'grid overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_30px_90px_rgba(15,23,42,0.16)] lg:grid-cols-[1.05fr_0.95fr] dark:border-white/10 dark:bg-[#0d1c2d] dark:shadow-[0_40px_140px_rgba(0,0,0,0.35)]',
        className,
      )}
      {...props}
    >
      <div className="relative flex flex-col justify-between bg-white/90 px-5 py-6 sm:px-7 lg:px-8 dark:bg-[#0d1c2d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.12),transparent_40%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(214,140,255,0.15),transparent_40%)]" />
        <div className="relative">
          <div className="mb-5 flex items-center gap-3">
            <Link to={ROUTES.LANDING} className="flex items-center gap-3 transition hover:opacity-80">
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden">
                <img src="/main-logo.png" alt={`${APP_NAME} logo`} className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-base font-semibold tracking-[0.24em] text-slate-900 uppercase dark:text-white">
                  {APP_NAME}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Reset access</p>
              </div>
            </Link>
          </div>

          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-white">Forgot password</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Enter your email and we’ll send a secure link to help you regain access.
            </p>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit(handleSubmitReset)}>
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
                    placeholder="john@example.com"
                    className="h-11 rounded-2xl border border-slate-200 bg-white pr-3 pl-10 text-sm text-slate-900 shadow-inner shadow-slate-900/5 transition placeholder:text-slate-400 focus:border-violet-400/70 focus:ring-0 dark:border-white/10 dark:bg-[#071424] dark:text-white dark:shadow-black/20 dark:placeholder:text-slate-500 dark:focus:border-[#d68cff]/60"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-[0.7rem] text-rose-400">{errors.email.message}</p>}
              </Field>

              <Button
                type="submit"
                className="h-11 w-full cursor-pointer rounded-2xl bg-[#d68cff] text-sm font-semibold text-white shadow-lg shadow-[#d68cff]/25 transition hover:brightness-110"
                disabled={isSubmitting}
              >
                <div className="flex items-center justify-center gap-2">
                  {isSubmitting && (
                    <Spin indicator={<LoadingOutlined spin style={{ fontSize: 24 }} />} className="size-4" />
                  )}
                  Send reset link
                </div>
              </Button>

              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Remembered your password?{' '}
                <Link
                  to={ROUTES.LOGIN}
                  className="font-semibold text-violet-700 transition hover:text-violet-600 dark:text-[#d68cff] dark:hover:text-[#f0b8ff]"
                >
                  Sign in
                </Link>
              </p>
            </FieldGroup>
          </form>
        </div>
      </div>

      <AuthIllustration />
    </div>
  );
}
