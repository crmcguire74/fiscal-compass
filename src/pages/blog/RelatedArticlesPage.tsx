import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogRecommendations from '@/components/blog/BlogRecommendations';
import { getBlogPosts, getBlogCategories } from '@/services/blogService';
import { BlogPost, BlogCategory } from '@/types/blog';
import { ChevronRight, Tag, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RelatedArticlesPage = () => {
  const { type, value } = useParams<{ type: string; value: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('Related Articles');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get categories
    const blogCategories = getBlogCategories();
    setCategories(blogCategories);
    
    // Get posts based on type and value
    let result;
    if (type === 'category' && value) {
      result = getBlogPosts(1, 9, value);
      setTitle(`Articles in ${value.charAt(0).toUpperCase() + value.slice(1)}`);
    } else if (type === 'tag' && value) {
      // For tags, we need to filter after getting all posts
      // This is a simple implementation - in a real app, the API would handle this
      result = getBlogPosts(1, 100); // Get more posts then filter
      const filtered = result.posts.filter(post => 
        post.tags.some(tag => tag.toLowerCase() === value.toLowerCase())
      );
      setPosts(filtered);
      setTitle(`Articles tagged with "${value}"`);
    } else {
      // Default to recent posts if no valid type/value
      result = getBlogPosts(1, 9);
      setTitle('Recent Articles');
    }
    
    if (result && type !== 'tag') {
      setPosts(result.posts);
    }
    
    setLoading(false);
  }, [type, value]);
  
  // Get a different category for recommendations
  const getRecommendedCategory = () => {
    if (type === 'category' && value) {
      const otherCategories = categories.filter(cat => cat.slug !== value);
      if (otherCategories.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherCategories.length);
        return otherCategories[randomIndex].slug;
      }
    }
    return 'investing'; // Default to investing if no other category
  };
  
  const recommendedCategory = getRecommendedCategory();
  
  // Get the first 3 posts from the recommended category
  const recommendedPosts = getBlogPosts(1, 3, recommendedCategory).posts;
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center text-sm mb-5 text-muted-foreground">
            <Link to="/calculators" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link to="/blog" className="hover:text-primary">Blog</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>{title}</span>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              {title}
            </h1>
            {type === 'category' && value && (
              <p className="text-lg text-muted-foreground">
                Explore our collection of articles about {value.toLowerCase()}
              </p>
            )}
            {type === 'tag' && value && (
              <p className="text-lg text-muted-foreground">
                All articles related to {value.toLowerCase()}
              </p>
            )}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <CardHeader className="pb-2">
                    <div className="w-3/4 h-6 bg-gray-200 animate-pulse mb-2"></div>
                    <div className="w-1/2 h-4 bg-gray-200 animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-4 bg-gray-200 animate-pulse mb-2"></div>
                    <div className="w-full h-4 bg-gray-200 animate-pulse mb-2"></div>
                    <div className="w-3/4 h-4 bg-gray-200 animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {posts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No articles found</h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any articles matching your criteria.
                  </p>
                </div>
              )}
            </>
          )}
          
          {posts.length > 0 && recommendedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <BlogRecommendations 
                title={`Explore Articles in ${recommendedCategory.charAt(0).toUpperCase() + recommendedCategory.slice(1)}`}
                posts={recommendedPosts}
                variant="compact"
                showCategory={false}
                showTags={true}
              />
            </div>
          )}
          
          <div className="flex justify-center mt-8">
            <Button variant="outline" asChild className="mr-4">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Articles
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RelatedArticlesPage;
