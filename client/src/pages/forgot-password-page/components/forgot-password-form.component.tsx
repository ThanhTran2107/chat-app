import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Spin } from '@/components/antd/spin.component';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { type ForgotPasswordFormValues, ROUTES, forgotPasswordSchema } from '@/utils/constants';
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

  return (
    <div className={cn('flex flex-col gap-1', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="px-4 py-10 md:px-5 md:py-2.5" onSubmit={handleSubmit(handleSubmitReset)}>
            <FieldGroup className="gap-5">
              <div className="flex flex-col text-center">
                <img src="/main-logo.png" alt="Logo" className="mx-auto h-15 w-auto" />
                <div className="text-2xl font-semibold whitespace-nowrap">Forgot password</div>
                <p className="text-muted-foreground text-[0.7rem] italic">
                  Enter your email and we’ll send a link to reset your password.
                </p>
              </div>

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

              <Button
                type="submit"
                className="hover:bg-primary/80 w-full cursor-pointer"
                size="sm"
                disabled={isSubmitting}
              >
                <div className="flex items-center justify-center gap-2">
                  {isSubmitting && <Spin className="size-4" />}
                  Send reset link
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
