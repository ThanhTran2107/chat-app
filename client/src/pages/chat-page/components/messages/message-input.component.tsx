import { useAuthStore } from '@/stores/use-auth-store';
import { useChatStore } from '@/stores/use-chat-store';
import type { Conversation } from '@/types/chat.type';
import filter from 'lodash-es/filter';
import includes from 'lodash-es/includes';
import { ImagePlus, Send, X } from 'lucide-react';
import { toast } from 'sonner';

import React, { Suspense, useEffect, useRef, useState } from 'react';

import { Spin } from '@/components/antd/spin.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { formatFileSize } from '@/lib/utils';

const EmojiPicker = React.lazy(() => import('./emoji-picker.component').then(m => ({ default: m.EmojiPicker })));

const emojiPickerFallback = (
  <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-smooth cursor-pointer" disabled>
    <span className="size-4" />
  </Button>
);

export const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
  const [value, setValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const user = useAuthStore(state => state.user);
  const sendDirectMessage = useChatStore(state => state.sendDirectMessage);
  const sendGroupMessage = useChatStore(state => state.sendGroupMessage);

  useEffect(() => {
    return () => {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    };
  }, [filePreviewUrl]);

  useEffect(() => {
    if (!isUploading) inputRef.current?.focus();
  }, [isUploading]);

  if (!user) return null;

  const otherUser =
    selectedConvo.type === 'direct'
      ? filter(selectedConvo.participants, participant => participant._id !== user._id)[0]
      : undefined;

  const isConversationUnavailable = selectedConvo.type === 'direct' && !otherUser?._id;

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
    const file = event.target.files?.[0] ?? null;

    if (!file) return;

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

    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }

    setSelectedFile(file);
    if (file.type.startsWith('image/')) setFilePreviewUrl(URL.createObjectURL(file));
  };

  const handleClearSelectedFile = () => {
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);

    setFilePreviewUrl(null);
    setSelectedFile(null);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async () => {
    if (!value.trim() && !selectedFile) return;
    if (isConversationUnavailable) return;

    setIsUploading(true);

    try {
      if (selectedConvo.type === 'direct') {
        await sendDirectMessage(otherUser?._id ?? '', value, selectedFile ?? undefined);
      } else {
        await sendGroupMessage(selectedConvo._id, value, selectedFile ?? undefined);
      }

      handleClearSelectedFile();
      setValue('');
    } catch (e) {
      console.error('Send message error:', e);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderFileInputIcon = () => {
    if (!selectedFile) return null;

    const type = selectedFile.type.toLowerCase();
    const name = selectedFile.name.toLowerCase();
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

  const fileIcon = selectedFile?.type.startsWith('image/') ? (
    <img src={filePreviewUrl ?? undefined} alt={selectedFile?.name} className="h-16 w-16 rounded-md object-cover" />
  ) : (
    <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-slate-50 dark:border-white/10 dark:bg-slate-900/70">
      {renderFileInputIcon()}
    </div>
  );

  return (
    <div className="space-y-2 px-3 pt-2 pb-3">
      {selectedFile && (
        <div className="border-border/50 overflow-hidden rounded-2xl border bg-white dark:border-white/10 dark:bg-slate-950/90">
          <div className="border-border/5 flex w-full items-center gap-3 border-b bg-white p-3 dark:border-white/10 dark:bg-slate-950/80">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-50 shadow-sm dark:bg-slate-900/80">
              {fileIcon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{selectedFile.name}</p>
              <p className="text-muted-foreground text-xs dark:text-slate-400">
                {selectedFile.type || 'File'} • {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10"
              onClick={handleClearSelectedFile}
              disabled={isUploading}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="bg-backgrounds flex min-h-14 items-center gap-2 rounded-2xl">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptMimeTypes.join(',')}
          className="hidden"
          onChange={handleSelectFile}
        />
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 transition-smooth cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
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
            disabled={isConversationUnavailable || isUploading}
          />
          <div
            className={
              'absolute top-1/2 right-2 flex -translate-y-1/2 transform items-center gap-1 ' +
              (isConversationUnavailable || isUploading ? 'pointer-events-none opacity-50' : '')
            }
          >
            <Suspense fallback={emojiPickerFallback}>
              <EmojiPicker
                onChange={(emoji: string) => {
                  if (isConversationUnavailable || isUploading) return;
                  setValue(`${value}${emoji}`);
                }}
              />
            </Suspense>
          </div>
        </div>

        <Button
          className="bg-gradient-chat hover:shadow-glow transition-smooth cursor-pointer hover:scale-105"
          disabled={isConversationUnavailable || (!value.trim() && !selectedFile) || isUploading}
          onClick={handleSendMessage}
        >
          {isUploading ? <Spin className="size-4 text-white" /> : <Send className="size-4 text-white" />}
        </Button>
      </div>
    </div>
  );
};
