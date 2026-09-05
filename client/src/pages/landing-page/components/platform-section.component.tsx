import map from 'lodash-es/map';
import { Laptop, Smartphone, Tablet } from 'lucide-react';

import { APP_NAME } from '@/utils/constants';

import { Reveal, Section, SectionHeader } from './landing-section.component';

const devices = [
  {
    name: 'Phone',
    icon: <Smartphone className="h-5 w-5 text-slate-500 dark:text-slate-400" />,
    Frame: PhoneFrame,
  },
  {
    name: 'Tablet',
    icon: <Tablet className="h-5 w-5 text-slate-500 dark:text-slate-400" />,
    Frame: TabletFrame,
  },
  {
    name: 'Desktop',
    icon: <Laptop className="h-5 w-5 text-slate-500 dark:text-slate-400" />,
    Frame: LaptopFrame,
  },
];

export function PlatformSection() {
  return (
    <Section id="platforms" className="bg-slate-50/60 dark:bg-[#050b14]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal delay={0}>
          <SectionHeader
            eyebrow="Platforms"
            title="One account. Every screen."
            description="Tetra is a responsive web app that keeps your conversations, contacts, and presence in sync across every browser session."
          />
        </Reveal>

        <div className="mt-12 flex flex-col items-center justify-center gap-8 sm:gap-10 lg:flex-row lg:gap-12">
          {map(devices, (device, i) => (
            <Reveal key={device.name} delay={i * 150}>
              <div className="flex flex-col items-center gap-3">
                <device.Frame />
                <p className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {device.icon}
                  {device.name}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function MiniChat() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-200/60 px-2 py-2 dark:border-white/10">
        <span className="h-5 w-5 rounded-full bg-blue-500 text-[10px] leading-none text-white" />
        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{APP_NAME}</span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto px-2 py-3">
        <div className="max-w-[65%] self-end rounded-2xl bg-linear-to-r from-violet-500 to-fuchsia-500 px-3 py-2 text-xs text-white">
          Hi there
        </div>
      </div>
    </div>
  );
}

function PhoneFrame() {
  return (
    <div className="relative flex h-64 w-32 items-center justify-center rounded-4xl border-8 border-slate-300 dark:border-slate-600">
      <div className="absolute -bottom-3 h-1.5 w-14 rounded-full bg-slate-300 dark:bg-slate-600" />
      <div className="h-full w-full overflow-hidden rounded-3xl bg-slate-100 dark:bg-[#0d1729]">
        <MiniChat />
      </div>
    </div>
  );
}

function TabletFrame() {
  return (
    <div className="relative flex h-80 w-48 items-center justify-center rounded-[28px] border-8 border-slate-300 dark:border-slate-600">
      <div className="h-full w-full overflow-hidden rounded-[20px] bg-slate-100 dark:bg-[#0d1729]">
        <MiniChat />
      </div>
    </div>
  );
}

function LaptopFrame() {
  return (
    <div className="relative flex h-56 w-72 items-center justify-center rounded-t-2xl border-8 border-slate-300 dark:rounded-t-2xl dark:border-slate-600">
      <div className="absolute -bottom-2 h-1.5 w-24 rounded-full bg-slate-300 dark:bg-slate-600" />
      <div className="absolute -bottom-1.5 h-3 w-32 rounded-t-none rounded-b-xl bg-slate-300 dark:bg-slate-600" />
      <div className="h-full w-full overflow-hidden rounded-t-[20px] bg-slate-100 dark:bg-[#0d1729]">
        <MiniChat />
      </div>
    </div>
  );
}
