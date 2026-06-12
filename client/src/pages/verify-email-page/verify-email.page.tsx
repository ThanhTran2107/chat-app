import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { ROUTES } from '@/utils/constants';
import { authService } from '@/utils/services/auth.service';

import { getApiErrorMessage } from '@/lib/axios';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [message, setMessage] = useState('Verifying your email...');

  const token = searchParams.get('token') ?? '';

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('failed');
        setMessage('Verification token is missing from the link.');
        setLoading(false);

        return;
      }

      try {
        const res = await authService.verifyEmail(token);

        setStatus('success');
        setMessage(res.message || 'Your email has been verified successfully.');
      } catch (error) {
        setStatus('failed');
        setMessage(getApiErrorMessage(error, 'Unable to verify your email. Please try again.'));
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="bg-muted flex min-h-screen min-w-max flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-sm md:max-w-2xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="flex flex-col gap-5 px-4 py-10 md:px-5 md:py-2.5">
              <div className="flex flex-col text-center">
                <img src="/logo.svg" alt="Logo" className="mx-auto h-7 w-auto" />
                <div className="text-2xl font-semibold whitespace-nowrap">Verify your email</div>
              </div>

              <p className="text-muted-foreground text-center text-sm">{message}</p>

              <div className="grid gap-3">
                <Button
                  type="button"
                  className="hover:bg-primary/80 w-full"
                  size="sm"
                  onClick={() => navigate(ROUTES.LOGIN)}
                  disabled={loading}
                >
                  Back to login
                </Button>

                {status === 'failed' && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    size="sm"
                    onClick={() => navigate(ROUTES.RESEND_VERIFICATION)}
                  >
                    Resend verification email
                  </Button>
                )}
              </div>
            </div>

            <div className="hidden flex-col items-center bg-violet-300 md:flex">
              <img
                src="/placeholderSignUp.png"
                alt="Email verification illustration"
                className="mb-10 min-h-0 w-full flex-1 object-contain"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
