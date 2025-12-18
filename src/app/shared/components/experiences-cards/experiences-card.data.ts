export interface ShowcaseCard {
  id: number;
  title: string;
  description: string;
  videoUrl?: string;
  category?: string;
  link?: string;
  tags?: string[];
}

export const SHOWCASE_CARDS: ShowcaseCard[] = [
  {
    id: 1,
    title: 'Strategic by Design',
    description: 'We don’t “manage” events — we engineer experiences around clear business objectives.Every format, narrative, and touchpoint is built to influence behaviour, strengthen brand positioning, and deliver measurable outcomes',
    category: 'OUR  OFFER',
    videoUrl: 'assets/videos/potrait_v3.mp4',
    tags: ['Strategy ', 'Experience Design', 'Objective-led Planning']
  },  {
    id: 4,
    title: 'Execution Without Compromise',
    description: ' From multi-city MICE programs to high-stakes leadership forums, we run operations with precision.Robust planning, specialist teams, and flawless on-ground control ensure your event performs exactly as intended — no surprises, no noise.',
    category: 'OUR  OFFER',
    videoUrl: 'assets/videos/potrait_v2.mp4',
    tags: ['Production', 'Logistics', 'End-to-End Delivery'],
  },
  {
    id: 5,
    title: 'Engagement That Actually Moves People',
    description: 'We create moments audiences feel, remember, and act on.Whether it’s a brand launch, conference, or immersive experience, we combine storytelling, content, and technology to create genuine impact and lasting connection.',
    category: 'OUR  OFFER',
    videoUrl: 'assets/videos/potrait_v1.mp4',
    tags: ['Creative', 'Content', 'Technology']
  }
];
