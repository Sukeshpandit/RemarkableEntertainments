export interface ShowcaseCard {
  id: number;
  title: string;
  description: string;
  videoUrl?: string;
  category?: string;
  link?: string;
}

export const SHOWCASE_CARDS: ShowcaseCard[] = [
  {
    id: 1,
    title: 'What we do ?',
    description: 'We craft extraordinary events and entertainment experiences that leave lasting impressions. From concept to execution, we bring your ideas to life with precision and creativity.',
    category: 'Events',
    videoUrl: 'assets/videos/potrait_v3.mp4'
  },  {
    id: 4,
    title: 'Who we are ?',
    description: 'We are a team of experienced professionals who are passionate about creating extraordinary events and entertainment experiences that leave lasting impressions. From concept to execution, we bring your ideas to life with precision and creativity.',
    category: 'Corporate',
    videoUrl: 'assets/videos/potrait_v2.mp4'
  },
  {
    id: 5,
    title: 'Our Approach/Philosophy',
    description: 'We are a team of experienced professionals who are passionate about creating extraordinary events and entertainment experiences that leave lasting impressions. From concept to execution, we bring your ideas to life with precision and creativity.',
    category: 'Corporate',
    videoUrl: 'assets/videos/potrait_v1.mp4'
  }
];
