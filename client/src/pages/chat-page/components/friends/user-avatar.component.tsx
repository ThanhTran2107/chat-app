import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';

import { cn } from '@/lib/utils.ts';

interface IUserAvatarProps {
  type: 'sidebar' | 'chat' | 'profile';
  name: string;
  avatarUrl?: string;
  className?: string;
}

export const UserAvatar = ({ type, name, avatarUrl, className }: IUserAvatarProps) => {
  const bgColor = !avatarUrl ? 'bg-blue-500' : '';

  if (!name) name = 'Moji';

  return (
    <Avatar
      className={cn(
        className ?? '',
        type === 'sidebar' ? 'size-12 text-base' : type === 'chat' ? 'size-8 text-sm' : 'size-24 text-3xl shadow-md',
      )}
    >
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback className={`${bgColor} font-semibold text-white`}>{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};
