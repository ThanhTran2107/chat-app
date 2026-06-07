import type { Friend } from '@/types/user';
import isEmpty from 'lodash-es/isEmpty';
import { X } from 'lucide-react';

import { UserAvatar } from '../friends/user-avatar.component';

interface SelectedUserListProps {
  invitedUsers: Friend[];
  onRemove: (user: Friend) => void;
}

export const SelectedUserList = ({ invitedUsers, onRemove }: SelectedUserListProps) => {
  if (isEmpty(invitedUsers)) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {invitedUsers.map(user => (
        <div key={user._id} className="bg-muted flex items-center gap-1 rounded-full px-3 py-1 text-sm">
          <UserAvatar type="chat" name={user.displayName} avatarUrl={user.avatarUrl} />
          <span>{user.displayName}</span>

          <X className="hover:text-destructive size-3 cursor-pointer" onClick={() => onRemove(user)} />
        </div>
      ))}
    </div>
  );
};
