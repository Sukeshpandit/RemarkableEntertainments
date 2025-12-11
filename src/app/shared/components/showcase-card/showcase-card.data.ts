export interface ShowcaseCard {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
  link?: string;
}

export const SHOWCASE_CARDS: ShowcaseCard[] = [
  {
    id: 1,
    title: 'Event Production Excellence',
    description: 'Creating unforgettable experiences through innovative event design and flawless execution.',
    category: 'Events',
    imageUrl: 'assets/images/showcase-1.jpg'
  },
  {
    id: 2,
    title: 'Brand Activation Campaigns',
    description: 'Strategic brand activations that connect audiences and drive meaningful engagement.',
    category: 'Branding',
    imageUrl: 'assets/images/showcase-2.jpg'
  },
  {
    id: 3,
    title: 'Entertainment Experiences',
    description: 'Curating premium entertainment experiences that captivate and inspire audiences.',
    category: 'Entertainment',
    imageUrl: 'assets/images/showcase-3.jpg'
  },
  {
    id: 4,
    title: 'Corporate Gatherings',
    description: 'Professional corporate events that elevate your brand and strengthen relationships.',
    category: 'Corporate',
    imageUrl: 'assets/images/showcase-4.jpg'
  },
  {
    id: 5,
    title: 'Festival Management',
    description: 'End-to-end festival management delivering seamless experiences for thousands.',
    category: 'Festivals',
    imageUrl: 'assets/images/showcase-5.jpg'
  },
  {
    id: 6,
    title: 'Creative Direction',
    description: 'Bold creative direction that brings your vision to life with artistic excellence.',
    category: 'Creative',
    imageUrl: 'assets/images/showcase-6.jpg'
  }
];
