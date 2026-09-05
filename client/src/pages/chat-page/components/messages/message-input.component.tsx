import { useAuthStore } from '@/stores/use-auth.store';
import { useChatStore } from '@/stores/use-chat.store';
import type { Conversation, Message, SelectedAttachment } from '@/types/chat.type';
import filter from 'lodash-es/filter';
import find from 'lodash-es/find';
import includes from 'lodash-es/includes';
import isEmpty from 'lodash-es/isEmpty';
import map from 'lodash-es/map';
import some from 'lodash-es/some';
import { ImagePlus, Send, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button.component';
import { Input } from '@/components/ui/input.component';

import { CONVERSATION_TYPES, MAX_ATTACHMENTS_PER_SEND } from '@/utils/constants';
import { type UploadJob, createUploadQueue } from '@/utils/upload-queue';

import { formatFileSize } from '@/lib/utils';

const EmojiPicker = React.lazy(() => import('./emoji-picker.component').then(m => ({ default: m.EmojiPicker })));

const emojiPickerFallback = (
  <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-smooth cursor-pointer" disabled>
    <span className="size-4" />
  </Button>
);

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
  const [value, setValue] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<SelectedAttachment[]>([]);
  const [hoveredAttachmentId, setHoveredAttachmentId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const optimisticBlobUrls = useRef(new Set<string>());
  const clientSequenceRef = useRef(0);

  const user = useAuthStore(state => state.user);
  const addMessage = useChatStore(state => state.addMessage);
  const sendDirectMessage = useChatStore(state => state.sendDirectMessage);
  const sendGroupMessage = useChatStore(state => state.sendGroupMessage);
  const setMessageUploading = useChatStore(state => state.setMessageUploading);

  const otherUser =
    selectedConvo.type === CONVERSATION_TYPES.DIRECT
      ? filter(selectedConvo.participants, participant => participant._id !== user?._id)[0]
      : undefined;

  const isConversationUnavailable = selectedConvo.type === CONVERSATION_TYPES.DIRECT && !otherUser?._id;

  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      if (isConversationUnavailable) return;

      setValue(prev => `${prev}${emoji}`);
    },
    [isConversationUnavailable],
  );

  useEffect(() => {
    const urls = optimisticBlobUrls.current;

    return () => {
      for (const blobUrl of urls) {
        const messages = useChatStore.getState().messages;
        let urlInUse = false;

        for (const convoId in messages) {
          const items = messages[convoId]?.items ?? [];

          if (items.some(m => m.imgUrl === blobUrl)) {
            urlInUse = true;

            break;
          }
        }

        if (!urlInUse) URL.revokeObjectURL(blobUrl);
      }

      urls.clear();
    };
  }, []);

  if (!user) return null;

  const acceptMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    'application/vnd.openxmlformats-officedocument.presentationml.template',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed',
    'text/csv',
    'application/rtf',
    'text/markdown',
    'video/mp4',
    'audio/mpeg',
    'audio/mp3',
  ];

  const acceptedExtensions = new Set([
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.rtf',
    '.csv',
    '.txt',
    '.md',
    '.mp4',
    '.mp3',
    '.zip',
    '.rar',
  ]);

  const isAcceptedFileType = (file: File) => {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    const extension = fileName.slice(fileName.lastIndexOf('.'));

    if (fileType && includes(acceptMimeTypes, fileType)) return true;
    if (extension && acceptedExtensions.has(extension)) return true;

    return false;
  };

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (isEmpty(files)) return;

    if (selectedFiles.length + files.length > MAX_ATTACHMENTS_PER_SEND) {
      toast.error(`You can only send up to ${MAX_ATTACHMENTS_PER_SEND} files at a time.`);
      event.target.value = '';

      return;
    }

    const newAttachments: SelectedAttachment[] = [];

    for (const file of files) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error('File must be 20MB or smaller.');
        event.target.value = '';

        return;
      }

      if (!isAcceptedFileType(file)) {
        toast.error('File type is not supported.');
        event.target.value = '';

        return;
      }

      const existing = find(
        selectedFiles,
        item => item.file.name === file.name && item.file.size === file.size && item.file.type === file.type,
      );

      if (existing) continue;

      const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
      newAttachments.push({ id: generateId(), file, previewUrl });
    }

    if (!isEmpty(newAttachments)) setSelectedFiles(prev => [...prev, ...newAttachments]);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearSelectionForSend = () => {
    setSelectedFiles([]);
    setValue('');

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const generateClientMessageId = () => `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const updateOptimisticMessage = (conversationId: string, clientMessageId: string, message: Message) => {
    const revokeBlobUrl = (url?: string | null) => {
      if (typeof url === 'string' && url.startsWith('blob:')) URL.revokeObjectURL(url);
    };

    useChatStore.setState(state => {
      const items = state.messages[conversationId]?.items ?? [];
      const exists = some(items, msg => msg._id === message._id);

      if (exists) return state;

      const updatedItems = map(items, msg => {
        if (msg.clientMessageId !== clientMessageId) return msg;

        revokeBlobUrl(msg.imgUrl);

        return {
          ...message,
          isOwn: true,
          isNew: true,
          clientMessageId: msg.clientMessageId,
          status: undefined,
        };
      });

      return {
        messages: {
          ...state.messages,
          [conversationId]: {
            items: updatedItems,
            hasMore: state.messages[conversationId]?.hasMore ?? true,
            nextCursor: state.messages[conversationId]?.nextCursor,
          },
        },
      };
    });
  };

  const markOptimisticFailed = (conversationId: string, clientMessageId: string) => {
    useChatStore.setState(state => ({
      messages: {
        ...state.messages,
        [conversationId]: {
          ...state.messages[conversationId],
          items: map(state.messages[conversationId]?.items ?? [], m =>
            m.clientMessageId === clientMessageId ? { ...m, status: 'failed' as const } : m,
          ),
        },
      },
    }));
  };

  const handleSendMessage = async () => {
    if (!value.trim() && isEmpty(selectedFiles)) return;
    if (isConversationUnavailable) return;

    const text = value.trim();
    const attachments = [...selectedFiles];

    clearSelectionForSend();

    const queue = createUploadQueue<unknown>({
      maxConcurrent: 2,
      maxAttempts: 3,
      baseDelay: 500,
    });

    if (isEmpty(attachments) && text) {
      const clientMessageId = generateClientMessageId();
      const clientSequence = clientSequenceRef.current++;
      const tempMessage: Message = {
        _id: clientMessageId,
        conversationId: selectedConvo._id,
        senderId: user._id,
        content: text,
        createdAt: new Date().toISOString(),
        isOwn: true,
        status: 'sending',
        clientMessageId,
        clientSequence,
      };

      addMessage(tempMessage);

      const sendJob: UploadJob<unknown> = {
        key: clientMessageId,
        run: () => {
          if (selectedConvo.type === CONVERSATION_TYPES.DIRECT) {
            return sendDirectMessage(
              otherUser?._id ?? '',
              text,
              undefined,
              clientMessageId,
              tempMessage.createdAt,
              clientSequence,
              undefined,
            );
          }

          return sendGroupMessage(
            selectedConvo._id,
            text,
            undefined,
            clientMessageId,
            tempMessage.createdAt,
            clientSequence,
            undefined,
          );
        },
        onSuccess: message => {
          updateOptimisticMessage(selectedConvo._id, clientMessageId, message as Message);
        },
        onError: () => {
          markOptimisticFailed(selectedConvo._id, clientMessageId);
        },
        onStart: () => {
          setMessageUploading(selectedConvo._id, clientMessageId, true);
        },
      };

      await queue.drain([sendJob]);
    } else if (!isEmpty(attachments)) {
      const clientGroupId = generateClientMessageId();
      const jobs: UploadJob<unknown>[] = [];

      for (const attachment of attachments) {
        const clientMessageId = generateClientMessageId();
        const clientSequence = clientSequenceRef.current++;
        const tempMessage: Message = {
          _id: clientMessageId,
          conversationId: selectedConvo._id,
          senderId: user._id,
          content: text && attachments.indexOf(attachment) === 0 ? text : null,
          createdAt: new Date().toISOString(),
          isOwn: true,
          status: 'sending',
          clientMessageId,
          clientSequence,
          clientGroupId,
          ...(attachment.file.type.startsWith('image/') ? { imgUrl: attachment.previewUrl ?? undefined } : {}),
          ...(!attachment.file.type.startsWith('image/')
            ? {
                fileName: attachment.file.name,
                fileType: attachment.file.type,
                fileSize: attachment.file.size,
              }
            : {}),
          file: attachment.file,
        };

        addMessage(tempMessage);

        if (tempMessage.imgUrl && tempMessage.imgUrl.startsWith('blob:'))
          optimisticBlobUrls.current.add(tempMessage.imgUrl);

        const contentToSend = tempMessage.content ?? '';
        const fileToSend = attachment.file;

        jobs.push({
          key: clientMessageId,
          run: () => {
            if (selectedConvo.type === CONVERSATION_TYPES.DIRECT) {
              return sendDirectMessage(
                otherUser?._id ?? '',
                contentToSend,
                fileToSend,
                clientMessageId,
                tempMessage.createdAt,
                clientSequence,
                clientGroupId,
              );
            }

            return sendGroupMessage(
              selectedConvo._id,
              contentToSend,
              fileToSend,
              clientMessageId,
              tempMessage.createdAt,
              clientSequence,
              clientGroupId,
            );
          },
          onSuccess: message => {
            updateOptimisticMessage(selectedConvo._id, clientMessageId, message as Message);
          },
          onError: () => {
            markOptimisticFailed(selectedConvo._id, clientMessageId);
          },
          onRetry: (attempt, error) => {
            console.warn(`Retry ${clientMessageId} attempt ${attempt}:`, error);
          },
          onStart: () => {
            setMessageUploading(selectedConvo._id, clientMessageId, true);
          },
        });
      }

      await queue.drain(jobs);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removeSelectedAttachment = (id: string) => {
    setSelectedFiles(prev => {
      const target = find(prev, item => item.id === id);

      if (target?.previewUrl && target.previewUrl.startsWith('blob:')) URL.revokeObjectURL(target.previewUrl);

      return filter(prev, item => item.id !== id);
    });
  };

  const getAttachmentSummary = (attachments: SelectedAttachment[]) => {
    const total = attachments.length;

    if (total === 0) return '';

    const totalSize = attachments.reduce((sum, item) => sum + (item.file.size || 0), 0);

    const imageCount = filter(attachments, item => item.file.type.startsWith('image/')).length;
    const nonImageCount = total - imageCount;

    if (imageCount === total)
      return `${total === 1 ? '1 image' : `${total} images`} • ${formatFileSize(totalSize)} total`;

    if (nonImageCount === 0)
      return `${total === 1 ? '1 image' : `${total} images`} • ${formatFileSize(totalSize)} total`;

    if (nonImageCount === total)
      return `${total === 1 ? '1 file' : `${total} files`} • ${formatFileSize(totalSize)} total`;

    const categoryCounts = new Map<string, { count: number; size: number }>();

    for (const item of attachments) {
      const category = item.file.type.startsWith('image/')
        ? 'image'
        : item.file.type.includes('pdf')
          ? 'pdf'
          : item.file.type.includes('word') || item.file.type.includes('document')
            ? 'doc'
            : item.file.type.includes('sheet') || item.file.type.includes('excel')
              ? 'sheet'
              : item.file.type.includes('presentation') || item.file.type.includes('powerpoint')
                ? 'slide'
                : item.file.type.includes('zip') || item.file.type.includes('rar')
                  ? 'archive'
                  : item.file.type.includes('video')
                    ? 'video'
                    : item.file.type.includes('audio')
                      ? 'audio'
                      : 'file';

      const current = categoryCounts.get(category) || { count: 0, size: 0 };

      categoryCounts.set(category, {
        count: current.count + 1,
        size: current.size + (item.file.size || 0),
      });
    }

    const entries = Array.from(categoryCounts.entries());
    const parts = entries.map(([category, data]) => {
      const label = category === 'image' ? (data.count === 1 ? 'image' : 'images') : category;

      return `${data.count} ${label}`;
    });

    const summary = parts.join(' • ');

    return `${summary} • ${formatFileSize(totalSize)}`;
  };

  const getFileIcon = (file: File) => {
    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();
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

  const selectedAttachmentPreview = map(selectedFiles, item => {
    const isHovered = hoveredAttachmentId === item.id;

    if (item.file.type.startsWith('image/')) {
      return (
        <div
          key={item.id}
          className="relative h-16 w-16"
          onMouseEnter={() => setHoveredAttachmentId(item.id)}
          onMouseLeave={() => setHoveredAttachmentId(null)}
        >
          <img src={item.previewUrl ?? undefined} alt={item.file.name} className="h-16 w-16 rounded-md object-cover" />
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/30">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 cursor-pointer rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={() => removeSelectedAttachment(item.id)}
                aria-label={`Remove ${item.file.name}`}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={item.id}
        className="relative flex h-12 w-12 items-center justify-center rounded-md border bg-slate-50 dark:border-white/10 dark:bg-slate-900/70"
        onMouseEnter={() => setHoveredAttachmentId(item.id)}
        onMouseLeave={() => setHoveredAttachmentId(null)}
      >
        {getFileIcon(item.file)}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/30">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 cursor-pointer rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={() => removeSelectedAttachment(item.id)}
              aria-label={`Remove ${item.file.name}`}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        )}
      </div>
    );
  });

  const attachmentSummary = getAttachmentSummary(selectedFiles);

  return (
    <div className="space-y-2 px-3 pt-2 pb-3">
      {!isEmpty(selectedFiles) && (
        <div className="border-border/50 overflow-hidden rounded-2xl border bg-white dark:border-white/10 dark:bg-slate-950/90">
          <div className="border-border/5 flex w-full items-center gap-3 border-b bg-white p-3 dark:border-white/10 dark:bg-slate-950/80">
            <div className="flex flex-wrap gap-2">{selectedAttachmentPreview}</div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {selectedFiles.length === 1 ? selectedFiles[0].file.name : `${selectedFiles.length} files selected`}
              </p>
              {attachmentSummary && (
                <p className="text-muted-foreground text-xs dark:text-slate-400">{attachmentSummary}</p>
              )}
            </div>

            <Button variant="ghost" size="icon" className="hover:bg-primary/10" onClick={clearSelectionForSend}>
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="bg-backgrounds flex min-h-14 items-center gap-2 rounded-2xl">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptMimeTypes.join(',')}
          className="hidden"
          onChange={handleSelectFile}
        />

        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 transition-smooth cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus className="size-4" />
        </Button>

        <div className="relative flex-1">
          <Input
            ref={inputRef}
            onKeyDown={handleKeyPress}
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={isConversationUnavailable ? 'Conversation unavailable' : 'Type a message...'}
            className="border-border/50 focus:border-primary/50 transition-smooth h-9 resize-none bg-white pr-20 dark:bg-slate-900/80 dark:text-white"
            disabled={isConversationUnavailable}
          />
          <div className="absolute top-1/2 right-2 flex -translate-y-1/2 transform items-center gap-1">
            <Suspense fallback={emojiPickerFallback}>
              <EmojiPicker onChange={handleEmojiSelect} />
            </Suspense>
          </div>
        </div>

        <Button
          className="bg-gradient-chat hover:shadow-glow transition-smooth cursor-pointer hover:scale-105"
          disabled={isConversationUnavailable || (!value.trim() && isEmpty(selectedFiles))}
          onClick={handleSendMessage}
        >
          <Send className="size-4 text-white" />
        </Button>
      </div>
    </div>
  );
};
