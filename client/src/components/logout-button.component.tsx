import { useAuthStore } from '@/stores/use-auth-store';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

import { ROUTES } from '@/utils/constants';

import { getApiErrorMessage } from '@/lib/axios';

export const LogoutButton = () => {
  const { logOut } = useAuthStore();
  const navigate = useNavigate();

  // Handle the logout process when the button is clicked
  const handleLogOut = async () => {
    try {
      await logOut();

      toast.success('Logout successful!');
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (e) {
      console.error('Logout error:', e);
      toast.error(getApiErrorMessage(e, 'Logout failed. Please try again.'));
    }
  };

  return (
    <Button className="flex w-full cursor-pointer justify-start" variant="completeGhost" onClick={handleLogOut}>
      <LogOut className="text-destructive -ml-2" /> Log out
    </Button>
  );
};
