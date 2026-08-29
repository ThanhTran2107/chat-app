import { Link, useLocation } from 'react-router-dom';

import { APP_NAME, STATIC_ASSETS } from '@/utils/constants';

const productLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Security', href: '#security' },
  { label: 'Platforms', href: '#platforms' },
  { label: 'Use cases', href: '#use-cases' },
  { label: 'Benefits', href: '#benefits' },
];

const accountLinks = [
  { label: 'Login', to: '/login' },
  { label: 'Register', to: '/register' },
];

export function LandingFooter() {
  const { pathname } = useLocation();

  const handleLogoClick = () => {
    if (pathname === '/') window.location.reload();
  };

  return (
    <footer className="w-full border-t border-slate-200/70 bg-slate-50 px-4 py-10 text-slate-500 sm:px-6 lg:px-8 dark:border-white/10 dark:bg-[#050916]">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
        <div className="flex flex-col gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-semibold tracking-[0.12em] text-slate-950 dark:text-white"
            aria-label={`${APP_NAME} home`}
            onClick={handleLogoClick}
          >
            <img
              src={STATIC_ASSETS.MAIN_LOGO}
              alt={`${APP_NAME} logo`}
              className="h-10 w-10 rounded-full object-cover"
            />
            <span>{APP_NAME}</span>
          </Link>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Real-time chat for teams and communities. Message, share, and stay in sync everywhere.
          </p>
        </div>

        <div className="grid gap-2 text-sm">
          <p className="text-xs font-semibold text-slate-700 uppercase dark:text-slate-200">Product</p>
          {productLinks.map(link => (
            <a key={link.href} href={link.href} className="transition hover:text-slate-950 dark:hover:text-white">
              {link.label}
            </a>
          ))}
        </div>

        <div className="grid gap-2 text-sm">
          <p className="text-xs font-semibold text-slate-700 uppercase dark:text-slate-200">Account</p>
          {accountLinks.map(link => (
            <Link key={link.to} to={link.to} className="transition hover:text-slate-950 dark:hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10 border-t border-slate-200/70 pt-6 text-center text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
