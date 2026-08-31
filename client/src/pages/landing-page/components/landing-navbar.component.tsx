import map from 'lodash-es/map';
import { Menu } from 'lucide-react';

import { Link, useLocation } from 'react-router-dom';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.component';

import { APP_NAME, STATIC_ASSETS } from '@/utils/constants';

import { PrimaryButton } from './landing-button.component';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Security', href: '#security' },
  { label: 'Platforms', href: '#platforms' },
  { label: 'Use cases', href: '#use-cases' },
  { label: 'Benefits', href: '#benefits' },
];

const NavLink = ({ label, href }: { label: string; href: string }) => (
  <a
    href={href}
    className="text-sm font-medium text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
  >
    {label}
  </a>
);

export function LandingNavbar() {
  const { pathname } = useLocation();

  const handleLogoClick = () => {
    if (pathname === '/') window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 text-slate-950 shadow-sm shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95 dark:text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-semibold tracking-[0.12em] text-slate-950 dark:text-white"
          aria-label={`${APP_NAME} home`}
          onClick={handleLogoClick}
        >
          <img src={STATIC_ASSETS.MAIN_LOGO} alt={`${APP_NAME} logo`} className="h-12 w-12 rounded-full object-cover" />
          <span>{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {map(navLinks, link => (
            <NavLink key={link.href} label={link.label} href={link.href} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <PrimaryButton to="/login">Get started</PrimaryButton>
          </div>

          <Sheet>
            <SheetTrigger
              aria-label="Open menu"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200/70 bg-white/80 p-2.5 text-slate-950 shadow-sm md:hidden dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-300"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-background flex w-64 flex-col gap-6 p-6 pt-16">
              {map(navLinks, link => (
                <NavLink key={link.href} label={link.label} href={link.href} />
              ))}
              <PrimaryButton to="/login" className="mt-2 justify-center">
                Get started
              </PrimaryButton>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
