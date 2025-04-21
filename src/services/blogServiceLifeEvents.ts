import { BlogPost } from "@/types/blog";

// Blog posts related to life events like marriage, parenting, etc.
export const lifeEventsPosts: BlogPost[] = [
  {
    id: "wedding-budget-planning",
    title: "How to Create a Wedding Budget That Works for You",
    slug: "wedding-budget-planning",
    excerpt: "Learn how to create a realistic wedding budget that aligns with your priorities and helps you avoid financial stress.",
    content: `[... content unchanged ...]`,
    date: "2023-11-18",
    author: "Emily Chen",
    authorTitle: "Financial Wedding Planner",
    category: "Life Events",
    image: "https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    categories: ["life-events", "wedding", "budgeting"],
    tags: ["wedding planning", "budget", "financial planning", "saving money"],
    relatedPosts: ["honeymoon-budgeting", "marriage-financial-planning", "wedding-saving-tips"],
    featured: true,
    readingTime: 8
  },
  {
    id: "first-year-baby-costs",
    title: "The Real Cost of a Baby's First Year (And How to Prepare)",
    slug: "first-year-baby-costs",
    excerpt: "A comprehensive breakdown of the expenses you can expect during your baby's first year and strategies to manage these costs.",
    content: `[... content unchanged ...]`,
    date: "2023-09-05",
    author: "Marcus Johnson",
    authorTitle: "Family Financial Advisor",
    category: "Life Events",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    categories: ["life-events", "parenting", "budgeting"],
    tags: ["baby planning", "parenting costs", "financial planning", "family budget"],
    relatedPosts: ["college-saving-strategies", "family-insurance-needs", "parenting-financial-tips"],
    featured: true,
    readingTime: 10
  },
  {
    id: "preparing-finances-for-retirement",
    title: "The 5-Year Countdown: Preparing Your Finances for Retirement",
    slug: "preparing-finances-for-retirement",
    excerpt: "Essential financial steps to take in the five years before retirement to ensure you're fully prepared for this major life transition.",
    content: `[... content unchanged ...]`,
    date: "2023-12-10",
    author: "Victoria Reynolds",
    authorTitle: "Retirement Planning Specialist",
    category: "Life Events",
    image: "https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
    categories: ["life-events", "retirement", "financial-planning"],
    tags: ["retirement planning", "pre-retirement", "retirement income", "retirement budget"],
    relatedPosts: ["social-security-optimization", "retirement-withdrawal-strategies", "healthcare-in-retirement"],
    featured: false,
    readingTime: 12
  }
];

// Export functions to get life events blog posts
export const getAllLifeEventsPosts = () => {
  return lifeEventsPosts;
};

// Export function to get a specific life events blog post by slug
export const getLifeEventsPostBySlug = (slug: string) => {
  return lifeEventsPosts.find(post => post.slug === slug);
};

// Export function to get featured life events blog posts
export const getFeaturedLifeEventsPosts = () => {
  return lifeEventsPosts.filter(post => post.featured);
};
