import { type FriendRequest } from '@/types/user';

import { type ReactNode } from 'react';

import { UserAvatar } from '@/pages/chat-page/components/friends/user-avatar.component';

interface FriendRequestItemProps {
  requestInfo: FriendRequest;
  actions: ReactNode;
  type: 'sent' | 'received';
}

export const FriendRequestItem = ({ requestInfo, actions, type }: FriendRequestItemProps) => {
  if (!requestInfo) return;

  const info = type === 'sent' ? requestInfo.to : requestInfo.from;
  const rowAlignment = type === 'received' && requestInfo.message ? 'items-start' : 'items-center';

  if (!info) return;

  return (
    <div className="border-primary-foreground flex items-center justify-between rounded-lg border p-3 shadow-md">
      <div className={`flex ${rowAlignment} gap-3`}>
        <UserAvatar type="sidebar" name={info.displayName} avatarUrl={info.avatarUrl ?? undefined} />

        <div className="min-w-0">
          <p className="font-medium">{info.displayName}</p>
          <p className="text-muted-foreground text-sm">@{info.username}</p>
          {type === 'received' && requestInfo.message && (
            <p className="text-muted-foreground mt-1 max-w-60 truncate text-sm">"{requestInfo.message}"</p>
          )}
        </div>
      </div>

      {actions && <div className="mt-3">{actions}</div>}
    </div>
  );
};
