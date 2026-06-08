import { useSocketStore } from '@/stores/use-socket-store';
import type { User } from '@/types/user.ts';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import { cn } from '@/lib/utils';

import { UserAvatar } from '../friends/user-avatar.component';
import { AvatarUploader } from './avatar-uploader.component';

interface ProfileCardProps {
  user: User | null;
}

export const ProfileCard = ({ user }: ProfileCardProps) => {
  const { onlineUsers } = useSocketStore();

  if (!user) return null;

  const bio = user.bio ?? 'No bio available';

  const isOnline = onlineUsers.includes(user._id) ? true : false;

  return (
    <Card className="h-40 overflow-hidden bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 p-0">
      <CardContent className="mt-10 flex flex-col items-center gap-6 pb-8 sm:flex-row sm:items-end">
        <div className="relative">
          <UserAvatar
            className="shadow-lg ring-4 ring-white"
            type="profile"
            name={user.displayName}
            avatarUrl={user.avatarUrl ?? undefined}
          />

          <AvatarUploader />
        </div>

        <div className="mb-2 flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-semibold tracking-tight text-white">{user.displayName}</h1>
          <p className="mt-2 line-clamp-2 max-w-lg text-sm text-white/70">{bio}</p>
        </div>

        <Badge
          className={cn(
            'mb-2 flex items-center gap-1 capitalize',
            isOnline ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700',
          )}
        >
          <div className={cn('size-2 animate-pulse rounded-full', isOnline ? 'bg-green-500' : 'bg-slate-500')} />
          {isOnline ? 'online' : 'offline'}
        </Badge>
      </CardContent>
    </Card>
  );
};
