import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

interface ButtonProps {
  to?: string;
  href?: string;
  icon?: ReactNode;
  rounded?: 'full' | 'lg';
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export function PrimaryButton({ to, href, icon, rounded = 'full', className, children, onClick }: ButtonProps) {
  const base = cn(
    'inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    rounded === 'lg' && 'rounded-lg',
    className,
  );

  if (href) {
    return (
      <a href={href} className={base} onClick={onClick}>
        {icon}
        {children}
      </a>
    );
  }

  return (
    <Link to={to ?? '/'} className={base} onClick={onClick}>
      {icon}
      {children}
    </Link>
  );
}

export function SecondaryButton({ to, href, icon, rounded = 'full', className, children, onClick }: ButtonProps) {
  const base = cn(
    'inline-flex items-center justify-center rounded-full border border-slate-200/70 bg-slate-950/5 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-300/70 hover:bg-slate-950/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-white/20 dark:hover:bg-white/10',
    rounded === 'lg' && 'rounded-lg',
    className,
  );

  if (href) {
    return (
      <a href={href} className={base} onClick={onClick}>
        {icon}
        {children}
      </a>
    );
  }

  return (
    <Link to={to ?? '/'} className={base} onClick={onClick}>
      {icon}
      {children}
    </Link>
  );
}
