import { useAuthStore } from '@/stores/use-auth-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { toast } from 'sonner';

import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { SocialButtons } from '@/pages/login-page/components/social-buttons.component';

import { Checkbox } from '@/components/antd/checkbox.component';
import { Spin } from '@/components/antd/spin.component';
import { AuthIllustration } from '@/components/ui/auth-illustration.component';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { APP_NAME, type LoginFormValues, ROUTES, loginSchema, LOCAL_STORAGE_KEYS } from '@/utils/constants';

import { getApiErrorMessage } from '@/lib/axios';
import { cn } from '@/lib/utils';

const { REMEMBERED_EMAIL } = LOCAL_STORAGE_KEYS;

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { logIn } = useAuthStore();

  const savedEmail = typeof window !== 'undefined' ? (localStorage.getItem(REMEMBERED_EMAIL) ?? '') : '';

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: savedEmail,
      password: '',
      rememberMe: !!savedEmail,
    },
  });

  const handleLogin = async (data: LoginFormValues) => {
    try {
      const { email, password, rememberMe } = data;

      if (rememberMe) {
        localStorage.setItem(REMEMBERED_EMAIL, email);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL);
      }

      await logIn(email, password);

      toast.success('Login successful!');
      navigate(ROUTES.CHAT, { replace: true });
    } catch (e) {
      toast.error(getApiErrorMessage(e, 'Login failed. Please try again.'));
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
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden">
              <img src="/main-logo.png" alt={`${APP_NAME} logo`} className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-[0.24em] text-slate-900 uppercase dark:text-white">
                {APP_NAME}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Secure communication</p>
            </div>
          </div>

          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-white">Welcome back</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Enter your details to continue your journey with {APP_NAME}.
            </p>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit(handleLogin)}>
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

              <Field>
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel
                    htmlFor="password"
                    className="text-[0.7rem] font-semibold tracking-[0.22em] text-slate-600 uppercase dark:text-slate-400"
                  >
                    Password
                  </FieldLabel>
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
                    className="cursor-pointer text-[0.72rem] font-medium text-violet-700 transition hover:text-violet-600 dark:text-[#d68cff] dark:hover:text-[#f0b8ff]"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="hide-password-toggle h-11 rounded-2xl border border-slate-200 bg-white pr-11 pl-10 text-sm text-slate-900 shadow-inner shadow-slate-900/5 transition placeholder:text-slate-400 focus:border-violet-400/70 focus:ring-0 dark:border-white/10 dark:bg-[#071424] dark:text-white dark:shadow-black/20 dark:placeholder:text-slate-500 dark:focus:border-[#d68cff]/60"
                    placeholder="Enter your password"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute inset-y-0 right-3 flex cursor-pointer items-center text-slate-500 transition hover:text-slate-800 dark:hover:text-slate-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[0.7rem] text-rose-400">{errors.password.message}</p>}

                <div className="flex items-center justify-between pt-1">
                  <Controller
                    control={control}
                    name="rememberMe"
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onChange={event => field.onChange(event.target.checked)}
                        className="text-slate-600 dark:text-slate-300"
                      >
                        <span className="text-sm leading-snug text-slate-600 dark:text-slate-300">Remember me</span>
                      </Checkbox>
                    )}
                  />
                </div>
              </Field>

              <Button
                type="submit"
                className="h-11 w-full cursor-pointer rounded-2xl bg-[#d68cff] text-sm font-semibold text-white shadow-lg shadow-[#d68cff]/25 transition hover:brightness-110"
                disabled={isSubmitting}
              >
                <div className="flex items-center justify-center gap-2">
                  {isSubmitting && <Spin className="size-4" />}
                  Login
                </div>
              </Button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                <span className="text-[0.7rem] tracking-[0.26em] text-slate-500 uppercase dark:text-slate-500">
                  Or continue with
                </span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
              </div>

              <SocialButtons />

              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Don&apos;t have an account?{' '}
                <Link
                  to={ROUTES.REGISTER}
                  className="font-semibold text-violet-700 transition hover:text-violet-600 dark:text-[#d68cff] dark:hover:text-[#f0b8ff]"
                >
                  Sign up
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
