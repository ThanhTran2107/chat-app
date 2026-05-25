import { LoginForm } from "@/components/login-form";

export const LoginPage = () => {
  return (
    <div className="flex min-h-screen min-w-max flex-col items-center justify-center bg-muted p-4 md:p-6">
      <div className="w-full max-w-sm md:max-w-2xl">
        <LoginForm />
      </div>
    </div>
  );
};
