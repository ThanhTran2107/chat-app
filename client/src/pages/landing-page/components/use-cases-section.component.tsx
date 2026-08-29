import { Image, MessageSquare, Users, UsersRound } from 'lucide-react';

import { FeatureCard } from './feature-card.component';
import { Reveal, Section, SectionHeader } from './landing-section.component';

const useCases = [
  {
    title: 'Friends & communities',
    description: 'Stay close with one-on-one chats and group conversations, with live online presence.',
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: 'Small teams',
    description: 'Coordinate with a team using group chats, shared files, and read receipts.',
    icon: <UsersRound className="h-6 w-6" />,
  },
  {
    title: 'File sharing',
    description: 'Send images and documents up to 20MB, stored securely on Cloudinary and delivered instantly.',
    icon: <Image className="h-6 w-6" />,
  },
  {
    title: 'Real-time collaboration',
    description: 'Get live message delivery and read receipts so everyone stays aligned.',
    icon: <MessageSquare className="h-6 w-6" />,
  },
];

export function UseCasesSection() {
  return (
    <Section id="use-cases">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal delay={0}>
          <SectionHeader
            eyebrow="Use cases"
            title="For friends, teams, and everyone in between"
            description="Tetra fits the conversations that matter most to you."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((useCase, i) => (
            <Reveal key={useCase.title} delay={i * 100}>
              <FeatureCard icon={useCase.icon} title={useCase.title} description={useCase.description} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
