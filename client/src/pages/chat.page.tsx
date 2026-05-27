import { useAuthStore } from '@/stores/use-auth-store';

import { LogoutButton } from '@/components/logout-button';

export const ChatPage = () => {
  const user = useAuthStore(s => s.user); // Get the current user's information from the authentication store

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <p>{user?._id}</p>
      <p>{user?.username}</p>
      <p>{user?.email}</p>
      <p>{user?.displayName}</p>
      <LogoutButton />
    </div>
  );
};
