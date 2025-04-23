import { ADDITIONAL_BLOG_POSTS } from "./blogServiceExtension";
import { investingBlogPosts } from "./blogServiceInvesting";
import { retirementBlogPosts } from "./blogServiceRetirement";
import { budgetingBlogPosts } from "./blogServiceBudgeting";
import { realEstateBlogPosts } from "./blogServiceRealEstate";
import { lifeEventsPosts } from "./blogServiceLifeEvents";
import { healthBlogPosts } from "./blogServiceHealth";
import { BLOG_POSTS } from "./blogServiceAddition";

import { BlogPost, BlogCategory, BlogTag } from "../types/blog";

// Define default images for each category
const DEFAULT_IMAGES = {
  Budgeting:
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
  Investing:
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
  "Real Estate":
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
  Retirement:
    "https://images.unsplash.com/photo-1514395462725-fb4566210144?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
  "Life Events":
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
  Credit:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
  Health:
    "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
  "Financial Planning":
    "https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
  default:
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
} as const;

export const getDefaultImage = (category?: string): string => {
  if (!category) return DEFAULT_IMAGES.default;
  return (
    DEFAULT_IMAGES[category as keyof typeof DEFAULT_IMAGES] ||
    DEFAULT_IMAGES.default
  );
};

export const getBlogCategories = (): BlogCategory[] => {
  // Get all posts
  const allPosts = getAllBlogPosts();

  // Extract unique categories
  const categoriesMap = new Map<string, number>();

  allPosts.forEach((post) => {
    const category = post.category || "";
    categoriesMap.set(category, (categoriesMap.get(category) || 0) + 1);
  });

  // Convert to array of category objects
  const categories: BlogCategory[] = Array.from(categoriesMap).map(
    ([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name: name,
      count: count,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
    })
  );

  return categories.sort((a, b) => b.count! - a.count!);
};

export const getBlogTags = (): BlogTag[] => {
  // Get all posts
  const allPosts = getAllBlogPosts();

  // Extract unique tags
  const tagsMap = new Map<string, number>();

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagsMap.set(tag, (tagsMap.get(tag) || 0) + 1);
    });
  });

  // Convert to array of tag objects
  const tags: BlogTag[] = Array.from(tagsMap).map(([name, count]) => ({
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name: name,
    count: count,
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

  // Set the author and ensure each post has a valid image
  allPosts = allPosts.map((post) => {
    // Normalize category case to match DEFAULT_IMAGES keys
    const normalizedCategory = post.category
      ? post.category.charAt(0).toUpperCase() + post.category.slice(1)
      : "";
    const defaultImage = getDefaultImage(normalizedCategory);

    const postWithDefaults: BlogPost = {
      ...post,
      category: normalizedCategory || "General", // Ensure category is always set
      readingTime: post.readingTime || Math.ceil(post.content.length / 1500), // Estimate reading time if not provided
      author: "Christopher R McGuire",
      authorTitle: "Senior Vice President of Software Engineering at Mesirow",
      authorUrl: "https://www.paguire.com",
      avatar: "/lovable-uploads/61f9246e-544a-4f54-a156-a5374baed0c1.png",
      coverImage:
        (post as any).coverImage || (post as any).image || defaultImage,
      image: (post as any).coverImage || (post as any).image || defaultImage,
      publishedAt: post.publishedAt || (post as any).date || new Date().toISOString(), // Use existing date or current date as fallback
    };
    return postWithDefaults;
  });

  // Sort posts by date (newest first)
  allPosts.sort((a, b) => {
    const dateA = a.publishedAt || (a as any).date || "";
    const dateB = b.publishedAt || (b as any).date || "";
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
      (post) =>
        (post.category || "").toLowerCase() === category.toLowerCase() ||
        (post.categories || []).some(
          (cat) => cat.toLowerCase() === category.toLowerCase()
        )
    );
  }

  // Always ensure there's at least one page
  const totalPages = Math.max(1, Math.ceil(allPosts.length / postsPerPage));

  // Adjust the page number to be within valid bounds
  const adjustedPage = Math.min(Math.max(1, page), totalPages);

  // Calculate the slice indices
  const startIndex = (adjustedPage - 1) * postsPerPage;
  const endIndex = Math.min(startIndex + postsPerPage, allPosts.length);

  // Get the posts for the current page
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

export const getRelatedPosts = (
  currentPostId: string,
  limit: number = 3
): BlogPost[] => {
  const allPosts = getAllBlogPosts();
  const currentPost = allPosts.find((post) => post.id === currentPostId);

  if (!currentPost) return [];

  // Find posts with similar categories or tags
  const relatedPosts = allPosts
    .filter((post) => post.id !== currentPostId) // Exclude current post
    .map((post) => {
      let relevanceScore = 0;

      // Check for category match
      if (post.category === currentPost.category) {
        relevanceScore += 5;
      }

      // Check for tag matches
      const sharedTags = post.tags.filter((tag) =>
        currentPost.tags.includes(tag)
      );

      relevanceScore += sharedTags.length * 2;

      return { post, relevanceScore };
    })
    .filter((item) => item.relevanceScore > 0) // Only include posts with some relevance
    .sort((a, b) => b.relevanceScore - a.relevanceScore) // Sort by relevance
    .slice(0, limit) // Limit to requested number
    .map((item) => item.post); // Extract just the posts

  return relatedPosts;
};

export const getFeaturedBlogPosts = (limit: number = 6): BlogPost[] => {
  const allPosts = getAllBlogPosts();

  // For now, just return the most recent posts
  // In a real app, you'd have a separate flag or algorithm to determine featured posts
  return allPosts.filter((post) => post.featured).slice(0, limit);
};

export const searchBlogPosts = (searchTerm: string): BlogPost[] => {
  if (!searchTerm.trim()) return [];

  const allPosts = getAllBlogPosts();
  const searchTermLower = searchTerm.toLowerCase().trim();

  const filteredPosts = allPosts.filter((post) => {
    // Search in title
    if (post.title.toLowerCase().includes(searchTermLower)) {
      return true;
    }

    // Search in category
    if (post.category.toLowerCase().includes(searchTermLower)) {
      return true;
    }

    // Search in categories array if it exists
    if (
      post.categories?.some((category) =>
        category.toLowerCase().includes(searchTermLower)
      )
    ) {
      return true;
    }

    // Search in tags
    if (post.tags.some((tag) => tag.toLowerCase().includes(searchTermLower))) {
      return true;
    }

    return false;
  });

  // Sort by date (newest first)
  return filteredPosts.sort((a, b) => {
    const dateA = a.publishedAt || (a as any).date || '';
    const dateB = b.publishedAt || (b as any).date || '';
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
};
