import { SignupForm } from "@/components/signup-form";

export const RegisterPage = () => {
  return (
    <div className="flex min-h-screen min-w-max flex-col items-center justify-center bg-muted p-4 md:p-6">
      <div className="w-full max-w-sm md:max-w-2xl">
        <SignupForm />
      </div>
    </div>
  );
};
