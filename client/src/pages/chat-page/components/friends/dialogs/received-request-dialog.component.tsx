import { useFriendStore } from '@/stores/use-friend-store';
import isEmpty from 'lodash-es/isEmpty';
import map from 'lodash-es/map';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { getApiErrorMessage } from '@/lib/axios';

import { FriendRequestItem } from './friend-request-item.component';

export const ReceivedRequestDialog = () => {
  const { acceptRequest, declineRequest, receivedList, loading } = useFriendStore();

  if (!receivedList || isEmpty(receivedList))
    return <p className="text-muted-foreground text-sm">You have no received friend requests.</p>;

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest(requestId);
      toast.success('Friend request accepted!');
    } catch (e) {
      toast.error(getApiErrorMessage(e, 'Failed to accept friend request. Please try again.'));
      console.error('Error accepting friend request:', e);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await declineRequest(requestId);
      toast.info('Friend request declined.');
    } catch (e) {
      toast.error(getApiErrorMessage(e, 'Failed to decline friend request. Please try again.'));
      console.error('Error declining friend request:', e);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {map(receivedList, request => (
        <FriendRequestItem
          key={request._id}
          requestInfo={request}
          actions={
            <div className="flex gap-2">
              <Button
                className="cursor-pointer"
                size="sm"
                variant="primary"
                disabled={loading}
                onClick={() => handleAccept(request._id)}
              >
                Accept
              </Button>

              <Button
                className="cursor-pointer"
                size="sm"
                variant="destructiveOutline"
                onClick={() => handleDecline(request._id)}
                disabled={loading}
              >
                Decline
              </Button>
            </div>
          }
          type="received"
        />
      ))}
    </div>
  );
};
