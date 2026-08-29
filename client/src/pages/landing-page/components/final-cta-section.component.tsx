import { PrimaryButton, SecondaryButton } from './landing-button.component';
import { Reveal } from './landing-section.component';

export function FinalCtaSection() {
  return (
    <section id="cta" className="relative w-full scroll-mt-24 overflow-hidden py-16 sm:py-20 lg:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="absolute -right-24 -bottom-16 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute -bottom-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal delay={0}>
          <p className="text-sm tracking-[0.3em] text-violet-300 uppercase">Ready to go?</p>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950 sm:text-4xl dark:text-white">
            Ready to start a better conversation?
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-700 dark:text-slate-300">
            Join Tetra today. No credit card required, and full access to messaging, file sharing, and groups.
          </p>
        </Reveal>
        <Reveal delay={300} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <PrimaryButton to="/register">Create a free account</PrimaryButton>
          <SecondaryButton to="/login">Sign in</SecondaryButton>
        </Reveal>
      </div>
    </section>
  );
}
