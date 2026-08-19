import type { Message } from '@/types/chat.type';

export interface MessageGroupData {
  id: string;
  messages: Message[];
  primary: Message;
}

/**
 * Groups flat messages into logical message groups.
 *
 * Messages that were sent in the same send action share a `clientGroupId`,
 * so they are rendered together inside one chat bubble (image grid + file
 * list + text). Messages without a `clientGroupId` (legacy single-attachment
 * or text-only messages) each form their own group.
 */
export const groupMessages = (messages: Message[]): MessageGroupData[] => {
  const result: MessageGroupData[] = [];
  let currentGroup: MessageGroupData | null = null;

  for (const message of messages) {
    const groupId = message.clientGroupId ?? message.clientMessageId ?? message._id;

    if (groupId && currentGroup && currentGroup.id === groupId) {
      currentGroup.messages.push(message);

      continue;
    }

    if (groupId) {
      currentGroup = { id: groupId, messages: [message], primary: message };
      result.push(currentGroup);

      continue;
    }

    currentGroup = null;
    result.push({ id: message._id, messages: [message], primary: message });
  }

  return result;
};
