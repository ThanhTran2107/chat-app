import { Image, MessageSquare, ShieldCheck, Smartphone, UsersRound, Wifi } from 'lucide-react';

import { FeatureCard } from './feature-card.component';
import { Reveal, Section, SectionHeader } from './landing-section.component';

const features = [
  {
    title: 'Real-time Messaging',
    description: 'Instantly send and receive messages via Socket.IO, with live delivery and read receipts.',
    icon: <MessageSquare className="h-6 w-6" />,
  },
  {
    title: 'Secure Conversations',
    description:
      'JWT access tokens, bcrypt password hashing, email verification, HTTP-only refresh cookies, and rate-limited protected API routes.',
    icon: <ShieldCheck className="h-6 w-6" />,
  },
  {
    title: 'File & Image Sharing',
    description:
      'Share images and files up to 20MB. Uploads are validated and stored via Cloudinary with participant-checked downloads.',
    icon: <Image className="h-6 w-6" />,
  },
  {
    title: 'Online Presence',
    description: 'See who is online in real time, with a privacy toggle to control your own visibility.',
    icon: <Wifi className="h-6 w-6" />,
  },
  {
    title: 'Group Conversations',
    description: 'Create group conversations, invite friends, and message the whole team together.',
    icon: <UsersRound className="h-6 w-6" />,
  },
  {
    title: 'Cross-platform Experience',
    description: 'A responsive web app that adapts from phones to widescreen monitors, keeping conversations in sync.',
    icon: <Smartphone className="h-6 w-6" />,
  },
];

export function FeaturesSection() {
  return (
    <Section id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal delay={0}>
          <SectionHeader
            eyebrow="Features"
            title="Everything you need to stay in touch"
            description="Tetra brings together real-time messaging, secure authentication, and rich media sharing in a single clean interface."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 100}>
              <FeatureCard icon={feature.icon} title={feature.title} description={feature.description} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
