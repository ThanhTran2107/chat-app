import map from 'lodash-es/map';
import { Sparkles } from 'lucide-react';

import { useEffect, useState } from 'react';

import { APP_NAME } from '@/utils/constants';

const slides = [
  {
    id: 'security',
    badge: 'Absolute Security',
    title: 'Absolute Security',
    description: `${APP_NAME} uses state-of-the-art end-to-end encryption to protect all your conversations.`,
    variant: 'security' as const,
  },
  {
    id: 'sync',
    badge: 'Instant Sync',
    title: 'Instant Sync',
    description: 'Your messages, files, and updates stay in sync everywhere without losing momentum.',
    variant: 'sync' as const,
  },
  {
    id: 'privacy',
    badge: 'Private by Design',
    title: 'Private by Design',
    description: 'Built for calm, focused conversations with privacy controls that feel effortless.',
    variant: 'privacy' as const,
  },
];

export const AuthIllustration = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(() => (typeof document !== 'undefined' ? !document.hidden : true));
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    const handleVisibilityChange = () => setIsVisible(!document.hidden);

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex(currentIndex => (currentIndex + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [isVisible]);

  const renderIllustration = (variant: (typeof slides)[number]['variant']) => {
    switch (variant) {
      case 'sync':
        return (
          <svg viewBox="0 0 420 360" className="w-full" role="img" aria-label="Sync illustration">
            <rect x="24" y="24" width="372" height="312" rx="30" fill="#101b2c" />
            <circle cx="320" cy="92" r="54" fill="#d68cff" opacity="0.16" />
            <rect x="88" y="94" width="148" height="164" rx="28" fill="#18263b" />
            <rect x="112" y="118" width="100" height="102" rx="20" fill="#f5f7ff" />
            <path d="M132 152c14-14 36-14 50 0" stroke="#7c3aed" strokeWidth="10" strokeLinecap="round" />
            <path d="M132 174h50" stroke="#94a3b8" strokeWidth="10" strokeLinecap="round" />
            <rect x="242" y="122" width="86" height="126" rx="24" fill="#18263b" />
            <path d="M258 158h54" stroke="#f5f7ff" strokeWidth="10" strokeLinecap="round" />
            <path d="M258 182h34" stroke="#94a3b8" strokeWidth="10" strokeLinecap="round" />
            <path
              d="M172 282c18-24 40-36 72-36 32 0 56 12 78 36"
              fill="none"
              stroke="#d68cff"
              strokeWidth="14"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'privacy':
        return (
          <svg viewBox="0 0 420 360" className="w-full" role="img" aria-label="Privacy illustration">
            <rect x="24" y="24" width="372" height="312" rx="30" fill="#101b2c" />
            <circle cx="310" cy="95" r="58" fill="#d68cff" opacity="0.16" />
            <rect x="112" y="92" width="196" height="176" rx="28" fill="#18263b" />
            <rect x="140" y="126" width="140" height="108" rx="20" fill="#f5f7ff" />
            <path
              d="M170 126v-24c0-24 18-42 42-42s42 18 42 42v24"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path d="M184 171h72" stroke="#7c3aed" strokeWidth="10" strokeLinecap="round" />
            <path d="M184 194h48" stroke="#94a3b8" strokeWidth="10" strokeLinecap="round" />
            <path
              d="M122 282c22-24 48-36 88-36s66 12 88 36"
              fill="none"
              stroke="#d68cff"
              strokeWidth="14"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'security':
      default:
        return (
          <svg viewBox="0 0 420 360" className="w-full" role="img" aria-label="Secure chat illustration">
            <rect x="24" y="24" width="372" height="312" rx="30" fill="#101b2c" />
            <circle cx="320" cy="95" r="52" fill="#d68cff" opacity="0.18" />
            <rect x="96" y="92" width="132" height="180" rx="24" fill="#18263b" />
            <rect x="110" y="108" width="104" height="132" rx="18" fill="#f5f7ff" />
            <rect x="124" y="126" width="76" height="14" rx="7" fill="#7c3aed" opacity="0.6" />
            <rect x="124" y="150" width="52" height="10" rx="5" fill="#94a3b8" />
            <rect x="124" y="168" width="64" height="10" rx="5" fill="#cbd5e1" />
            <rect x="124" y="186" width="58" height="10" rx="5" fill="#cbd5e1" />
            <circle cx="282" cy="152" r="42" fill="#d68cff" opacity="0.2" />
            <path
              d="M261 153c0-24 19-43 43-43 24 0 43 19 43 43 0 24-19 43-43 43-24 0-43-19-43-43Z"
              fill="#d68cff"
              opacity="0.95"
            />
            <path
              d="M250 222c4-29 24-49 54-49 30 0 50 20 54 49"
              fill="none"
              stroke="#f5f7ff"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <rect x="238" y="214" width="116" height="84" rx="22" fill="#18263b" />
            <rect x="252" y="228" width="88" height="56" rx="14" fill="#f5f7ff" />
            <path d="M268 246h56" stroke="#7c3aed" strokeWidth="8" strokeLinecap="round" />
            <path d="M268 262h40" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
            <path d="M312 118l18-18" stroke="#f5f7ff" strokeWidth="10" strokeLinecap="round" />
            <path d="M330 118l-18-18" stroke="#f5f7ff" strokeWidth="10" strokeLinecap="round" />
            <path d="M128 62c0-14 11-25 25-25h6c14 0 25 11 25 25v14h-56V62Z" fill="#d68cff" />
            <path d="M112 86h88" stroke="#f5f7ff" strokeWidth="12" strokeLinecap="round" />
            <path
              d="M98 276c10-41 47-69 91-69h18c44 0 81 28 91 69"
              fill="none"
              stroke="#d68cff"
              strokeWidth="16"
              strokeLinecap="round"
            />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col justify-between bg-[linear-gradient(135deg,#ede9fe_0%,#ddd6fe_55%,#f5f3ff_100%)] p-4 sm:p-5 lg:p-6 dark:bg-[linear-gradient(135deg,#d68cff_0%,#f0b8ff_55%,#f7d8ff_100%)]">
      <div className="flex justify-end">
        <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-[0.7rem] font-semibold tracking-[0.24em] text-violet-700 uppercase dark:bg-white/70 dark:text-[#6b21a8]">
          <Sparkles className="h-3.5 w-3.5" />
          {activeSlide.badge}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center py-2">
        <div className="w-full max-w-[18rem] rounded-3xl border border-white/70 bg-white/55 p-3 shadow-[0_20px_80px_rgba(84,36,143,0.14)] backdrop-blur dark:border-white/40 dark:bg-white/35 dark:shadow-[0_20px_80px_rgba(84,36,143,0.18)]">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-3">
            {renderIllustration(activeSlide.variant)}
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-violet-900 dark:text-[#2b1149]">{activeSlide.title}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-violet-800/90 dark:text-[#4f2e6c]">
          {activeSlide.description}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          {map(slides, (slide, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show ${slide.title} slide`}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 w-2.5 cursor-pointer rounded-full transition-all duration-300 ${
                  isActive
                    ? 'scale-125 bg-violet-700 dark:bg-[#8b2bd8]'
                    : 'bg-violet-300/80 hover:bg-violet-400 dark:bg-white/70 dark:hover:bg-white'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
