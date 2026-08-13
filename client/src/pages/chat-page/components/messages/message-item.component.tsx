import type { Conversation, Message, Participant } from '@/types/chat.ts';
import { Card } from 'antd';
import find from 'lodash-es/find';
import { toast } from 'sonner';

import * as React from 'react';

import { Spin } from '@/components/antd/spin.component';
import { Badge } from '@/components/ui/badge';

import { APP_NAME } from '@/utils/constants';

import { api, getApiErrorMessage } from '@/lib/axios';
import { cn, formatFileSize, formatMessageTime } from '@/lib/utils';

import { UserAvatar } from '../friends/user-avatar.component';

interface MessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConvo: Conversation;
  lastMessageStatus: 'delivered' | 'seen';
}

const renderFileIcon = (fileType?: string | null, fileName?: string | null) => {
  const type = (fileType ?? '').toLowerCase();
  const name = (fileName ?? '').toLowerCase();
  let iconName = 'default';

  if (type.includes('pdf') || name.endsWith('.pdf')) iconName = 'pdf';
  else if (
    type.includes('word') ||
    type.includes('wordprocessingml.document') ||
    name.endsWith('.doc') ||
    name.endsWith('.docx')
  )
    iconName = 'doc';
  else if (
    type.includes('excel') ||
    type.includes('spreadsheetml.sheet') ||
    name.endsWith('.xls') ||
    name.endsWith('.xlsx')
  )
    iconName = 'xls';
  else if (
    type.includes('powerpoint') ||
    type.includes('presentationml.presentation') ||
    name.endsWith('.ppt') ||
    name.endsWith('.pptx')
  )
    iconName = 'ppt';
  else if (type.includes('zip') || name.endsWith('.zip') || name.endsWith('.rar')) iconName = 'zip';
  else if (type.includes('csv') || name.endsWith('.csv')) iconName = 'csv';
  else if (type.includes('rtf') || name.endsWith('.rtf')) iconName = 'rtf';
  else if (type.includes('markdown') || name.endsWith('.md') || name.endsWith('.markdown')) iconName = 'md';
  else if (type.includes('json') || name.endsWith('.json')) iconName = 'json';
  else if (type.includes('audio') || name.match(/\.(mp3|wav|ogg|m4a)$/)) iconName = 'audio';
  else if (type.includes('video') || name.match(/\.(mp4|mov|avi|mkv)$/)) iconName = 'video';
  else if (type.includes('text') || name.endsWith('.txt')) iconName = 'txt';

  return (
    <img src={`/file-icons/${iconName}.svg`} alt={`${iconName} file`} className="h-12 w-12 rounded-lg object-cover" />
  );
};

const MessageItemComponent = ({ message, index, messages, selectedConvo, lastMessageStatus }: MessageItemProps) => {
  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;

  const isShowTime =
    index === 0 || new Date(message.createdAt).getTime() - new Date(prev?.createdAt || 0).getTime() > 300000; // 5 minutes

  const isGroupBreak = isShowTime || message.senderId !== prev?.senderId;

  const participant = find(
    selectedConvo.participants,
    (participant: Participant) => participant._id?.toString() === message.senderId.toString(),
  );

  const [isDownloading, setIsDownloading] = React.useState(false);
  const FileIconElement = renderFileIcon(message.fileType, message.fileName);

  const handleDownloadAttachment = async () => {
    if (isDownloading) return;

    setIsDownloading(true);

    try {
      const fileName = message.fileName ?? 'attachment';
      const response = await api.get(`/message/download/${message._id}`, {
        responseType: 'blob',
      });

      const contentTypeHeader = response.headers['content-type'];
      const fileType = typeof contentTypeHeader === 'string' ? contentTypeHeader : 'application/octet-stream';
      const blob = new Blob([response.data], {
        type: fileType,
      });
      const fileUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      
      anchor.href = fileUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not download attachment.'));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/*time*/}
      {isShowTime && (
        <span className="text-muted-foreground flex justify-center px-1 text-xs">
          {formatMessageTime(new Date(message.createdAt))}
        </span>
      )}

      <div
        className={cn(
          'flex items-start gap-2',
          message.isNew && 'message-bounce',
          message.isOwn ? 'justify-end' : 'justify-start',
        )}
      >
        {/*avatar spacer*/}
        {!message.isOwn && (
          <div className="flex shrink-0 items-start">
            {isGroupBreak ? (
              <UserAvatar
                type="chat"
                name={participant?.displayName ?? APP_NAME}
                avatarUrl={participant?.avatarUrl ?? undefined}
              />
            ) : (
              <div className="size-8" />
            )}
          </div>
        )}

        {/*message*/}
        <div className={cn('max-w-x flex flex-col space-y-0 lg:max-w-md', message.isOwn ? 'items-end' : 'items-start')}>
          {message.imgUrl && !message.content ? (
            <div className="border-border/50 overflow-hidden rounded-xl border bg-slate-100">
              <img
                src={message.imgUrl ?? undefined}
                alt={message.content ?? 'Image message'}
                className="max-h-80 w-full cursor-pointer object-contain"
                onClick={() => window.open(message.imgUrl ?? undefined, '_blank')}
              />
            </div>
          ) : null}

          {message.imgUrl && message.content ? (
            <div className="border-border/50 overflow-hidden rounded-2xl border bg-white dark:border-white/10 dark:bg-slate-950/90">
              <img
                src={message.imgUrl ?? undefined}
                alt={message.content ?? 'Image message'}
                className="max-h-80 w-full cursor-pointer object-contain"
                onClick={() => window.open(message.imgUrl ?? undefined, '_blank')}
              />
              <div
                className={cn(
                  'rounded-b-2xl border-0 p-3',
                  message.isOwn ? 'chat-bubble-sent' : 'chat-bubble-received',
                )}
              >
                <p className="text-sm leading-relaxed wrap-break-word">{message.content}</p>
              </div>
            </div>
          ) : null}

          {message.fileUrl && message.content ? (
            <div className="border-border/50 overflow-hidden rounded-2xl border bg-white dark:border-white/10 dark:bg-slate-950/90">
              <button
                type="button"
                onClick={handleDownloadAttachment}
                disabled={isDownloading}
                className="border-border/50 flex w-full items-center gap-3 border-b bg-white p-3 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-slate-950/80 dark:hover:bg-slate-900/90"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-50 shadow-sm dark:bg-slate-900/70">
                  {FileIconElement}
                </div>

                <div className="min-w-0 flex-1">
                  {isDownloading ? (
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-950 dark:text-white">
                      <Spin className="size-4" />
                      <span>Downloading...</span>
                    </div>
                  ) : (
                    <>
                      <p className="truncate text-sm font-medium text-slate-950 dark:text-white">
                        {message.fileName ?? 'Attachment'}
                      </p>

                      <p className="text-muted-foreground text-xs dark:text-slate-400">
                        {message.fileType ?? 'File'} •{' '}
                        {message.fileSize ? formatFileSize(message.fileSize) : 'Size unknown'}
                      </p>
                    </>
                  )}
                </div>
              </button>

              <div
                className={cn(
                  'rounded-b-2xl border-0 p-3',
                  message.isOwn ? 'chat-bubble-sent' : 'chat-bubble-received',
                )}
              >
                <p className="text-sm leading-relaxed wrap-break-word">{message.content}</p>
              </div>
            </div>
          ) : null}

          {!message.content && message.fileUrl ? (
            <button
              type="button"
              onClick={handleDownloadAttachment}
              disabled={isDownloading}
              className="border-border/50 mb-2 flex w-full items-center gap-3 overflow-hidden rounded-2xl border bg-slate-50 p-3 text-left transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:bg-slate-950/90 dark:hover:bg-slate-900/90"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-900/80">
                {FileIconElement}
              </div>

              <div className="min-w-0 flex-1">
                {isDownloading ? (
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-950 dark:text-white">
                    <Spin className="size-4" />
                    <span>Downloading...</span>
                  </div>
                ) : (
                  <>
                    <p className="truncate text-sm font-medium text-slate-950 dark:text-white">
                      {message.fileName ?? 'Attachment'}
                    </p>
                    <p className="text-muted-foreground text-xs dark:text-slate-400">
                      {message.fileType ?? 'File'} •{' '}
                      {message.fileSize ? formatFileSize(message.fileSize) : 'Size unknown'}
                    </p>
                  </>
                )}
              </div>
            </button>
          ) : null}

          {message.content && !message.fileUrl && !message.imgUrl ? (
            <Card className={cn('p-3', message.isOwn ? 'chat-bubble-sent border-0' : 'chat-bubble-received')}>
              <p className="text-sm leading-relaxed wrap-break-word">{message.content}</p>
            </Card>
          ) : null}

          {/*seen delivered*/}
          {message.isOwn && message._id === selectedConvo.lastMessage?._id && (
            <Badge
              variant="outline"
              className={cn(
                'h-4 border-0 px-1.5 py-0.5 text-xs',
                lastMessageStatus === 'seen' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground',
              )}
            >
              {lastMessageStatus}
            </Badge>
          )}
        </div>
      </div>
    </>
  );
};

export const MessageItem = React.memo(MessageItemComponent);
MessageItem.displayName = 'MessageItem';
