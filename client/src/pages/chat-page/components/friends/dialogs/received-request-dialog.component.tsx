import { useFriendStore } from '@/stores/use-friend.store';
import isEmpty from 'lodash-es/isEmpty';
import map from 'lodash-es/map';
import { toast } from 'sonner';

import { memo, useCallback } from 'react';

import { Button } from '@/components/ui/button.component';

import { getApiErrorMessage } from '@/lib/axios';

import { FriendRequestItem } from './friend-request-item.component';

interface RequestActionsProps {
  requestId: string;
  loading: boolean;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

const RequestActions = memo(function RequestActions({ requestId, loading, onAccept, onDecline }: RequestActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        className="cursor-pointer"
        size="sm"
        variant="primary"
        disabled={loading}
        onClick={() => onAccept(requestId)}
      >
        Accept
      </Button>

      <Button
        className="cursor-pointer"
        size="sm"
        variant="destructiveOutline"
        onClick={() => onDecline(requestId)}
        disabled={loading}
      >
        Decline
      </Button>
    </div>
  );
});

export const ReceivedRequestDialog = () => {
  const acceptRequest = useFriendStore(state => state.acceptRequest);
  const declineRequest = useFriendStore(state => state.declineRequest);
  const receivedList = useFriendStore(state => state.receivedList);
  const loading = useFriendStore(state => state.loading);

  const handleAccept = useCallback(
    async (requestId: string) => {
      try {
        await acceptRequest(requestId);
        toast.success('Friend request accepted!');
      } catch (e) {
        toast.error(getApiErrorMessage(e, 'Failed to accept friend request. Please try again.'));
        console.error('Error accepting friend request:', e);
      }
    },
    [acceptRequest],
  );

  const handleDecline = useCallback(
    async (requestId: string) => {
      try {
        await declineRequest(requestId);
        toast.info('Friend request declined.');
      } catch (e) {
        toast.error(getApiErrorMessage(e, 'Failed to decline friend request. Please try again.'));
        console.error('Error declining friend request:', e);
      }
    },
    [declineRequest],
  );

  if (!receivedList || isEmpty(receivedList))
    return <p className="text-muted-foreground text-sm">You have no received friend requests.</p>;

  return (
    <div className="mt-4 space-y-3">
      {map(receivedList, request => (
        <FriendRequestItem
          key={request._id}
          requestInfo={request}
          actions={
            <RequestActions
              requestId={request._id}
              loading={loading}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          }
          type="received"
        />
      ))}
    </div>
  );
};
