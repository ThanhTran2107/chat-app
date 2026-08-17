import { PRESENCE_STATUS } from '@/utils/constants';

import { cn } from '@/lib/utils.ts';

export const StatusBadge = ({ status }: { status: typeof PRESENCE_STATUS.ONLINE | typeof PRESENCE_STATUS.OFFLINE }) => {
  return (
    <div
      className={cn(
        'border-card absolute -right-0.5 -bottom-0.5 size-4 rounded-full border-2',
        status === PRESENCE_STATUS.ONLINE ? 'status-online' : 'status-offline',
      )}
    ></div>
  );
};
