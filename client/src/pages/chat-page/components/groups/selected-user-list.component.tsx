import type { Friend } from '@/types/user.type';
import map from 'lodash-es/map';
import { X } from 'lucide-react';

import * as React from 'react';

import { UserAvatar } from '../friends/user-avatar.component';

interface SelectedUserListProps {
  invitedUsers: Friend[];
  onRemove: (user: Friend) => void;
}

const SelectedUserListComponent = ({ invitedUsers, onRemove }: SelectedUserListProps) => {
  return (
    <div className="border-border/50 bg-muted/20 rounded-xl border p-3">
      <div className="flex flex-wrap gap-2">
        {map(invitedUsers, user => (
          <div key={user._id} className="bg-muted flex items-center gap-1 rounded-full px-3 py-1 text-sm">
            <UserAvatar type="chat" name={user.displayName} avatarUrl={user.avatarUrl} />
            <span>{user.displayName}</span>

            <X className="hover:text-destructive size-3 cursor-pointer" onClick={() => onRemove(user)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SelectedUserList = React.memo(SelectedUserListComponent);
SelectedUserList.displayName = 'SelectedUserList';
