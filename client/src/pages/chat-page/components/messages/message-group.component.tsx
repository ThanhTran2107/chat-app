import { useChatStore } from '@/stores/use-chat.store';
import type { Conversation, Message, Participant } from '@/types/chat.type';
import { LoadingOutlined } from '@ant-design/icons';
import find from 'lodash-es/find';
import map from 'lodash-es/map';
import some from 'lodash-es/some';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import * as React from 'react';

import { Card } from '@/components/antd/card.component';
import { Image } from '@/components/antd/image.component';
import { Skeleton } from '@/components/antd/skeleton.component';
import { Spin } from '@/components/antd/spin.component';
import { Badge } from '@/components/ui/badge.component.';
import { Button } from '@/components/ui/button.component';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.component';

import { API_ENDPOINTS, APP_NAME, CONVERSATION_TYPES } from '@/utils/constants';

import { api, getApiErrorMessage } from '@/lib/axios';
import { cn, formatFileSize, formatMessageTime } from '@/lib/utils';

import { UserAvatar } from '../friends/user-avatar.component';
import type { MessageGroupData } from './utils/message-grouping.util';

interface MessageGroupComponentProps {
  group: MessageGroupData;
  selectedConvo: Conversation;
  lastMessageStatus: 'delivered' | 'seen';
  lastOwnMessageId?: string;
  isShowTime: boolean;
  isGroupBreak: boolean;
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
    <img src={`/file-icons/${iconName}.svg`} alt={`${iconName} file`} className="size-12 rounded-lg object-cover" />
  );
};

const ImageCell = ({
  src,
  alt,
  rootClassName,
  preview,
  isSending,
  isFailed,
  wrapperClassName,
}: {
  src?: string;
  alt: string;
  rootClassName?: string;
  preview: { src: string } | false;
  isSending: boolean;
  isFailed?: boolean;
  wrapperClassName?: string;
}) => {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <div className={cn('relative', wrapperClassName)}>
      <Image
        src={src ?? undefined}
        alt={alt}
        rootClassName={rootClassName}
        preview={preview}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && !isSending && !isFailed && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900/60">
          <Skeleton.Image active />
        </div>
      )}
      {isSending && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-black/40">
          <Spin indicator={<LoadingOutlined spin style={{ fontSize: 24 }} />} />
        </div>
      )}
      {isFailed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70">
          <AlertTriangle className="size-6 text-red-400" />
        </div>
      )}
    </div>
  );
};

export const MessageGroupComponent = ({
  group,
  selectedConvo,
  lastMessageStatus,
  lastOwnMessageId,
  isShowTime,
  isGroupBreak,
}: MessageGroupComponentProps) => {
  const messages = group.messages;
  const primary = group.primary;

  const participant = find(
    selectedConvo.participants,
    (participant: Participant) => participant._id?.toString() === primary.senderId.toString(),
  );

  const images = messages.filter(m => m.imgUrl);
  const files = messages.filter(m => m.fileUrl || (m.fileName && !m.imgUrl));
  const text = messages.find(m => m.content)?.content ?? null;

  const isOwn = !!primary.isOwn;

  const [downloadingIds, setDownloadingIds] = React.useState<Record<string, boolean>>({});
  const retryMessage = useChatStore(state => state.retryMessage);

  const groupStatus: 'sending' | 'failed' | undefined = messages.find(m => m.status === 'failed')
    ? 'failed'
    : messages.find(m => m.status === 'sending')
      ? 'sending'
      : undefined;

  const isLastOwnInGroup = messages.some(m => m._id === lastOwnMessageId);
  const showStatus = isOwn && (groupStatus === 'sending' || groupStatus === 'failed' || isLastOwnInGroup);

  const handleDownloadAttachment = async (message: Message) => {
    const key = message.clientMessageId ?? message._id;

    if (downloadingIds[key]) return;

    setDownloadingIds(prev => ({ ...prev, [key]: true }));

    try {
      const fileName = message.fileName ?? 'attachment';
      const response = await api.get(API_ENDPOINTS.MESSAGE_DOWNLOAD.replace('{messageId}', message._id), {
        responseType: 'blob',
      });

      const contentTypeHeader = response.headers['content-type'];
      const fileType = typeof contentTypeHeader === 'string' ? contentTypeHeader : 'application/octet-stream';
      const blob = new Blob([response.data], { type: fileType });
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
      setDownloadingIds(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleRetry = async () => {
    const failed = messages.find(m => m.status === 'failed');

    if (!failed?.clientMessageId) return;

    const contentToRetry = text ?? failed.content ?? '';

    const type =
      selectedConvo.type === CONVERSATION_TYPES.DIRECT ? CONVERSATION_TYPES.DIRECT : CONVERSATION_TYPES.GROUP;

    try {
      if (type === CONVERSATION_TYPES.DIRECT) {
        const otherParticipant = selectedConvo.participants.find(p => p._id && p._id !== primary.senderId);
        const recipientId = otherParticipant?._id ?? '';

        await retryMessage(
          primary.conversationId,
          failed.clientMessageId,
          recipientId,
          contentToRetry,
          failed.file,
          type,
        );
      } else {
        await retryMessage(primary.conversationId, failed.clientMessageId, '', contentToRetry, failed.file, type);
      }
    } catch (e) {
      console.error('Retry message error:', e);
      toast.error('Failed to retry message.');
    }
  };

  const showRetry = groupStatus === 'failed' && isOwn && !!messages.find(m => m.status === 'failed')?.clientMessageId;

  const messageStatusRow = showStatus && (
    <div className="mt-1.5 flex items-center gap-1">
      {groupStatus === 'sending' && isOwn ? (
        <Badge variant="outline" className={cn('text-muted-foreground h-4 border-0 px-1.5 py-0.5 text-xs', 'bg-muted')}>
          Sending
        </Badge>
      ) : groupStatus === 'failed' && isOwn ? (
        <Badge variant="outline" className="h-4 border-0 px-1.5 py-0.5 text-xs text-red-500">
          Failed
        </Badge>
      ) : (
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
  );

  const hasImages = images.length > 0;
  const hasFiles = files.length > 0;
  const isTextOnly = !hasImages && !hasFiles && !!text;

  const imageGrid = (() => {
    if (images.length === 1) {
      const img = images[0];
      const isSending = img.status === 'sending';
      const isFailed = img.status === 'failed';

      return (
        <div className="w-full overflow-hidden">
          <ImageCell
            src={img.imgUrl ?? undefined}
            alt={text ?? 'Image message'}
            rootClassName="tetra-image-message"
            preview={img.imgUrl && !isSending && !isFailed ? { src: img.imgUrl } : false}
            isSending={isSending}
            isFailed={isFailed}
          />
        </div>
      );
    }

    const cols = images.length >= 3 ? 3 : images.length;

    return (
      <div className={cn('grid gap-0.5', cols === 2 ? 'grid-cols-2' : 'grid-cols-3')}>
        {map(images, img => {
          const isSending = img.status === 'sending';
          const isFailed = img.status === 'failed';

          return (
            <ImageCell
              key={img._id}
              src={img.imgUrl ?? undefined}
              alt={text ?? 'Image message'}
              rootClassName="tetra-image-grid"
              preview={img.imgUrl && !isSending && !isFailed ? { src: img.imgUrl } : false}
              isSending={isSending}
              isFailed={isFailed}
              wrapperClassName="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900/60"
            />
          );
        })}
      </div>
    );
  })();

  const fileList = hasFiles && (
    <div className="flex flex-col">
      {map(files, file => {
        const key = file.clientMessageId ?? file._id;
        const isDownloading = !!downloadingIds[key];
        const isSending = file.status === 'sending';
        const isFailed = file.status === 'failed';

        return (
          <button
            key={file._id}
            type="button"
            onClick={() => handleDownloadAttachment(file)}
            disabled={isDownloading || isSending || isFailed}
            className="border-border/50 relative flex w-full items-center gap-3 border-t bg-white p-3 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-slate-950/80 dark:hover:bg-slate-900/90"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-50 shadow-sm dark:bg-slate-900/70">
              {renderFileIcon(file.fileType, file.fileName)}
            </div>

            <div className="min-w-0 flex-1 cursor-pointer">
              {isDownloading ? (
                <div className="flex items-center gap-2 text-sm font-medium text-slate-950 dark:text-white">
                  <Spin indicator={<LoadingOutlined spin style={{ fontSize: 24 }} />} className="size-4" />
                  <span>Downloading...</span>
                </div>
              ) : (
                <>
                  <p className="truncate text-sm font-medium text-slate-950 dark:text-white">
                    {file.fileName ?? 'Attachment'}
                  </p>

                  <p className="text-muted-foreground text-xs dark:text-slate-400">
                    {file.fileType ?? 'File'} • {file.fileSize ? formatFileSize(file.fileSize) : 'Size unknown'}
                  </p>
                </>
              )}
            </div>

            {isSending && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-black/40">
                <Spin indicator={<LoadingOutlined spin style={{ fontSize: 24 }} />} />
              </div>
            )}

            {isFailed && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70">
                <AlertTriangle className="size-6 text-red-400" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  const textBlock = text && (
    <div className={cn('border-0 p-3', isOwn ? 'chat-bubble-sent' : 'chat-bubble-received')}>
      <p className="text-sm leading-relaxed wrap-break-word">{text}</p>
    </div>
  );

  let bubble: React.ReactNode;

  if (isTextOnly) {
    bubble = (
      <Card className={cn('border-none! p-3', isOwn ? 'chat-bubble-sent border-0' : 'chat-bubble-received')}>
        <p className="text-sm leading-relaxed wrap-break-word">{text}</p>
      </Card>
    );
  } else if (hasImages && !hasFiles && !text) {
    bubble = (
      <div className="w-fit max-w-[20rem] overflow-hidden rounded-2xl bg-white dark:border-white/10 dark:bg-slate-950/90">
        {imageGrid}
      </div>
    );
  } else {
    bubble = (
      <div className="border-border/50 w-full max-w-[20rem] overflow-hidden rounded-2xl border bg-white dark:border-white/10 dark:bg-slate-950/90">
        {hasImages && imageGrid}
        {fileList}
        {textBlock}
      </div>
    );
  }

  return (
    <>
      {isShowTime && (
        <span className="text-muted-foreground flex justify-center px-1 text-xs">
          {formatMessageTime(new Date(primary.createdAt))}
        </span>
      )}

      <div
        className={cn(
          'flex items-start gap-2',
          some(messages, m => m.isNew) && 'message-bounce',
          isOwn ? 'justify-end' : 'justify-start',
        )}
      >
        {!isOwn && (
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

        {showRetry ? (
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground mb-2.5 h-4 w-4 cursor-pointer"
                    onClick={handleRetry}
                    aria-label="Retry"
                  >
                    <RefreshCw className="size-4.5" />
                  </Button>
                }
              />
              <TooltipContent>Retry</TooltipContent>
            </Tooltip>
            <div className={cn('max-w-x flex flex-col space-y-0 lg:max-w-md', 'items-end')}>
              {bubble}
              {messageStatusRow}
            </div>
          </div>
        ) : (
          <div className={cn('max-w-x flex flex-col space-y-0 lg:max-w-md', isOwn ? 'items-end' : 'items-start')}>
            {bubble}
            {messageStatusRow}
          </div>
        )}
      </div>
    </>
  );
};

export const MessageGroup = React.memo(MessageGroupComponent);
MessageGroup.displayName = 'MessageGroup';
