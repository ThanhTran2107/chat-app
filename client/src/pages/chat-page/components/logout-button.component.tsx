import { LoadingOutlined } from '@ant-design/icons';
import { LogOut } from 'lucide-react';

import { Spin } from '@/components/antd/spin.component';
import { Button } from '@/components/ui/button.component';

interface LogoutButtonProps {
  loading?: boolean;
  onClick?: () => void;
  onPointerDown?: () => void;
}

export const LogoutButton = ({ loading = false, onClick, onPointerDown }: LogoutButtonProps) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <Button
      className="flex w-full cursor-pointer justify-start"
      variant="completeGhost"
      onClick={handleClick}
      onPointerDown={onPointerDown}
      disabled={loading}
    >
      {loading ? (
        <Spin indicator={<LoadingOutlined spin className="text-destructive!" />} />
      ) : (
        <LogOut className="text-destructive -ml-2" />
      )}
      {loading ? 'Logging out...' : 'Log out'}
    </Button>
  );
};
