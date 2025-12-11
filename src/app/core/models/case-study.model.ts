export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  client?: string;
  category?: string;
  images?: string[];
  tags?: string[];
  link?: string;
  date?: string;
}

