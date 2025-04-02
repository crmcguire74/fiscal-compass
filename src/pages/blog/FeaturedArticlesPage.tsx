import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { getFeaturedBlogPosts } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import { ChevronRight, Bookmark, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FeaturedArticlesPage = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get featured posts
    const posts = getFeaturedBlogPosts();
    setFeaturedPosts(posts);
    setLoading(false);
  }, []);
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center text-sm mb-5 text-muted-foreground">
            <Link to="/calculators" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link to="/blog" className="hover:text-primary">Blog</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>Featured</span>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Featured Articles
            </h1>
            <p className="text-lg text-muted-foreground">
              Our selection of must-read financial insights and guides
            </p>
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
              {featuredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {featuredPosts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No featured articles found</h3>
                  <p className="text-muted-foreground mb-6">
                    Check back soon for our editorial team's top picks.
                  </p>
                </div>
              )}
            </>
          )}
          
          <div className="flex justify-center mt-8">
            <Button variant="outline" asChild className="mr-4">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Articles
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 bg-white p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Bookmark className="mr-2 h-5 w-5 text-finance-primary" />
              What Makes an Article Featured?
            </h2>
            <p className="text-muted-foreground mb-4">
              Our editorial team carefully selects featured articles based on several criteria:
            </p>
            <ul className="space-y-2 ml-6 list-disc text-muted-foreground">
              <li>Exceptional quality and depth of financial insights</li>
              <li>Relevance to current economic trends and conditions</li>
              <li>Practical advice that readers can apply to their financial decisions</li>
              <li>Articles that address frequently asked questions from our community</li>
              <li>Content that has received positive feedback from our readers</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FeaturedArticlesPage;
