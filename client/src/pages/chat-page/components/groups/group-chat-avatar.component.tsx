import { type Participant } from '@/types/chat.ts';
import { Ellipsis } from 'lucide-react';

import { UserAvatar } from '../friends/user-avatar.component';

interface GroupChatAvatarProps {
  participants: Participant[]; // Assuming Participant is a type that includes user info and their role in the group
  type: 'sidebar' | 'chat';
}

export const GroupChatAvatar = ({ participants, type }: GroupChatAvatarProps) => {
  const avatars = [];
  const limit = Math.min(participants.length, 3);

  for (let i = 0; i < limit; i++) {
    const member = participants[i];
    avatars.push(
      <UserAvatar key={i} type={type} name={member.displayName ?? 'Moji'} avatarUrl={member.avatarUrl ?? undefined} />,
    );
  }

  return (
    <div className="*:data-[slot=avatar]:ring-background *data-[slot=avatar]:ring-2 relative flex -space-x-2">
      {avatars}
      {participants.length > limit && (
        <div className="bg-muted ring-background text-muted-foreground z-10 flex size-8 items-center justify-center rounded-full ring-2">
          <Ellipsis className="size-4" />
        </div>
      )}
    </div>
  );
};
