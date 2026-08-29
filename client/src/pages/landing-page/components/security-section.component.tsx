import { Cookie, FileText, Key, Lock, MailCheck, Shield, ShieldCheck } from 'lucide-react';

import { Reveal, Section, SectionHeader } from './landing-section.component';

const securityItems = [
  {
    icon: <Key className="h-5 w-5" />,
    title: 'JWT access tokens',
    description: 'Short-lived access tokens (30 min) signed with a secret key authenticate every private API call.',
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: 'bcrypt password hashing',
    description: 'Passwords are hashed with bcrypt (rounds 10); the raw hash is never returned by protected routes.',
  },
  {
    icon: <MailCheck className="h-5 w-5" />,
    title: 'Email verification',
    description: 'Local accounts must verify their email before they can log in.',
  },
  {
    icon: <Cookie className="h-5 w-5" />,
    title: 'HTTP-only refresh cookies',
    description: 'Refresh tokens (14 days) live in an HTTP-only cookie and are validated server-side per session.',
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'Protected API routes',
    description: 'Every private route is gated by token verification, and user lookups strip sensitive fields.',
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: 'Rate limiting',
    description: 'Authentication and refresh endpoints are rate limited to defend against brute-force attacks.',
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: 'Validated uploads',
    description: 'File attachments are type, extension, and size checked (up to 20MB) before being stored.',
  },
  {
    icon: <Key className="h-5 w-5" />,
    title: 'Authorized downloads',
    description: 'Message attachments are only served to conversation participants.',
  },
];

export function SecuritySection() {
  return (
    <Section id="security" className="bg-slate-50/60 dark:bg-[#050b14]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal delay={0}>
          <SectionHeader
            eyebrow="Security"
            title="Built with secure defaults"
            description="Tetra protects authentication, transport, and data access with industry-standard practices."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {securityItems.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 80}
              className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 text-slate-950 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 dark:text-white"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-violet-500/10 text-violet-600 dark:text-violet-300">
                {item.icon}
              </div>
              <h3 className="mb-2 text-base font-semibold">{item.title}</h3>
              <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
