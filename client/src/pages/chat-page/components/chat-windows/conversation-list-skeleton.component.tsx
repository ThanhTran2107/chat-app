import map from 'lodash-es/map';

import { Skeleton } from '@/components/antd/skeleton.component';

interface ConversationListSkeletonProps {
  count?: number;
}

export const ConversationListSkeleton = ({ count = 5 }: ConversationListSkeletonProps) => {
  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-2">
      {map(Array.from({ length: count }), (_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton.Avatar active size={40} />
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between">
              <Skeleton active className="bg-muted h-4 w-3/4 max-w-40 rounded-md" />
              <Skeleton active className="bg-muted h-3 w-10 rounded-md" />
            </div>
            <Skeleton active className="bg-muted h-3 w-5/6 max-w-50 rounded-md" />
          </div>
          <Skeleton active className="bg-muted h-4 w-4 rounded-full" />
        </div>
      ))}
    </div>
  );
};
