import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  description?: string;
  className?: string;
  progress?: number;
  onProgressComplete?: () => void;
}

export function LoadingSpinner({
  description = 'Wait a moment for loading !',
  className,
  progress,
  onProgressComplete,
}: LoadingSpinnerProps) {
  const hasProgress = progress !== undefined;

  return (
    <div
      className={cn(
        'fixed inset-0 z-100 flex h-screen w-full items-center justify-center overflow-hidden',
        'from-background via-muted to-background bg-linear-to-br',
        'animate-gradient-shift bg-[background-size:200%_200%]',
        className,
      )}
    >
      <div className="border-border/50 bg-card/80 relative flex h-80 w-80 flex-col items-center justify-center gap-8 rounded-3xl border backdrop-blur-xl">
        <div className="bg-primary/15 animate-pulse-glow absolute -inset-6 rounded-full blur-3xl" />

        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg
            className="text-primary absolute h-28 w-28"
            viewBox="0 0 100 100"
            fill="none"
            style={{
              filter: 'drop-shadow(0 0 12px hsl(var(--primary-glow))) drop-shadow(0 0 20px hsl(var(--primary-glow)))',
              animation: 'tetra-spin 1s linear infinite',
            }}
            aria-hidden="true"
          >
            <circle
              cx="50"
              cy="50"
              r="42"
              strokeWidth="2"
              stroke="currentColor"
              strokeLinecap="round"
              strokeDasharray="100 164"
              strokeDashoffset="0"
            />
          </svg>

          <img src="/main-logo.png" alt="Tetra" className="animate-pulse-subtle absolute inset-0 m-auto h-12 w-12" />
        </div>

        <p className="animate-fade-in text-foreground text-sm font-semibold [animation-delay:200ms]">{description}</p>

        {hasProgress && (
          <div className="bg-muted/30 w-48 overflow-hidden rounded-full">
            <div
              className="from-primary to-primary-glow h-1 bg-linear-to-r transition-all duration-150"
              style={{ width: `${progress}%` }}
              // Fire once the width transition actually finishes instead of guessing a delay
              onTransitionEnd={event => {
                if (event.propertyName === 'width' && progress === 100) onProgressComplete?.();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
