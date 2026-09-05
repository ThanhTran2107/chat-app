import map from 'lodash-es/map';
import { Check, CheckCheck, Image, Paperclip, Search, Send, Smile, UsersRound } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Reveal, Section, SectionHeader } from './landing-section.component';

export function ProductShowcase() {
  return (
    <Section id="showcase">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal delay={0}>
          <SectionHeader
            eyebrow="Product"
            title="Tetra in action"
            description="A real-time chat interface for one-on-one conversations and group discussions. Share text, images, and files while seeing who is online — all in one responsive window."
          />
        </Reveal>

        <Reveal delay={150} className="mt-12">
          <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-4xl">
            <div
              aria-hidden="true"
              className="absolute -inset-4 -z-10 rounded-[44px] bg-[radial-gradient(circle_at_top,rgba(129,95,255,0.3),transparent_50%)] blur-3xl"
            />
            <WindowFrame />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[26px] shadow-2xl shadow-slate-950/40"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function WindowFrame() {
  return (
    <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[26px] border border-slate-200/70 bg-white shadow-2xl shadow-slate-950/10 dark:border-white/10 dark:bg-slate-950/80">
      <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3 dark:border-white/10">
        <div className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded-full bg-red-400" />
          <span className="h-3.5 w-3.5 rounded-full bg-amber-400" />
          <span className="h-3.5 w-3.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1" />
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
          chat-app-b4r.vercel.app
        </div>
        <div className="flex-1" />
      </div>

      <div className="flex h-110 w-full overflow-hidden sm:h-125 lg:h-140">
        <ConversationSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <ChatHeader />
          <ChatBody />
          <ChatInput />
        </div>
      </div>
    </div>
  );
}

const conversations = [
  {
    id: '1',
    avatar: 'M',
    name: 'Maya Rodriguez',
    role: 'online',
    last: 'Looking forward to the weekend plans :)',
    time: '10:42 AM',
    unread: 2,
    active: true,
  },
  {
    id: '2',
    avatar: 'J',
    name: 'Jake Nguyen',
    role: 'offline',
    last: 'Sent the quarterly slides, let me know your thoughts.',
    time: 'Yesterday',
    unread: 0,
    active: false,
  },
  {
    id: '3',
    avatar: 'D',
    name: 'Design team',
    role: 'group',
    last: 'New comment on the homepage mockup',
    time: 'Tue',
    unread: 0,
    active: false,
  },
];

function ConversationSidebar() {
  return (
    <div className="flex w-72 flex-col border-r border-slate-200/70 bg-slate-900/90 text-slate-100 dark:border-white/10 dark:bg-[#0d1729]">
      <div className="flex items-center justify-between border-b border-slate-700/40 px-4 py-3 dark:border-white/10">
        <h3 className="text-sm font-semibold text-slate-300">Chats</h3>
        <UsersRound className="h-4 w-4 text-slate-400" />
      </div>

      <div className="flex items-center gap-2 border-b border-slate-700/40 px-3 py-2 dark:border-white/10">
        <Search className="h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search"
          aria-hidden="true"
          tabIndex={-1}
          className="flex-1 bg-transparent text-sm text-slate-400 outline-none placeholder:text-slate-500"
        />
      </div>

      <div className="beautiful-scrollbar flex-1 space-y-0.5 overflow-y-auto py-2">
        {map(conversations, convo => (
          <div
            key={convo.id}
            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-800/60 dark:hover:bg-white/5"
          >
            <div
              className={cn(
                'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                convo.role === 'group' ? 'bg-violet-500/20 text-violet-300' : 'bg-slate-500 text-white',
              )}
            >
              {convo.avatar}
              {convo.role === 'online' && <StatusDot />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-100">{convo.name}</p>
                <span className="text-xs text-slate-400">{convo.time}</span>
              </div>
              <p className="truncate text-sm text-slate-400">{convo.last}</p>
            </div>
            {convo.unread > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-xs font-semibold text-white">
                {convo.unread}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusDot() {
  return (
    <span className="status-online absolute right-0.5 bottom-0 block h-2.5 w-2.5 rounded-full ring-2 ring-slate-900" />
  );
}

function ChatHeader() {
  return (
    <div className="flex items-center justify-between border-b border-slate-200/70 bg-slate-100/80 px-5 py-3 dark:border-white/10 dark:bg-slate-950/80">
      <div className="flex items-center gap-3">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-300 text-sm font-semibold text-slate-700">
          M
        </div>
        <StatusDot />
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-white">Maya Rodriguez</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Online</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <Paperclip className="h-4 w-4" />
        <Search className="h-4 w-4" />
      </div>
    </div>
  );
}

const chatMessages = [
  { type: 'time', value: 'Today' },
  { type: 'received', avatar: 'M', text: 'Looking forward to the weekend plans :)', time: '10:42 AM' },
  { type: 'received-image' },
  { type: 'sent', text: 'Same! I booked the cabin near Lake Tahoe. Want to join us?', time: '10:46 AM', seen: true },
] as const;

function ChatBody() {
  return (
    <div className="beautiful-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-5">
      {map(chatMessages, (msg, i) => (
        <ChatMessage key={i} msg={msg} />
      ))}
    </div>
  );
}

function ChatMessage({ msg }: { msg: (typeof chatMessages)[number] }) {
  if (msg.type === 'time') {
    return <div className="text-center text-xs text-slate-500 dark:text-slate-400">{msg.value}</div>;
  }

  if (msg.type === 'received-image') {
    return (
      <div className="max-w-[60%] self-start">
        <img src="/placeholder.png" alt="Shared photo" className="rounded-[22px] shadow-sm" aria-hidden="true" />
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">10:43 AM</div>
      </div>
    );
  }

  if (msg.type === 'received') {
    return (
      <div className="flex justify-start">
        <div className="mt-1 mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-300 text-xs font-semibold text-slate-700">
          {msg.avatar}
        </div>
        <div className="max-w-[65%] space-y-1">
          <div className="rounded-2xl border border-slate-200/70 bg-slate-100 px-4 py-3 text-sm text-slate-800 dark:border-white/10 dark:bg-slate-800/90 dark:text-slate-200">
            {msg.text}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">{msg.time}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="max-w-[65%] space-y-1">
        <div className="rounded-2xl bg-linear-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-sm text-white">
          {msg.text}
        </div>
        <div className="flex items-center gap-1.5 self-end text-xs text-slate-500 dark:text-slate-400">
          <span>{msg.time}</span>
          {msg.seen ? <CheckCheck className="h-3 w-3 text-cyan-400" /> : <Check className="h-3 w-3" />}
        </div>
      </div>
    </div>
  );
}

function ChatInput() {
  return (
    <div className="flex items-center gap-2 border-t border-slate-200/70 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-950/80">
      <Smile className="h-5 w-5 text-slate-400" />
      <Image className="h-5 w-5 text-slate-400" />
      <Paperclip className="h-5 w-5 text-slate-400" />
      <input
        type="text"
        placeholder="Message..."
        aria-hidden="true"
        tabIndex={-1}
        className="flex-1 bg-transparent text-sm text-slate-400 outline-none placeholder:text-slate-500"
      />
      <button
        type="button"
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 text-white opacity-40"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}
