
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date?: string;
  publishedAt?: string;
  author: string;
  authorTitle?: string;
  avatar?: string;
  image?: string;
  coverImage?: string;
  categories?: string[];
  category: string; // Make category required
  tags: string[];
  relatedPosts?: string[];
  featured?: boolean;
  readingTime: number; // Make readingTime required
  metaTitle?: string;
  metaDescription?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  description?: string;
  count?: number;
  slug?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  count?: number;
}

export interface BlogAuthor {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  avatarUrl?: string;
}
