import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';

import { cn } from '@/lib/utils';
import { useThemeStore } from '@/stores/use-theme-store';

function Separator({ className, orientation = 'horizontal', ...props }: SeparatorPrimitive.Props) {
  const { isDark } = useThemeStore();

  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        `shrink-0 ${isDark ? 'bg-white' : 'bg-black'} data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch`,
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
