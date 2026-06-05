import { UserAvatar } from '@/pages/chat-page/components/friends/user-avatar.component';
import { type FriendRequest } from '@/types/user';
import { type ReactNode } from 'react';

interface FriendRequestItemProps {
  requestInfo: FriendRequest;
  actions: ReactNode;
  type: 'sent' | 'received';
}

export const FriendRequestItem = ({ requestInfo, actions, type }: FriendRequestItemProps) => {
  if (!requestInfo) return;

  const info = type === 'sent' ? requestInfo.to : requestInfo.from;

  if (!info) return;

  return (
    <div className="border-primary-foreground flex items-center justify-between rounded-lg border p-3 shadow-md">
      <div className="flex items-center gap-3">
        <UserAvatar type="sidebar" name={info.displayName} />

        <div>
          <p className="font-medium">{info.displayName}</p>
          <p className="text-muted-foreground text-sm">@{info.username}</p>
        </div>
      </div>

      {actions && <div className="mt-3">{actions}</div>}
    </div>
  );
};
