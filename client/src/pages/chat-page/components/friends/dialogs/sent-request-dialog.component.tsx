import { useFriendStore } from '@/stores/use-friend-store.ts';
import isEmpty from 'lodash-es/isEmpty';
import map from 'lodash-es/map';
import { FriendRequestItem } from './friend-request-item.component';

export const SentRequestDialog = () => {
  const { sentList } = useFriendStore();

  if (!sentList || isEmpty(sentList))
    return <p className="text-muted-foreground text-sm">You have not sent any friend requests yet.</p>;

  return (
    <div className="mt-4 space-y-3">
      {map(sentList, request => (
        <FriendRequestItem
          key={request._id}
          requestInfo={request}
          actions={<p className="text-muted-foreground text-sm">Waiting for response...</p>}
          type="sent"
        />
      ))}
    </div>
  );
};
