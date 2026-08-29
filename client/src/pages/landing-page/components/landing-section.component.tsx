import { motion } from 'framer-motion';
import { memo } from 'react';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function Section({ className, children, ...props }: ComponentPropsWithoutRef<'section'>) {
  return (
    <section className={cn('w-full scroll-mt-24 py-16 sm:py-20 lg:py-24', className)} {...props}>
      {children}
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'center' | 'start';
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, align = 'center', className }: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'mx-auto text-center' : 'mx-0';

  return (
    <div className={cn('mb-12 max-w-2xl space-y-4', alignClass, className)}>
      {eyebrow && (
        <p className="text-xs font-semibold tracking-[0.3em] text-violet-600 uppercase dark:text-violet-300">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">{title}</h2>
      {description && (
        <p className="w-full text-base leading-8 text-balance text-slate-700 dark:text-slate-300">{description}</p>
      )}
    </div>
  );
}

export const Reveal = memo(function Reveal({
  className,
  delay = 0,
  children,
  animateOnMount = false,
}: {
  className?: string;
  delay?: number;
  children: ReactNode;
  animateOnMount?: boolean;
}) {
  if (animateOnMount) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: delay / 1000 }}
        className={cn(className)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: delay / 1000 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
});
