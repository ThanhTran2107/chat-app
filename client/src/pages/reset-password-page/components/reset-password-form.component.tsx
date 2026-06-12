import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Spin } from '@/components/antd/spin.component';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { ROUTES, type ResetPasswordFormValues, resetPasswordSchema } from '@/utils/constants';
import { authService } from '@/utils/services/auth.service';

import { getApiErrorMessage } from '@/lib/axios';
import { cn } from '@/lib/utils';

export function ResetPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleResetPassword = async (data: ResetPasswordFormValues) => {
    if (!token) return toast.error('Reset token is missing from the link.');

    try {
      await authService.resetPassword(token, data.password);

      toast.success('Password reset successfully! Please log in.');
      navigate(ROUTES.LOGIN);
    } catch (e) {
      toast.error(getApiErrorMessage(e, 'Unable to reset password.'));
    }
  };

  return (
    <div className={cn('flex flex-col gap-1', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="px-4 py-10 md:px-5 md:py-2.5" onSubmit={handleSubmit(handleResetPassword)}>
            <FieldGroup className="gap-5">
              <div className="flex flex-col text-center">
                <img src="/logo.svg" alt="Logo" className="mx-auto h-7 w-auto" />
                <div className="text-2xl font-semibold whitespace-nowrap">Reset password</div>
                <p className="text-muted-foreground text-[0.7rem] italic">Enter a new password for your account.</p>
              </div>

              <Field>
                <FieldLabel htmlFor="password" className="text-xs">
                  New password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
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
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm-password" className="text-xs">
                  Confirm password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    className="hide-password-toggle h-7 pr-7 text-[0.7rem] placeholder:text-[0.7rem] md:text-[0.7rem]"
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-1.5 flex items-center"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive text-[0.6rem]">{errors.confirmPassword.message}</p>
                )}
              </Field>

              <Button
                type="submit"
                className="hover:bg-primary/80 w-full cursor-pointer"
                size="sm"
                disabled={isSubmitting}
              >
                <div className="flex items-center justify-center gap-2">
                  {isSubmitting && <Spin className="size-4" />}
                  Reset password
                </div>
              </Button>

              <p className="text-muted-foreground text-center text-[0.7rem] italic">
                Remembered your password?{' '}
                <a href={ROUTES.LOGIN} className="cursor-pointer font-medium underline underline-offset-4">
                  Login
                </a>
              </p>
            </FieldGroup>
          </form>

          <div className="hidden flex-col items-center bg-violet-300 md:flex">
            <img
              src="/placeholderSignUp.png"
              alt="Password reset illustration"
              className="mb-10 min-h-0 w-full flex-1 object-contain"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
