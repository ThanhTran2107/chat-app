import { Badge } from '../../../components/ui/badge';

export const UnreadCountBadge = ({ unreadCount }: { unreadCount: number }) => {
  return (
    <div className="pulse-ring absolute -top-1 -right-1 z-20">
      <Badge
        variant="destructive"
        className="bg-gradient-chat border-background flex size-5 items-center justify-center border p-0 text-xs"
      >
        {unreadCount > 9 ? '9+' : unreadCount}
      </Badge>
    </div>
  );
};
