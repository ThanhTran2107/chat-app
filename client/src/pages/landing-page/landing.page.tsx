import { Cloud, MessageSquare, Rocket, ShieldCheck, Smartphone, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ThemeToggleFloat } from '@/components/ui/theme-toggle-float';

export function LandingPage() {
  return (
    <div className="bg-background text-foreground min-h-screen dark:bg-[#050916] dark:text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-60 bg-[radial-gradient(circle_at_top,rgba(129,95,255,0.16),transparent_40%)]" />
      <div className="pointer-events-none absolute top-40 right-0 h-72 w-72 rounded-full bg-[#8c50ff]/20 blur-3xl" />
      <div className="pointer-events-none absolute top-140 left-0 h-72 w-72 rounded-full bg-[#4b76ff]/10 blur-3xl" />

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 text-slate-950 shadow-sm shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95 dark:text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-semibold tracking-[0.12em] text-slate-950 dark:text-white"
          >
            <img src="/main-logo.png" alt="Tetra logo" className="h-12 w-12 rounded-full object-cover" />
            <span>Tetra</span>
          </Link>

          <nav className="hidden items-center gap-8 rounded-full bg-white/80 px-4 py-2 text-sm text-slate-700 shadow-[0_10px_70px_rgba(15,23,42,0.08)] md:flex dark:bg-slate-950/80 dark:text-slate-300">
            <a href="#features" className="transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">
              Features
            </a>
            <a href="#trusted-by" className="transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">
              Community
            </a>
            <a href="#cta" className="transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">
              Join Now
            </a>
          </nav>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <ThemeToggleFloat />
        <section className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-slate-100/70 px-4 py-2 text-sm text-violet-800 shadow-[0_0_60px_rgba(143,100,255,0.08)] dark:bg-white/5 dark:text-violet-200">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
              Real-time messaging solution for teams and communities
            </div>

            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tighter text-slate-950 sm:text-6xl dark:text-white">
                Connect instantly,
                <br />
                Secure by design
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-700 sm:text-lg dark:text-slate-300">
                Tetra delivers a real-time chat platform with end-to-end encryption, elegant design, and seamless sync
                across every device. Build secure connections for your team, clients, and community.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110"
              >
                Create a free account
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-slate-200/70 bg-slate-950/5 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-300/70 hover:bg-slate-950/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-white/20 dark:hover:bg-white/10"
              >
                Explore features
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['50ms', 'Ultra-low latency'],
                ['End-to-end', 'Encrypt every conversation'],
                ['Multi-device', 'Available everywhere'],
              ].map(([label, description]) => (
                <div
                  key={String(label)}
                  className="rounded-3xl border border-slate-200/70 bg-white/80 px-5 py-4 text-sm text-slate-700 shadow-[0_20px_120px_rgba(0,0,0,0.1)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                >
                  <p className="font-semibold text-slate-950 dark:text-white">{label}</p>
                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-400">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-4xl bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.16),transparent_45%)] blur-3xl" />
            <div className="relative overflow-hidden rounded-4xl border border-slate-200/70 bg-white/80 shadow-2xl shadow-slate-950/10 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-slate-950/40">
              <div className="absolute top-12 -left-16 h-24 w-24 rounded-full bg-violet-500/20 blur-2xl" />
              <div className="absolute top-14 right-4 h-16 w-16 rounded-full bg-cyan-400/10 blur-2xl" />
              <div className="absolute bottom-10 left-10 h-20 w-20 rounded-full bg-fuchsia-500/10 blur-2xl" />
              <div className="relative rounded-4xl border border-slate-200/70 bg-white/90 p-6 md:p-8 dark:border-white/5 dark:bg-slate-950/95">
                <div className="flex items-center justify-between gap-2 pb-5">
                  <div className="h-3.5 w-3.5 rounded-full bg-emerald-400/80" />
                  <div className="flex items-center gap-2 text-xs tracking-[0.32em] text-slate-500 uppercase">
                    <span className="rounded-full bg-slate-100/70 px-2 py-1 text-slate-800 dark:bg-white/5 dark:text-slate-100">
                      Tetra Chat
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">Online</span>
                  </div>
                </div>

                <div className="grid gap-4 rounded-[28px] bg-slate-100 p-5 shadow-inner shadow-slate-950/10 sm:grid-cols-2 dark:bg-[#0d1729]">
                  <div className="space-y-4 rounded-3xl bg-slate-100 p-4 shadow-[inset_0_1px_0_rgba(15,23,42,0.04)] dark:bg-slate-900/90">
                    <div className="flex items-center justify-between text-xs tracking-[0.24em] text-slate-500 uppercase">
                      <span>Channel</span>
                      <span>23:14</span>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-[22px] bg-slate-800/80 p-3 text-sm leading-6 text-slate-100">
                        Enterprise-grade security for every conversation.
                      </div>
                      <div className="rounded-[22px] bg-linear-to-r from-violet-500/10 via-white/5 to-cyan-500/10 p-3 text-sm leading-6 text-slate-100">
                        Instant message sync across all devices.
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 rounded-3xl bg-slate-50 p-4 shadow-[inset_0_1px_0_rgba(15,23,42,0.04)] dark:bg-slate-900/90">
                    <div className="leading-6 text-slate-300">
                      <p className="text-sm font-semibold text-white">Conversation</p>
                      <p className="text-xs text-slate-400">Friends & work groups</p>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-[22px] bg-slate-800/80 p-3 text-sm text-slate-100">
                        End-to-end encrypted conversation threads.
                      </div>
                      <div className="rounded-[22px] bg-slate-800/80 p-3 text-sm text-slate-100">
                        See who is online, get reminders, and reply fast.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-[28px] bg-slate-900/80 p-5 text-sm text-slate-300 shadow-[inset_0_2px_12px_rgba(15,23,42,0.6)]">
                  <div className="mb-3 flex items-center justify-between text-xs tracking-[0.28em] text-slate-500 uppercase">
                    <span>Activity</span>
                    <span>Realtime</span>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-2xl bg-white/90 p-3 text-slate-950 shadow-sm shadow-slate-900/5 dark:bg-slate-950/80 dark:text-slate-100">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Lina</p>
                      <p className="text-sm">“Shared the financial report.”</p>
                    </div>
                    <div className="rounded-2xl bg-white/90 p-3 text-slate-950 shadow-sm shadow-slate-900/5 dark:bg-slate-950/80 dark:text-slate-100">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Kai</p>
                      <p className="text-sm">“Okay, I will check it now.”</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-20 scroll-mt-50 space-y-8">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm tracking-[0.3em] text-violet-600 uppercase dark:text-violet-300">Why Tetra</p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl dark:text-white">
              Why choose Tetra?
            </h2>
            <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
              Tetra is built to deliver a fast, secure, and smooth chat experience across every platform.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Blazing speed',
                description: 'Instant sync and instant replies, no device limits.',
                icon: <MessageSquare className="h-6 w-6" />,
              },
              {
                title: 'End-to-end security',
                description: 'Data is encrypted on-device, visible only to the sender and receiver.',
                icon: <ShieldCheck className="h-6 w-6" />,
              },
              {
                title: 'Cross-platform',
                description: 'Web, mobile, and desktop work seamlessly with one account.',
                icon: <Smartphone className="h-6 w-6" />,
              },
            ].map(feature => (
              <div
                key={feature.title}
                className="group rounded-[28px] border border-slate-200/70 bg-white/90 p-6 text-slate-950 transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-950/80 dark:text-white dark:hover:bg-slate-900/90"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-500/10 text-violet-300 transition group-hover:bg-violet-500/15">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-950 dark:text-white">{feature.title}</h3>
                <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="trusted-by"
          className="mt-20 scroll-mt-50 rounded-4xl border border-slate-200/70 bg-slate-50/80 p-6 shadow-[0_40px_120px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8 dark:border-white/10 dark:bg-white/5"
        >
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm tracking-[0.3em] text-violet-300 uppercase">Trusted by</p>
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                  Loved by over 10,000 users worldwide
                </h2>
                <p className="max-w-xl text-base leading-8 text-slate-700 dark:text-slate-300">
                  Teams, creators, and communities choose Tetra for instant messaging, secure conversations, and a
                  polished experience that scales with every group.
                </p>
              </div>

              <div className="flex flex-col gap-4 rounded-3xl bg-slate-100 p-5 shadow-[inset_0_1px_0_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between dark:bg-slate-950/90 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div>
                  <p className="text-sm tracking-[0.26em] text-slate-500 uppercase dark:text-slate-400">
                    Active members
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">10,000+</p>
                </div>
                <div>
                  <p className="text-sm tracking-[0.26em] text-slate-500 uppercase dark:text-slate-400">
                    Communities onboarded
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">250+</p>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {[
                { name: 'Cyber', icon: <Cloud className="h-4 w-4" /> },
                { name: 'Astro', icon: <Rocket className="h-4 w-4" /> },
                { name: 'Nebula', icon: <ShieldCheck className="h-4 w-4" /> },
                { name: 'Safeco', icon: <Zap className="h-4 w-4" /> },
              ].map(brand => (
                <div
                  key={brand.name}
                  className="group rounded-4xl border border-slate-200/70 bg-white/90 px-6 py-6 transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-950/80 dark:hover:bg-slate-900/90"
                >
                  <div className="mb-4 inline-flex items-center justify-center gap-2 rounded-3xl bg-slate-100 px-4 py-3 text-slate-700 transition group-hover:bg-violet-500/10 group-hover:text-white dark:bg-slate-900/70 dark:text-slate-300">
                    {brand.icon}
                    <span className="text-sm tracking-[0.24em] uppercase">{brand.name}</span>
                  </div>
                  <div className="h-1 rounded-full bg-linear-to-r from-violet-500/20 via-white/15 to-cyan-400/20" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="cta"
          className="mt-20 rounded-4xl border border-slate-200/70 bg-linear-to-br from-slate-100 via-slate-50 to-slate-200 p-10 text-center shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:from-slate-950/90 dark:via-slate-900/80 dark:to-slate-950/95"
        >
          <p className="text-sm tracking-[0.3em] text-violet-300 uppercase">Ready to go?</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950 sm:text-4xl dark:text-white">
            Ready to upgrade your communication experience?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-700 dark:text-slate-300">
            Start free today. No credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 px-8 py-3 text-sm font-semibold text-white shadow-xl shadow-violet-500/20 transition hover:brightness-110"
            >
              Create a free account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-slate-200/70 bg-white/90 px-8 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-300/70 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-white/20 dark:hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/70 bg-slate-50 px-4 py-8 text-slate-500 backdrop-blur-xl sm:px-6 lg:px-8 dark:border-white/10 dark:bg-[#050916]/80 dark:text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm">© 2026 Tetra Communications. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a href="#" className="transition hover:text-slate-950 dark:hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition hover:text-slate-950 dark:hover:text-white">
              Terms
            </a>
            <a href="#" className="transition hover:text-slate-950 dark:hover:text-white">
              Status
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
