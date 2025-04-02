
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
  image?: string;
  coverImage?: string;
  categories?: string[];
  category?: string;
  tags: string[];
  relatedPosts?: string[];
  featured?: boolean;
  readingTime?: number;
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
