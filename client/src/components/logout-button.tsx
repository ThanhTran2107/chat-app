import { useAuthStore } from '@/stores/use-auth-store';
import { toast } from 'sonner';

import { useNavigate } from 'react-router';

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
      console.error(e);
      toast.error(getApiErrorMessage(e, 'Logout failed. Please try again.'));
    }
  };

  return (
    <button className="rounded bg-red-500 px-4 py-2 text-white" onClick={handleLogOut}>
      Logout
    </button>
  );
};
