import { BlogPost } from '@/types/blog';
import { format } from 'date-fns';

export const ADDITIONAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'roi-calculation',
    slug: 'how-to-calculate-roi-for-business-investment',
    title: 'How to Calculate ROI for Your Business Investment',
    excerpt: 'Understanding return on investment (ROI) is crucial for making informed business decisions. Learn how to calculate and interpret ROI for various business investments.',
    content: `[... content unchanged ...]`,
    author: 'Michael Chen',
    authorTitle: 'Business Finance Analyst',
    publishedAt: format(new Date(2023, 6, 12), 'MMMM d, yyyy'),
    category: 'business',
    tags: ['ROI', 'business', 'finance', 'investment'],
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    readingTime: 8,
    featured: true,
    metaTitle: 'How to Calculate ROI: A Complete Business Investment Guide',
    metaDescription: 'Learn how to calculate ROI for business investments, understand ROI interpretation, and make data-driven decisions. Includes formulas, examples, and best practices.'
  },
  {
    id: 'protein-nutrition',
    slug: 'protein-requirements-fitness-goals',
    title: 'Protein Requirements for Different Fitness Goals',
    excerpt: 'Confused about how much protein you need? This guide breaks down protein requirements based on your specific fitness objectives, from weight loss to muscle building.',
    content: `[... content unchanged ...]`,
    author: 'Dr. Sarah Johnson',
    authorTitle: 'Sports Nutritionist',
    publishedAt: format(new Date(2023, 5, 28), 'MMMM d, yyyy'),
    category: 'health',
    tags: ['nutrition', 'protein', 'fitness', 'muscle building', 'weight loss'],
    coverImage: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    readingTime: 10,
    featured: true,
    metaTitle: 'Protein Requirements Guide: Optimize Your Fitness Goals',
    metaDescription: 'Discover the optimal protein requirements for different fitness goals. Learn about protein timing, sources, and how much you need for muscle building, weight loss, and endurance training.'
  },
  {
    id: 'macro-nutrition',
    slug: 'understanding-macronutrients-complete-guide',
    title: 'Understanding Macronutrients: A Complete Guide',
    excerpt: 'Learn how to balance proteins, carbohydrates, and fats to optimize your nutrition for health and fitness goals.',
    content: `[... content unchanged ...]`,
    author: 'Dr. Emma Rodriguez',
    authorTitle: 'Clinical Nutritionist',
    publishedAt: format(new Date(2023, 4, 15), 'MMMM d, yyyy'),
    category: 'health',
    tags: ['nutrition', 'macronutrients', 'diet', 'healthy eating'],
    coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    readingTime: 12,
    featured: false,
    metaTitle: 'Macronutrients Guide: Understanding Proteins, Carbs, and Fats',
    metaDescription: 'Complete guide to understanding macronutrients. Learn about proteins, carbohydrates, and fats, their functions, sources, and how to balance them for optimal health and fitness.'
  }
];
