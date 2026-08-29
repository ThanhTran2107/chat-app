import { Image, MailCheck, ShieldCheck, Users, UsersRound, Wifi } from 'lucide-react';

import { Reveal, Section, SectionHeader } from './landing-section.component';

const benefits = [
  {
    value: 'Real-time',
    label: 'Real-time delivery',
    description: 'Messages are pushed instantly to recipients over Socket.IO.',
    icon: <Wifi className="h-6 w-6" />,
  },
  {
    value: 'Verified',
    label: 'Email verified accounts',
    description: 'Every local account must verify its email before signing in.',
    icon: <MailCheck className="h-6 w-6" />,
  },
  {
    value: '20MB',
    label: 'File & image sharing',
    description: 'Share photos and documents, validated and stored via Cloudinary.',
    icon: <Image className="h-6 w-6" />,
  },
  {
    value: 'Secure',
    label: 'Protected by default',
    description: 'JWT auth, bcrypt hashing, HTTP-only refresh cookies, and rate limiting.',
    icon: <ShieldCheck className="h-6 w-6" />,
  },
  {
    value: 'Presence',
    label: 'Live online status',
    description: 'See who is available right now, with a privacy toggle for your visibility.',
    icon: <Users className="h-6 w-6" />,
  },
  {
    value: 'Groups',
    label: 'Direct & group chats',
    description: 'One-on-one conversations and group discussions in the same interface.',
    icon: <UsersRound className="h-6 w-6" />,
  },
];

export function BenefitsSection() {
  return (
    <Section id="benefits" className="bg-slate-50/60 dark:bg-[#050b14]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal delay={0}>
            <SectionHeader
              eyebrow="Capabilities"
              title="Concrete capabilities"
              description="These are real behaviors of the Tetra implementation — reliable real-time messaging with secure authentication and rich media."
              align="start"
            />
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit, i) => (
              <Reveal
                key={benefit.label}
                delay={i * 80}
                className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 text-sm text-slate-700 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-violet-500/10 text-violet-600 dark:text-violet-300">
                    {benefit.icon}
                  </div>
                  <p className="font-semibold text-slate-950 dark:text-white">{benefit.value}</p>
                </div>
                <p className="font-medium text-slate-950 dark:text-white">{benefit.label}</p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-400">{benefit.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
