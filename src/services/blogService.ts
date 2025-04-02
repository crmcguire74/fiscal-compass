
import { ADDITIONAL_BLOG_POSTS } from './blogServiceExtension';
import { investingBlogPosts } from './blogServiceInvesting';
import { retirementBlogPosts } from './blogServiceRetirement';
import { budgetingBlogPosts } from './blogServiceBudgeting';
import { realEstateBlogPosts } from './blogServiceRealEstate';
import { lifeEventsPosts } from './blogServiceLifeEvents';
import { healthBlogPosts } from './blogServiceHealth';
import { BLOG_POSTS } from './blogServiceAddition';
// Import any other blog services you might have

import { BlogPost, BlogCategory, BlogTag } from '../types/blog';

export const getBlogCategories = (): BlogCategory[] => {
  // Get all posts
  const allPosts = getAllBlogPosts();
  
  // Extract unique categories
  const categoriesMap = new Map<string, number>();
  
  allPosts.forEach(post => {
    const category = post.category || '';
    categoriesMap.set(category, (categoriesMap.get(category) || 0) + 1);
  });
  
  // Convert to array of category objects
  const categories: BlogCategory[] = Array.from(categoriesMap).map(([name, count]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name: name,
    count: count,
    slug: name.toLowerCase().replace(/\s+/g, '-')
  }));
  
  return categories.sort((a, b) => b.count! - a.count!);
};

export const getBlogTags = (): BlogTag[] => {
  // Get all posts
  const allPosts = getAllBlogPosts();
  
  // Extract unique tags
  const tagsMap = new Map<string, number>();
  
  allPosts.forEach(post => {
    post.tags.forEach(tag => {
      tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1);
    });
  });
  
  // Convert to array of tag objects
  const tags: BlogTag[] = Array.from(tagsMap).map(([name, count]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name: name,
    count: count
  }));
  
  return tags.sort((a, b) => b.count! - a.count!);
};

export const getAllBlogPosts = (): BlogPost[] => {
  // Combine all blog posts
  let allPosts = [
    ...ADDITIONAL_BLOG_POSTS,
    ...investingBlogPosts,
    ...retirementBlogPosts,
    ...budgetingBlogPosts,
    ...realEstateBlogPosts,
    ...lifeEventsPosts,
    ...healthBlogPosts,
    ...BLOG_POSTS,
  ];

  // Set the author for all posts to Christopher R McGuire
  allPosts = allPosts.map(post => ({
    ...post,
    author: "Christopher R McGuire",
    // TypeScript safe way to handle optional authorTitle
    authorTitle: "Senior Vice President of Software Engineering at Mesirow",
    avatar: "/lovable-uploads/61f9246e-544a-4f54-a156-a5374baed0c1.png"
  }));

  // Sort posts by date (newest first)
  allPosts.sort((a, b) => {
    const dateA = a.publishedAt || (a as any).date || '';
    const dateB = b.publishedAt || (b as any).date || '';
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return allPosts;
};

export const getBlogPosts = (
  page: number = 1,
  postsPerPage: number = 10,
  category?: string
): { posts: BlogPost[]; currentPage: number; totalPages: number } => {
  // Get all posts
  let allPosts = getAllBlogPosts();

  // Filter by category if provided
  if (category) {
    allPosts = allPosts.filter(
      (post) => (post.category || '').toLowerCase() === category.toLowerCase() ||
               (post.categories || []).some((cat) => cat.toLowerCase() === category.toLowerCase())
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const adjustedPage = page < 1 ? 1 : page > totalPages ? totalPages : page;
  const startIndex = (adjustedPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = allPosts.slice(startIndex, endIndex);

  return {
    posts: paginatedPosts,
    currentPage: adjustedPage,
    totalPages,
  };
};

export const getBlogPost = (slug: string): BlogPost | undefined => {
  // Get all posts
  const allPosts = getAllBlogPosts();

  // Find the post with the matching slug
  const post = allPosts.find((post) => post.slug === slug);
  
  return post;
};

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return getBlogPost(slug);
};

export const getRelatedPosts = (currentPostId: string, limit: number = 3): BlogPost[] => {
  const allPosts = getAllBlogPosts();
  const currentPost = allPosts.find(post => post.id === currentPostId);
  
  if (!currentPost) return [];
  
  // Find posts with similar categories or tags
  const relatedPosts = allPosts
    .filter(post => post.id !== currentPostId) // Exclude current post
    .map(post => {
      let relevanceScore = 0;
      
      // Check for category match
      if (post.category === currentPost.category) {
        relevanceScore += 5;
      }
      
      // Check for tag matches
      const sharedTags = post.tags.filter(tag => 
        currentPost.tags.includes(tag)
      );
      
      relevanceScore += sharedTags.length * 2;
      
      return { post, relevanceScore };
    })
    .filter(item => item.relevanceScore > 0) // Only include posts with some relevance
    .sort((a, b) => b.relevanceScore - a.relevanceScore) // Sort by relevance
    .slice(0, limit) // Limit to requested number
    .map(item => item.post); // Extract just the posts
  
  return relatedPosts;
};

export const getFeaturedBlogPosts = (limit: number = 6): BlogPost[] => {
  const allPosts = getAllBlogPosts();
  
  // For now, just return the most recent posts
  // In a real app, you'd have a separate flag or algorithm to determine featured posts
  return allPosts
    .filter(post => post.featured)
    .slice(0, limit);
};
