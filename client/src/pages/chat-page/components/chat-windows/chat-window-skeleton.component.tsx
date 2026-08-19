import map from 'lodash-es/map';

import { Skeleton } from '@/components/antd/skeleton.component';

import { cn } from '@/lib/utils';

type SkeletonMessage = {
  side: 'left' | 'right';
  lines: number;
  hasAvatar: boolean;
};

type SkeletonItem = { type: 'time' } | { type: 'message'; data: SkeletonMessage };

const LINE_HEIGHT: Record<number, string> = {
  1: 'h-12',
  2: 'h-16',
  3: 'h-20',
  4: 'h-24',
};

const INITIAL_SKELETON: SkeletonItem[] = [
  { type: 'time' },
  { type: 'message', data: { side: 'left', lines: 2, hasAvatar: true } },
  { type: 'message', data: { side: 'right', lines: 1, hasAvatar: false } },
  { type: 'message', data: { side: 'left', lines: 3, hasAvatar: true } },
  { type: 'message', data: { side: 'right', lines: 2, hasAvatar: false } },
  { type: 'message', data: { side: 'left', lines: 1, hasAvatar: false } },
  { type: 'message', data: { side: 'right', lines: 3, hasAvatar: false } },
  { type: 'message', data: { side: 'left', lines: 2, hasAvatar: true } },
  { type: 'message', data: { side: 'right', lines: 1, hasAvatar: false } },
];

const SkeletonBubble = ({ lines, className }: { lines: number; className?: string }) => (
  <Skeleton
    active
    className={cn('bg-muted! rounded-2xl', LINE_HEIGHT[lines], 'w-full max-w-xs lg:max-w-md', className)}
  />
);

export const ChatWindowSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col gap-3 overflow-y-auto p-4">
      {map(INITIAL_SKELETON, (item, index) => {
        if (item.type === 'time') {
          return (
            <div key={`time-${index}`} className="flex justify-center">
              <Skeleton active className="bg-muted! h-3 w-20 rounded-md" />
            </div>
          );
        }

        const { side, lines, hasAvatar } = item.data;

        return (
          <div
            key={`msg-${index}`}
            className={cn('flex items-start gap-2', side === 'right' ? 'justify-end' : 'justify-start')}
          >
            {side === 'left' && hasAvatar && <Skeleton.Avatar active size={32} />}
            {side === 'left' && !hasAvatar && <div className="size-8" />}
            <SkeletonBubble lines={lines} />
          </div>
        );
      })}
    </div>
  );
};
