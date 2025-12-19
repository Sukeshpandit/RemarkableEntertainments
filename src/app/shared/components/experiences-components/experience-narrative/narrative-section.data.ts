export interface NarrativeCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tintColor: string; // Hex color for overlay tint
  leftHeadline: string; // Headline for left column (supports multi-line via \n)
  leftParagraph: string; // Paragraph for left column
}

export interface NarrativeSection {
  id: string;
  headline: string; // Supports multi-line via \n
  paragraph: string;
  cardRange: {
    start: number;
    end: number; // Use Infinity for open-ended ranges
  };
}

export const NARRATIVE_CARDS: NarrativeCard[] = [
  {
    id: 'engagement',
    title: 'MICE Programs',
    description: ' We design and manage high-impact Meetings, Incentives, Conferences, and Exhibitions that align teams, reward performance, and strengthen organisational culture.Every touchpoint is engineered for engagement, clarity, and connection.',
    imageUrl: 'assets/images/experience/MICE.png',
    tintColor: '#E2C7E5', // Pink tint
    leftHeadline: 'Experiences \We \Specialize \in',
    leftParagraph: 'We build high-impact experiences across MICE, conferences, and launches—crafted to move people and drive outcomes that matter.'
  },
  {
    id: 'independence',
    title: 'Independence',
    description: 'We respect each client\'s unique identity, offering customized solutions tailored to your values and heritage, while ensuring a transparent and autonomous approach.',
    imageUrl: 'assets/images/experience/independence.png',
    tintColor: '#B500DB', // Purple tint
    leftHeadline: 'Conferences ,\n & Leadership &\n Forums',
    leftParagraph: 'From CXO summits to thought-leadership platforms, we build forums that elevate your brand’s authority.Sharp content, seamless flow, and precision execution ensure every moment drives influence.' 
  },
  {
    id: 'humanism',
    title: 'Humanism',
    description: 'At Aurora Agency, people come first. We foster collective intelligence by valuing every collaborator and client, creating collaborative and creative projects where everyone contributes.',
    imageUrl: 'assets/images/experience/humanism.png',
    tintColor: '#E2C7E5', // Pink tint
    leftHeadline: 'Brand ,\n & Product \n Launches ',
    leftParagraph: 'We create launch experiences that cut through noise and command attention.From narrative-building to immersive execution, we turn your biggest moments into powerful market statements.'
  },
  {
    id: 'performance',
    title: 'Performance',
    description: 'We strive for excellence at every stage of our work. Through a culture of continuous improvement and transparent results, we help you achieve sustainable and measurable performance.',
    imageUrl: 'assets/images/experience/performance.png',
    tintColor: '#3215AD', // Indigo tint
    leftHeadline: 'Corporate Events \n & Annual Gatherings',
    leftParagraph: 'Town halls, annual days, offsites, and cultural events built to energize teams and deepen alignment.We combine storytelling, content, and immersive environments to create events that people remember and talk about.'
  },
  // {
  //   id: 'leisure',
  //   title: 'Leisure',
  //   description: 'We design and manage leisure experiences that energize and inspire. From themed events to immersive environments, we create moments that people want to share and remember.',
  //   imageUrl: 'assets/images/experience/narrative/leisure.jpg',
  //   tintColor: '#E2C7E5', // Pink tint
  //   leftHeadline: 'Corporate Events \n & Annual Gatherings',
  //   leftParagraph: 'Town halls, annual days, offsites, and cultural events built to energize teams and deepen alignment.We combine storytelling, content, and immersive environments to create events that people remember and talk about.'  
  // },
];

export const NARRATIVE_SECTIONS: NarrativeSection[] = [
  {
    id: 'section-1',
    headline: 'Experiences \We  &\Specialize \in',
    paragraph: 'As a trusted partner in luxury outdoor hospitality, we place our expertise and creativity at the service of your success—helping your property be seen, desired, and remembered worldwide.',
    cardRange: {
      start: 0,
      end: 3
    }
  },
  {
    id: 'section-2',
    headline: 'Testimonial\nCards',
    paragraph: 'Discover what our partners say about working with Aurora Agency and the impact we\'ve created together.',
    cardRange: {
      start: 4,
      end: Infinity
    }
  }
];
