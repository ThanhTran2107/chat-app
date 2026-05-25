import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormValues } from "@/utils/constants";
import { SocialButtons } from "@/components/social-buttons";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="px-4 py-10 md:px-5 md:py-2.5"
            onSubmit={handleSubmit((data) => {
              console.log(data);
            })}
          >
            <FieldGroup className="gap-5">
              {/* Header */}
              <div className="flex flex-col text-center">
                <img
                  src="/logo.svg"
                  alt="Logo"
                  className="mx-auto h-7 w-auto "
                />
                <div className="text-2xl font-semibold whitespace-nowrap">
                  Create your account
                </div>
                <p className="text-[0.7rem] italic text-muted-foreground">
                  Fill in the details below to get started
                </p>
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
                    className="h-7"
                    {...register("firstName")}
                  />

                  {errors.firstName && (
                    <p className="text-[0.6rem] text-destructive">
                      {errors.firstName.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="last-name" className="text-xs">
                    Last name
                  </FieldLabel>
                  <Input
                    id="last-name"
                    type="text"
                    placeholder="Doe"
                    className="h-7"
                    {...register("lastName")}
                  />

                  {errors.lastName && (
                    <p className="text-[0.6rem] text-destructive">
                      {errors.lastName.message}
                    </p>
                  )}
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
                  className="h-7"
                  {...register("username")}
                />

                {errors.username && (
                  <p className="text-[0.6rem] text-destructive">
                    {errors.username.message}
                  </p>
                )}
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
                  className="h-7"
                  {...register("email")}
                />

                {errors.email && (
                  <p className="text-[0.6rem] text-destructive">
                    {errors.email.message}
                  </p>
                )}
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
                      type={showPassword ? "text" : "password"}
                      className="h-7 pr-7"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-1.5 flex items-center text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-[0.6rem] text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirm-password" className="text-xs">
                    Confirm password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      className="h-7 pr-7"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute inset-y-0 right-1.5 flex items-center text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="text-[0.6rem] text-destructive">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </Field>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full cursor-pointer hover:bg-primary/80"
                size="sm"
                disabled={isSubmitting}
              >
                Create Account
              </Button>

              {/* Divider */}
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card italic text-[0.7rem]">
                Or continue with
              </FieldSeparator>

              {/* Social buttons */}
              <SocialButtons />

              {/* Sign in link */}
              <p className="text-center text-[0.7rem] text-muted-foreground italic">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="cursor-pointer font-medium underline underline-offset-4"
                >
                  Login
                </a>
              </p>
            </FieldGroup>
          </form>

          <div className="hidden flex-col items-center bg-violet-300 md:flex">
            <img
              src="/placeholderSignUp.png"
              alt="Sign up illustration"
              className="min-h-0 w-full flex-1 object-contain mb-10"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
