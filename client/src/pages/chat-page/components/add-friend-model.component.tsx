import { useFriendStore } from '@/stores/use-friend-store';
import type { User } from '@/types/user';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { SearchForm } from '@/pages/chat-page/components/friends/forms/search-form.component';
import { SendFriendRequestForm } from '@/pages/chat-page/components/friends/forms/send-friend-request-form.component';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { getApiErrorMessage } from '@/lib/axios';

export interface IFormValues {
  username: string;
  message: string;
}

export const AddFriendModel = () => {
  const [isFound, setIsFound] = useState<boolean | null>(null);
  const [searchUser, setSearchUser] = useState<User>();
  const [searchedUsername, setSearchedUsername] = useState('');

  const { loading, searchByUsername, sendFriendRequest } = useFriendStore();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: {
      username: '',
      message: '',
    },
  });

  const handleSearch = handleSubmit(async data => {
    const username = data.username.trim();

    if (!username) return;

    setIsFound(null);
    setSearchedUsername(username);

    try {
      const foundUser = await searchByUsername(username);

      if (foundUser) {
        setIsFound(true);
        setSearchUser(foundUser);
      } else {
        setIsFound(false);
      }
    } catch (e) {
      console.error('Error searching user:', e);
      setIsFound(false);
    }
  });

  const handleCancel = () => {
    reset();
    setSearchedUsername('');
    setIsFound(null);
  };

  const handleSendRequest = handleSubmit(async data => {
    if (!searchUser) return;

    try {
      const message = await sendFriendRequest(searchUser._id, data.message.trim());
      toast.success(message);

      handleCancel();
    } catch (e) {
      toast.error(getApiErrorMessage(e, 'Failed to send friend request. Please try again.'));
      console.error('Error sending friend request:', e);
    }
  });

  return (
    <Dialog>
      <DialogTrigger
        nativeButton={false}
        render={
          <div className="hover:bg-sidebar-accent z-10 flex size-5 cursor-pointer items-center justify-center rounded-full" />
        }
      >
        <UserPlus className="size-4" />
        <span className="sr-only">Add friend</span>
      </DialogTrigger>

      <DialogContent className="border-none sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="text-xl">Add friend</DialogTitle>
        </DialogHeader>

        {!isFound ? (
          <SearchForm
            register={register}
            control={control}
            errors={errors}
            loading={loading}
            isFound={isFound}
            searchedUsername={searchedUsername}
            onSubmit={handleSearch}
            onCancel={handleCancel}
          />
        ) : (
          <SendFriendRequestForm
            control={control}
            loading={loading}
            searchUser={searchUser}
            onSubmit={handleSendRequest}
            onBack={() => setIsFound(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
