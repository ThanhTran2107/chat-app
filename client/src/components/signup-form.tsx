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

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="px-4 py-10 md:px-5 md:py-2.5">
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
                    required
                  />
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
                    required
                  />
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
                  required
                />
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
                  required
                />
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
                      required
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
                      required
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
                </Field>
              </div>
              {/* Submit */}
              <Button
                type="submit"
                className="w-full cursor-pointer hover:bg-primary/80"
                size="sm"
              >
                Create Account
              </Button>

              {/* Divider */}
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card italic text-[0.7rem]">
                Or continue with
              </FieldSeparator>

              {/* Social buttons */}
              <div className="grid grid-cols-2 justify-items-center">
                <Button
                  variant="outline"
                  type="button"
                  className="w-22"
                  size="sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-4"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="sr-only">Sign up with Google</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-22"
                  size="sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-4"
                  >
                    <path
                      d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                      fill="#0082FB"
                    />
                  </svg>
                  <span className="sr-only">Sign up with Meta</span>
                </Button>
              </div>

              {/* Sign in link */}
              <p className="text-center text-[0.7rem] text-muted-foreground italic">
                Already have an account?{" "}
                <a
                  href="#"
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
