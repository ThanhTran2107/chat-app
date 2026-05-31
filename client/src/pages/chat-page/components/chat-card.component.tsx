import { MoreHorizontal } from 'lucide-react';

import { Card } from '@/components/ui/card.tsx';

import { cn, formatOnlineTime } from '@/lib/utils.ts';

interface ChatCardProps {
  convoId: string;
  name: string;
  timeStamp?: Date;
  isActive: boolean;
  unreadCount?: number;
  leftSection: React.ReactNode;
  subtitle: React.ReactNode;
  onSelect: (id: string) => void;
}

export const ChatCard = ({
  convoId,
  name,
  timeStamp,
  isActive,
  unreadCount,
  leftSection,
  subtitle,
  onSelect,
}: ChatCardProps) => {
  return (
    <Card
      key={convoId}
      className={cn(
        'transition-smooth glass hover:bg-mute/30 cursor-pointer border-none p-3',
        isActive && 'ring-primary/50 from-primary-glow/10 to-primary-foreground bg-linear-to-tr ring-2',
      )}
      onClick={() => onSelect(convoId)}
    >
      <div className="flex items-center gap-3">
        <div className="relative">{leftSection}</div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between">
            <h3 className={cn('truncate text-sm font-semibold', unreadCount && unreadCount > 0 && 'text-foreground')}>
              {name}
            </h3>

            <span className="text-muted-foreground text-xs">{timeStamp ? formatOnlineTime(timeStamp) : ''}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-1">{subtitle}</div>
            <MoreHorizontal className="text-muted-foreground transition-smooth size-4 opacity-0 group-hover:opacity-100 hover:size-5" />
          </div>
        </div>
      </div>
    </Card>
  );
};
