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
    // Headers
    .replace(/^# (.*$)/gm, '<h1 class="text-4xl lg:text-5xl font-bold mt-12 mb-6 tracking-tight">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-3xl lg:text-4xl font-semibold mt-10 mb-4 tracking-tight">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-2xl lg:text-3xl font-medium mt-8 mb-4">$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4 class="text-xl lg:text-2xl font-medium mt-6 mb-3">$1</h4>')
    
    // Lists
    .replace(/^(\s*)\* (.*$)/gm, (_, spaces, content) => 
      `${spaces}<li class="ml-6 list-disc mb-3 text-base text-muted-foreground leading-relaxed pl-2">${content}</li>`)
    .replace(/^(\s*)- (.*$)/gm, (_, spaces, content) => 
      `${spaces}<li class="ml-6 list-disc mb-3 text-base text-muted-foreground leading-relaxed pl-2">${content}</li>`)
    .replace(/^(\s*)([0-9]+)\. (.*$)/gm, (_, spaces, num, content) => 
      `${spaces}<li class="ml-6 list-decimal mb-3 text-base text-muted-foreground leading-relaxed pl-2">${content}</li>`)
    
    // Emphasis
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)\n```/gm, (_, lang, code) => 
      `<pre class="my-6 p-4 bg-secondary/10 rounded-lg overflow-x-auto relative group">
        ${lang ? `<div class="absolute top-2 right-2 text-xs text-muted-foreground opacity-50">${lang}</div>` : ''}
        <code class="text-sm font-mono">${code.trim()}</code>
      </pre>`)
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 text-sm bg-secondary/10 rounded font-mono text-primary">$1</code>')
    
    // Blockquotes
    .replace(/^> (.*$)/gm, 
      '<blockquote class="pl-6 py-2 my-6 border-l-[3px] border-primary/30 bg-secondary/5 rounded-r-lg text-muted-foreground/90 not-italic">$1</blockquote>')
    
    // Tables
    .replace(/\|.*\|/g, (match) => {
      if (match.includes('---')) {
        return '</thead><tbody>';
      }
      const cells = match.split('|').slice(1, -1);
      const isHeader = cells.some(cell => cell.includes('---'));
      if (!isHeader) {
        const row = cells.map(cell => 
          `<td class="border border-secondary/20 px-4 py-3 text-muted-foreground">${cell.trim()}</td>`
        ).join('');
        return `<tr class="even:bg-secondary/5">${row}</tr>`;
      }
      return '';
    })
    .replace(/^<tr>/gm, 
      '<table class="w-full my-6 border-collapse rounded-lg overflow-hidden border border-secondary/20 shadow-sm"><thead class="bg-secondary/10"><tr>')
    .replace(/<\/tr>$/gm, '</tr></tbody></table>')
    
    // Images
    .replace(/!\[(.*?)\]\((.*?)\)/g, 
      '<figure class="my-8"><img src="$2" alt="$1" class="rounded-lg w-full shadow-md hover:shadow-lg transition-shadow" /><figcaption class="mt-3 text-center text-sm text-muted-foreground/70">$1</figcaption></figure>')
    
    // Paragraphs
    .replace(/^\s*$(?:\r\n?|\n)/gm, '</p><p class="my-4 text-base leading-relaxed">')
    .replace(/<\/p><p>/g, '</p>\n<p>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
      '<a href="$2" class="text-primary hover:text-primary/80 transition-colors no-underline hover:underline underline-offset-4 decoration-primary/30">$1</a>');
  
  return `<p class="my-4 text-base leading-relaxed">${html}</p>`;
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
            <div className="animate-pulse space-y-8">
              <div className="space-y-3">
                <div className="h-5 bg-secondary/20 rounded-lg w-24"></div>
                <div className="h-12 bg-secondary/20 rounded-lg w-3/4"></div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-4 bg-secondary/20 rounded w-24"></div>
                  <div className="h-4 bg-secondary/20 rounded w-32"></div>
                  <div className="h-4 bg-secondary/20 rounded w-28"></div>
                </div>
              </div>
              <div className="aspect-video bg-secondary/20 rounded-xl w-full"></div>
              <div className="space-y-4">
                <div className="h-4 bg-secondary/20 rounded w-full"></div>
                <div className="h-4 bg-secondary/20 rounded w-5/6"></div>
                <div className="h-4 bg-secondary/20 rounded w-4/5"></div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-secondary/20 rounded-lg w-48"></div>
                <div className="h-4 bg-secondary/20 rounded w-full"></div>
                <div className="h-4 bg-secondary/20 rounded w-3/4"></div>
              </div>
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
      <div className="container max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Blog
          </Link>
        </div>
        
        <article className="max-w-3xl mx-auto">
          <div className="space-y-6 md:space-y-8 mb-10">
            <div>
              <Link to={`/blog/related/category/${post.category}`}>
                <Badge 
                  className="capitalize bg-primary/5 hover:bg-primary/10 text-primary hover:text-primary/80" 
                  variant="outline"
                >
                  {post.category}
                </Badge>
              </Link>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </div>
              <span className="text-muted-foreground/40">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readingTime} min read
              </div>
              <span className="text-muted-foreground/40">•</span>
              <div className="flex items-center gap-1.5">
                By {post.author}
                {post.authorTitle && (
                  <span className="text-xs text-muted-foreground/60">
                    {post.authorTitle}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 5).map((tag, index) => (
                <Link key={index} to={`/blog/related/tag/${tag}`}>
                  <Badge 
                    variant="secondary" 
                    className="bg-secondary/20 hover:bg-secondary/30 transition-colors"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
          
          {post.coverImage && (
            <div className="my-8 overflow-hidden rounded-xl">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full object-cover" 
              />
            </div>
          )}
          
          <div 
            className="
              prose prose-gray 
              prose-headings:text-foreground prose-headings:font-semibold prose-headings:tracking-tight
              prose-p:text-muted-foreground prose-p:leading-7
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:transition-colors
              prose-blockquote:border-l-primary/20 prose-blockquote:text-muted-foreground prose-blockquote:not-italic
              prose-strong:text-foreground prose-strong:font-semibold
              prose-code:text-foreground prose-code:bg-secondary/20 prose-code:rounded prose-code:px-1 prose-code:py-0.5
              prose-pre:bg-secondary/10 prose-pre:shadow-sm
              prose-img:rounded-xl prose-img:shadow-md
              prose-li:text-muted-foreground prose-li:leading-7
              prose-table:shadow-sm
              prose-th:bg-secondary/10 prose-th:text-foreground prose-th:p-3
              prose-td:p-3
              max-w-none
              [&>*:first-child]:mt-0
              [&_pre>code]:!bg-transparent [&_pre>code]:!p-0
              [&_pre]:!px-4 [&_pre]:!py-3
              [&_table]:!my-8 [&_thead]:!border-b-2 [&_thead]:!border-secondary/20
              [&_tr]:!border-b [&_tr]:!border-secondary/10
              [&_blockquote]:!border-l-2 [&_blockquote]:!pl-6 [&_blockquote]:!py-1 [&_blockquote]:border-primary/30
              [&_figure]:!my-8 [&_figcaption]:!text-center [&_figcaption]:!text-sm [&_figcaption]:!text-muted-foreground/80
            "
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
