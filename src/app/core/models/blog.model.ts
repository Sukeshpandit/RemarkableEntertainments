export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  date?: string;
  image?: string;
  tags?: string[];
  category?: string;
}

