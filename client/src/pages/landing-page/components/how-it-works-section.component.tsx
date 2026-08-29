import { Reveal, Section, SectionHeader } from './landing-section.component';

const steps = [
  {
    number: '01',
    title: 'Create your account',
    description: 'Sign up with an email, Google, or Facebook account, then verify your email to activate your profile.',
  },
  {
    number: '02',
    title: 'Find friends and start conversations',
    description: 'Search users by username, send friend requests, and open direct chats or create group conversations.',
  },
  {
    number: '03',
    title: 'Start chatting instantly',
    description:
      'Send messages, share images and files, and see live presence — all delivered in real time over Socket.IO.',
  },
];

export function HowItWorksSection() {
  return (
    <Section id="how-it-works" className="bg-slate-50/80 dark:bg-[#050b14]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal delay={0}>
          <SectionHeader
            eyebrow="How it works"
            title="Three simple steps to start chatting"
            description="No complex setup. Get from signup to your first real-time conversation in under a minute."
          />
        </Reveal>

        <div className="relative mx-auto mt-14 max-w-3xl">
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-5 -ml-px w-px bg-slate-200 dark:bg-white/10"
          />

          <div className="space-y-10">
            {steps.map((step, i) => (
              <Reveal key={step.number} delay={i * 120}>
                <div className="relative flex items-start last:pb-0">
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-600 shadow-[0_0_40px_rgba(129,95,255,0.15)] ring-4 ring-white dark:ring-slate-950">
                    <span className="text-sm font-bold text-violet-600 dark:text-violet-300">{step.number}</span>
                  </div>
                  <div className="ml-6 pt-0.5">
                    <h3 className="text-xl font-semibold text-slate-950 dark:text-white">{step.title}</h3>
                    <p className="mt-1.5 max-w-md text-base text-slate-700 dark:text-slate-300">{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
