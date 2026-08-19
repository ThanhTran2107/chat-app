import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { type VariantProps } from 'class-variance-authority';

import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

import { buttonVariants } from './variants/button-variants';

const Button = forwardRef<HTMLButtonElement, ButtonPrimitive.Props & VariantProps<typeof buttonVariants>>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <ButtonPrimitive
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);

Button.displayName = 'Button';

export { Button };
