import { useAuthStore } from '@/stores/use-auth-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import { Spin } from '@/components/antd/spin.component';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { ROUTES, type RegisterFormValues, registerSchema } from '@/utils/constants';

import { getApiErrorMessage } from '@/lib/axios';
import { cn } from '@/lib/utils';

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuthStore();
  const navigate = useNavigate();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  // Handle form submission for user registration
  const handleRegister = async (data: RegisterFormValues) => {
    try {
      const { username, password, email, firstName, lastName } = data;

      await register(username, password, email, lastName, firstName);

      toast.success('Registration successful! Please log in.');
      navigate(ROUTES.LOGIN);
    } catch (e) {
      toast.error(getApiErrorMessage(e, 'Registration failed. Please try again.'));
    }
  };

  return (
    <div className={cn('flex flex-col gap-1', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="px-4 py-10 md:px-5 md:py-2.5" onSubmit={handleSubmit(handleRegister)}>
            <FieldGroup className="gap-5">
              {/* Header */}
              <div className="flex flex-col text-center">
                <img src="/logo.svg" alt="Logo" className="mx-auto h-7 w-auto" />
                <div className="text-2xl font-semibold whitespace-nowrap">Create your account</div>
                <p className="text-muted-foreground text-[0.7rem] italic">Fill in the details below to get started</p>
              </div>

              {/* Name row */}
              <div className="grid grid-cols-2 gap-2">
                <Field>
                  <FieldLabel htmlFor="first-name" className="text-xs">
                    First name
                  </FieldLabel>
                  <Input
                    id="first-name"
                    type="text"
                    placeholder="John"
                    className="h-7 text-[0.7rem] placeholder:text-[0.7rem] md:text-[0.7rem]"
                    {...formRegister('firstName')}
                  />

                  {errors.firstName && <p className="text-destructive text-[0.6rem]">{errors.firstName.message}</p>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="last-name" className="text-xs">
                    Last name
                  </FieldLabel>
                  <Input
                    id="last-name"
                    type="text"
                    placeholder="Doe"
                    className="h-7 text-[0.7rem] placeholder:text-[0.7rem] md:text-[0.7rem]"
                    {...formRegister('lastName')}
                  />

                  {errors.lastName && <p className="text-destructive text-[0.6rem]">{errors.lastName.message}</p>}
                </Field>
              </div>

              {/* Username */}
              <Field>
                <FieldLabel htmlFor="username" className="text-xs">
                  Username
                </FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  className="h-7 text-[0.7rem] placeholder:text-[0.7rem] md:text-[0.7rem]"
                  {...formRegister('username')}
                />

                {errors.username && <p className="text-destructive text-[0.6rem]">{errors.username.message}</p>}
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email" className="text-xs">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  className="h-7 text-[0.7rem] placeholder:text-[0.7rem] md:text-[0.7rem]"
                  {...formRegister('email')}
                />

                {errors.email && <p className="text-destructive text-[0.6rem]">{errors.email.message}</p>}
              </Field>

              {/* Password row */}
              <div className="grid grid-cols-2 gap-2">
                <Field>
                  <FieldLabel htmlFor="password" className="text-xs">
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="h-7 pr-7 text-[0.7rem] placeholder:text-[0.7rem] md:text-[0.7rem]"
                      {...formRegister('password')}
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
                      className="h-7 pr-7 text-[0.7rem] placeholder:text-[0.7rem] md:text-[0.7rem]"
                      {...formRegister('confirmPassword')}
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
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="hover:bg-primary/80 w-full cursor-pointer"
                size="sm"
                disabled={isSubmitting}
              >
                <div className="flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Spin />
                      Creating...
                    </>
                  ) : (
                    'Create account'
                  )}
                </div>
              </Button>

              {/* Sign in link */}
              <p className="text-muted-foreground text-center text-[0.7rem] italic">
                Already have an account?{' '}
                <a href={ROUTES.LOGIN} className="cursor-pointer font-medium underline underline-offset-4">
                  Login
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
