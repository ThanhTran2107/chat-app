import { useAuthStore } from '@/stores/use-auth-store';
import { useThemeStore } from '@/stores/use-theme-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { SocialButtons } from '@/pages/login-page/components/social-buttons.component';

import { Checkbox } from '@/components/antd/checkbox.component';
import { Spin } from '@/components/antd/spin.component';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { APP_NAME, type LoginFormValues, ROUTES, loginSchema } from '@/utils/constants';

import { getApiErrorMessage } from '@/lib/axios';
import { cn } from '@/lib/utils';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { logIn } = useAuthStore();
  const { isDark } = useThemeStore();

  const savedEmail = typeof window !== 'undefined' ? (localStorage.getItem('rememberedEmail') ?? '') : '';

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

  // Handle form submission for user login
  const handleLogin = async (data: LoginFormValues) => {
    try {
      const { email, password, rememberMe } = data;

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      await logIn(email, password);

      toast.success('Login successful!');
      navigate(ROUTES.CHAT, { replace: true });
    } catch (e) {
      toast.error(getApiErrorMessage(e, 'Login failed. Please try again.'));
    }
  };

  return (
    <div className={cn('flex flex-col gap-1', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="px-4 py-10 md:px-5 md:py-2.5" onSubmit={handleSubmit(handleLogin)}>
            <FieldGroup className="gap-5">
              {/* Header */}
              <div className="flex flex-col text-center">
                <img src="/main-logo.png" alt="Logo" className="mx-auto h-15 w-auto" />
                <div className="text-2xl font-semibold whitespace-nowrap">Welcome back to {APP_NAME}</div>
                <p className="text-muted-foreground text-[0.7rem] italic">
                  Enter your credentials to access your workspace
                </p>
              </div>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email" className="text-xs">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="h-7 text-[0.7rem] placeholder:text-[0.7rem] md:text-[0.7rem]"
                  {...register('email')}
                />

                {errors.email && <p className="text-destructive text-[0.6rem]">{errors.email.message}</p>}
              </Field>

              {/* Password row */}
              <Field>
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel htmlFor="password" className="text-xs">
                    Password
                  </FieldLabel>

                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
                    className="cursor-pointer text-[0.7rem] font-medium text-sky-600 italic hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="hide-password-toggle h-7 pr-7 text-[0.7rem] placeholder:text-[0.7rem] md:text-[0.7rem]"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-1.5 flex items-center"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>

                {errors.password && <p className="text-destructive text-[0.6rem]">{errors.password.message}</p>}

                <div className="flex items-center gap-2">
                  <Controller
                    control={control}
                    name="rememberMe"
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onChange={event => field.onChange(event.target.checked)}
                        className={isDark ? 'text-white/80!' : 'text-black/80!'}
                        style={{ color: isDark ? '#ffffff' : '#000000' }}
                      >
                        <span className="text-xs leading-snug font-medium">Remember me</span>
                      </Checkbox>
                    )}
                  />
                </div>
              </Field>

              {/* Submit */}
              <Button
                type="submit"
                className="hover:bg-primary/80 w-full cursor-pointer"
                size="sm"
                disabled={isSubmitting}
              >
                <div className="flex items-center justify-center gap-2">
                  {isSubmitting && <Spin className="size-4" />}
                  Login
                </div>
              </Button>

              {/* Divider */}
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card text-[0.7rem] italic *:data-[slot=separator]:opacity-30">
                Or continue with
              </FieldSeparator>

              {/* Social buttons */}
              <SocialButtons />

              {/* Register link */}
              <p className="text-muted-foreground text-center text-[0.7rem] italic">
                Do not have any accounts?{' '}
                <a href={ROUTES.REGISTER} className="cursor-pointer font-medium underline underline-offset-4">
                  Register
                </a>
              </p>
            </FieldGroup>
          </form>

          <div className="hidden flex-col items-center bg-violet-300 md:flex">
            <img
              src="/placeholderSignUp.png"
              alt="Sign up illustration"
              className="mb-10 min-h-0 w-full flex-1 object-contain"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
