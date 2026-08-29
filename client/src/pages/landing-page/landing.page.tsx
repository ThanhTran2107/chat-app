import { ThemeToggleFloat } from '@/components/ui/theme-toggle-float.component';

import { HeroSection } from './components/hero-section.component';
import { LandingFooter } from './components/landing-footer.component';
import { LandingNavbar } from './components/landing-navbar.component';
import { lazy, Suspense } from 'react';
import { ProductShowcase } from './components/product-showcase.component';

const LazyBenefitsSection = lazy(() =>
  import('./components/benefits-section.component').then(m => ({ default: m.BenefitsSection })),
);
const LazyFeaturesSection = lazy(() =>
  import('./components/features-section.component').then(m => ({ default: m.FeaturesSection })),
);
const LazyHowItWorksSection = lazy(() =>
  import('./components/how-it-works-section.component').then(m => ({ default: m.HowItWorksSection })),
);
const LazySecuritySection = lazy(() =>
  import('./components/security-section.component').then(m => ({ default: m.SecuritySection })),
);
const LazyPlatformSection = lazy(() =>
  import('./components/platform-section.component').then(m => ({ default: m.PlatformSection })),
);
const LazyUseCasesSection = lazy(() =>
  import('./components/use-cases-section.component').then(m => ({ default: m.UseCasesSection })),
);
const LazyFinalCtaSection = lazy(() =>
  import('./components/final-cta-section.component').then(m => ({ default: m.FinalCtaSection })),
);

export function LandingPage() {
  return (
    <div className="bg-background text-foreground min-h-screen dark:bg-[#050916] dark:text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="absolute top-40 right-0 h-72 w-72 rounded-full bg-fuchsia-500/12 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <ThemeToggleFloat />
      <LandingNavbar />

      <main className="w-full">
        <HeroSection />
        <ProductShowcase />
        <Suspense fallback={null}>
          <LazyBenefitsSection />
          <LazyFeaturesSection />
          <LazyHowItWorksSection />
          <LazySecuritySection />
          <LazyPlatformSection />
          <LazyUseCasesSection />
          <LazyFinalCtaSection />
        </Suspense>
      </main>

      <LandingFooter />
    </div>
  );
}
