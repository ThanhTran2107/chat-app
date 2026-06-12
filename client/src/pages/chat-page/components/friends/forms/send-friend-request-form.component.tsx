import type { User } from '@/types/user';
import TextArea from 'antd/es/input/TextArea';
import { UserPlus } from 'lucide-react';

import { type Control, Controller } from 'react-hook-form';

import type { IFormValues } from '@/pages/chat-page/components/add-friend-model.component.tsx';
import { UserAvatar } from '@/pages/chat-page/components/friends/user-avatar.component';

import { Spin } from '@/components/antd/spin.component';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface SendFriendRequestFormProps {
  control: Control<IFormValues>;
  loading: boolean;
  searchUser?: User;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

export const SendFriendRequestForm = ({
  control,
  loading,
  searchUser,
  onSubmit,
  onBack,
}: SendFriendRequestFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        <span className="success-message">🎇 Great news ! We found </span>

        {searchUser && (
          <div className="border-border/50 bg-surface mt-4 rounded-2xl border p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <UserAvatar
                type="sidebar"
                name={searchUser.displayName ?? searchUser.username}
                avatarUrl={searchUser.avatarUrl ?? undefined}
              />

              <div>
                <p className="text-foreground font-semibold">{searchUser.displayName}</p>
                <p className="text-muted-foreground text-xs">@{searchUser.username}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-2 space-y-2">
          <Label className="text-sm font-semibold" htmlFor="message">
            Introduction
          </Label>

          <Controller
            control={control}
            name="message"
            render={({ field }) => (
              <TextArea
                id="message"
                rows={5}
                maxLength={200}
                placeholder="Hi there! Would you like to connect?"
                className="glass border-border/50 focus:border-primary/50 transition-smooth beautiful-scrollbar resize-none"
                {...field}
              />
            )}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="glass hover:text-destructive flex-1 cursor-pointer"
            onClick={onBack}
          >
            Back
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-chat transition-smooth flex-1 cursor-pointer text-white hover:opacity-90"
          >
            {loading ? (
              <Spin />
            ) : (
              <>
                <UserPlus className="size-4" /> Add friend
              </>
            )}
          </Button>
        </DialogFooter>
      </div>
    </form>
  );
};
