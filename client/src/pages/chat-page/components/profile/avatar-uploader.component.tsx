import { useUserStore } from '@/stores/use-user-store';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';

import { useRef, useState } from 'react';

import { Spin } from '@/components/antd/spin.component';
import { Button } from '@/components/ui/button';

import { getApiErrorMessage } from '@/lib/axios';

export const AvatarUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const { updatedAvatarUrl } = useUserStore();

  const handleClick = () => fileInputRef.current?.click();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);

      await updatedAvatarUrl(formData);

      toast.success('Avatar uploaded successfully!');
    } catch (e) {
      console.error('Error uploading avatar:', e);
      toast.error(getApiErrorMessage(e, 'Failed to upload avatar. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-full bg-black/25">
          <Spin />
        </div>
      )}

      <Button
        size="icon"
        variant="secondary"
        onClick={handleClick}
        className="hover:bg-background absolute -right-2 -bottom-2 size-9 rounded-full shadow-md transition duration-300 hover:scale-115"
        disabled={loading}
      >
        <Camera className="size-4" />
      </Button>

      <input type="file" hidden ref={fileInputRef} onChange={handleUpload} />
    </>
  );
};
