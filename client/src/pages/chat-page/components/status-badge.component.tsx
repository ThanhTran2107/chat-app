import { cn } from '@/lib/utils.ts';

export const StatusBadge = ({ status }: { status: 'online' | 'offline' }) => {
  return (
    <div
      className={cn(
        'border-card absolute -right-0.5 -bottom-0.5 size-4 rounded-full border-2',
        status === 'online' ? 'status-online' : 'status-offline',
      )}
    ></div>
  );
};
