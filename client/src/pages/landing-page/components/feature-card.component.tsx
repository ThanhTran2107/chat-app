import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface FeatureCardProps extends ComponentPropsWithoutRef<'div'> {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description, className, ...props }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'group flex h-full flex-col rounded-[28px] border border-slate-200/70 bg-white/90 p-7 text-slate-950 shadow-[0_20px_120px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/30 hover:shadow-[0_20px_60px_rgba(129,95,255,0.18)] dark:border-white/10 dark:bg-slate-950/80 dark:text-white dark:hover:bg-slate-900/90',
        className,
      )}
      {...props}
    >
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-500/10 text-violet-600 transition group-hover:bg-violet-500/15 group-hover:text-violet-400">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-semibold">{title}</h3>
      <p className="mt-auto text-sm leading-7 text-slate-700 dark:text-slate-300">{description}</p>
    </div>
  );
}
