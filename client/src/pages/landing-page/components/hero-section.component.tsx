import { Paperclip, Send, Smile, Wifi } from 'lucide-react';

import { APP_NAME } from '@/utils/constants';

import { PrimaryButton, SecondaryButton } from './landing-button.component';
import { Reveal } from './landing-section.component';

export function HeroSection() {
  return (
    <section id="hero" className="relative w-full scroll-mt-24 py-16 sm:py-20 lg:py-28 xl:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-pulse-glow absolute -top-24 -left-24 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="animate-pulse-glow animation-duration-[3.5s] absolute -top-16 -right-16 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="animate-pulse-glow animation-duration-[4.5s] absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_.9fr] lg:px-8">
        <div className="space-y-9">
          <Reveal delay={0} animateOnMount>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-slate-100/70 px-4 py-2 text-sm text-violet-800 shadow-[0_0_60px_rgba(143,100,255,0.08)] dark:bg-white/5 dark:text-violet-200">
              <span className="status-online h-2.5 w-2.5 rounded-full" />
              Real-time messaging solution for teams and communities
            </div>
          </Reveal>

          <Reveal delay={100} animateOnMount>
            <h1 className="text-4xl font-semibold tracking-tighter text-slate-950 sm:text-5xl md:text-6xl dark:text-white">
              Connect instantly,
              <br />
              Communicate securely
            </h1>
          </Reveal>

          <Reveal delay={200} animateOnMount>
            <p className="max-w-xl text-base leading-8 text-slate-700 sm:text-lg dark:text-slate-300">
              {APP_NAME} is a real-time chat app for one-on-one and group conversations. Share messages, images, and
              files with friends and teams, stay in sync across every browser session with live presence, and sign in
              with secure JWT authentication.
            </p>
          </Reveal>

          <Reveal delay={300} animateOnMount className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <PrimaryButton to="/register">Create a free account</PrimaryButton>
            <SecondaryButton href="#features">Explore features</SecondaryButton>
          </Reveal>

          <Reveal delay={400} animateOnMount className="grid gap-4 sm:grid-cols-3">
            {[
              { value: 'Real-time', label: 'Instant sync across devices' },
              { value: '20MB', label: 'File and image sharing' },
              { value: 'Live', label: 'Online presence' },
            ].map(item => (
              <div
                key={item.value}
                className="rounded-3xl border border-slate-200/70 bg-white/80 px-5 py-4 text-sm text-slate-700 shadow-[0_20px_120px_rgba(0,0,0,0.1)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                <p className="font-semibold text-slate-950 dark:text-white">{item.value}</p>
                <p className="mt-2 text-xs text-slate-400 dark:text-slate-400">{item.label}</p>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-4 -z-10 rounded-[40px] bg-[radial-gradient(circle_at_top,rgba(129,95,255,0.2),transparent_45%)] blur-2xl"
          />

          <Reveal delay={500} animateOnMount>
            <div
              className="relative overflow-hidden rounded-4xl border border-slate-200/70 bg-white/90 shadow-2xl shadow-slate-950/10 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-slate-950/40"
              style={{ animation: 'float 14s ease-in-out infinite' }}
            >
              <ChatPreview />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ChatPreview() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 px-5 py-4 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
            A
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-white">Ava Chen</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4 text-cyan-400" />
          <span className="text-xs text-slate-500 dark:text-slate-400">Secure</span>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        <div className="max-w-[82%] rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          Hey, can you review the Q3 report before the meeting?
        </div>
        <div className="max-w-[51%] self-end rounded-2xl bg-linear-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-sm text-white">
          Sure, I&apos;ll share it in a few minutes
        </div>
        <div className="mr-[20%] max-w-[23%] self-end rounded-2xl bg-linear-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-sm text-white">
          Here you go
        </div>

        <div className="flex items-end gap-1.5 self-start text-slate-400">
          <span className="typing-dot h-1.5 w-1.5 animate-bounce rounded-full" />
          <span className="typing-dot h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:150ms]" />
          <span className="typing-dot h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:300ms]" />
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-slate-200/70 px-4 py-3 dark:border-white/10">
        <Smile className="h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-sm text-slate-400 outline-none placeholder:text-slate-400"
          aria-hidden="true"
          tabIndex={-1}
        />
        <Paperclip className="h-5 w-5 text-slate-400" />
        <button
          type="button"
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 text-white"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
