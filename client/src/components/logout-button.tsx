import { ROUTES } from '@/utils/constants';
import { getApiErrorMessage } from '@/lib/axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/stores/useAuthStore';

export const LogoutButton = () => {
  const { logOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await logOut();

      toast.success('Logout successful!');
      navigate(ROUTES.LOGIN);
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
