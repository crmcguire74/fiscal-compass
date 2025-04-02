import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { getBlogPostBySlug, getRelatedPosts } from '@/services/blogService';
import { BlogPost } from '@/types/blog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, ArrowLeft, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import BlogRecommendations from '@/components/blog/BlogRecommendations';
import { toast } from '@/hooks/use-toast';

const renderMarkdown = (markdown: string) => {
  const html = markdown
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold my-3">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium my-2">$1</h3>')
    .replace(/^\* (.*$)/gm, '<li class="ml-6 list-disc">$1</li>')
    .replace(/^- (.*$)/gm, '<li class="ml-6 list-disc">$1</li>')
    .replace(/^([0-9]+)\. (.*$)/gm, '<li class="ml-6 list-decimal">$2</li>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^\s*$(?:\r\n?|\n)/gm, '</p><p class="my-3">')
    .replace(/<\/p><p>/g, '</p>\n<p>');
  
  return `<p class="my-3">${html}</p>`;
};

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (slug) {
      const postData = getBlogPostBySlug(slug);
      
      if (postData) {
        setPost(postData);
        
        const related = getRelatedPosts(postData.id, 3);
        setRelatedPosts(related);
      } else {
        toast({
          title: "Post not found",
          description: "The article you're looking for doesn't exist or has been moved.",
          variant: "destructive"
        });
        navigate('/blog');
      }
    }
    
    setIsLoading(false);
  }, [slug, navigate]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!post) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-6">
          <Link to="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Blog
          </Link>
        </div>
        
        <article className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Link to={`/blog/related/category/${post.category}`}>
                <Badge className="capitalize hover:bg-primary/80" variant="outline">
                  {post.category}
                </Badge>
              </Link>
              {post.tags.slice(0, 5).map((tag, index) => (
                <Link key={index} to={`/blog/related/tag/${tag}`}>
                  <Badge key={index} variant="secondary" className="hover:bg-secondary/80">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formattedDate}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {post.readingTime} min read
              </div>
              <div>
                By {post.author}
              </div>
            </div>
          </div>
          
          <div 
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />
          
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <BlogRecommendations
                title="Related Articles"
                posts={relatedPosts}
                variant="compact"
                showTags={true}
              />
            </div>
          )}
          
          <div className="mt-10 pt-8 border-t grid grid-cols-2 gap-4">
            <Button variant="outline" asChild>
              <Link to="/blog" className="inline-flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to All Articles
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="justify-self-end">
              <Link to={`/blog/related/category/${post.category}`} className="inline-flex items-center">
                More in {post.category}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 pt-4 border-t">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              Browse by Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Link key={index} to={`/blog/related/tag/${tag}`}>
                  <Badge variant="outline" className="hover:bg-secondary/20">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default BlogPostPage;
