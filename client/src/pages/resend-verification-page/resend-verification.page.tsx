import { Spin } from 'antd';
import { toast } from 'sonner';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { ROUTES } from '@/utils/constants';
import { authService } from '@/utils/services/auth.service';

export const ResendVerificationPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResend = async () => {
    try {
      setLoading(true);
      const res = await authService.resendVerificationEmail(email);
      toast.success(res.message || 'Verification email resent.');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error((error as Error).message || 'Unable to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-screen min-w-max flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-sm md:max-w-2xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="flex flex-col gap-5 px-4 py-10 md:px-5 md:py-2.5">
              <div className="flex flex-col text-center">
                <img src="/logo.svg" alt="Logo" className="mx-auto h-7 w-auto" />
                <div className="text-2xl font-semibold whitespace-nowrap">Resend verification</div>
                <p className="text-muted-foreground text-[0.7rem] italic">
                  Enter your email to receive a new verification link.
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email" className="text-xs">
                  Email
                </FieldLabel>

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder="user@example.com"
                  className="h-7 text-[0.7rem] placeholder:text-[0.7rem] md:text-[0.7rem]"
                />
              </Field>

              <Button
                type="button"
                className="hover:bg-primary/80 w-full"
                size="sm"
                onClick={handleResend}
                disabled={loading || !email}
              >
                {loading ? (
                  <>
                    <Spin /> Resending...
                  </>
                ) : (
                  'Resend verification email'
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="sm"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Back to Login
              </Button>
            </div>

            <div className="hidden flex-col items-center bg-violet-300 md:flex">
              <img
                src="/placeholderSignUp.png"
                alt="Resend verification illustration"
                className="mb-10 min-h-0 w-full flex-1 object-contain"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
