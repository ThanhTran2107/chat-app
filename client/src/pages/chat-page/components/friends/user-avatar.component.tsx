import { UserX2 } from 'lucide-react';

import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.component';

import { APP_NAME, DELETED_ACCOUNT_LABEL } from '@/utils/constants';

import { cn } from '@/lib/utils.ts';

interface IUserAvatarProps {
  type: 'sidebar' | 'chat' | 'profile';
  name: string;
  avatarUrl?: string;
  className?: string;
}

const UserAvatarComponent = ({ type, name, avatarUrl, className }: IUserAvatarProps) => {
  const isDeleted = name === DELETED_ACCOUNT_LABEL;
  const bgColor = isDeleted ? 'bg-slate-600' : !avatarUrl ? 'bg-blue-500' : '';

  if (!name) name = APP_NAME;

  const avatarSizeClass =
    type === 'sidebar' ? 'size-12 text-base' : type === 'chat' ? 'size-8 text-sm' : 'size-24 text-3xl shadow-md';
  const fallbackTextClass = type === 'profile' ? 'text-3xl' : type === 'sidebar' ? 'text-base' : 'text-sm';
  const iconSizeClass = type === 'profile' ? 'size-10' : type === 'sidebar' ? 'size-6' : 'size-5';

  const fallbackPositionClass = type === 'profile' ? 'items-end pb-7' : '';

  return (
    <Avatar className={cn(className ?? '', avatarSizeClass)}>
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback className={`${bgColor} font-semibold text-white ${fallbackTextClass} ${fallbackPositionClass}`}>
        {isDeleted ? <UserX2 className={iconSizeClass} /> : name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};

export const UserAvatar = React.memo(UserAvatarComponent);
UserAvatar.displayName = 'UserAvatar';
