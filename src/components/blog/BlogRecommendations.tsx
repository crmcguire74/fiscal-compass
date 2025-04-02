
import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/types/blog';
import { ArrowRight, CalendarIcon, Clock, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlogRecommendationsProps {
  title?: string;
  posts: BlogPost[];
  limit?: number;
  showCategory?: boolean;
  showTags?: boolean;
  variant?: 'default' | 'compact' | 'grid';
  filter?: 'category' | 'tag' | 'recent' | 'popular' | 'related';
  highlightFirst?: boolean;
}

const BlogRecommendations = ({
  title = "Recommended Articles",
  posts,
  limit = 3,
  showCategory = true,
  showTags = false,
  variant = 'default',
  filter = 'recent',
  highlightFirst = false
}: BlogRecommendationsProps) => {
  // Limit the number of posts shown
  const displayPosts = posts.slice(0, limit);
  
  if (displayPosts.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
      )}
      
      <div className={variant === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "grid grid-cols-1 gap-6"
      }>
        {displayPosts.map((post, index) => (
          <Link 
            key={post.id} 
            to={`/blog/${post.slug}`} 
            className={`block ${highlightFirst && index === 0 ? 'md:col-span-2' : ''}`}
          >
            <Card className="overflow-hidden h-full hover:border-blue-200 transition-colors">
              {variant === 'default' && post.coverImage && (
                <div className="w-full h-40 overflow-hidden">
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
              )}
              
              <CardHeader className="pb-2">
                {showCategory && (
                  <div className="mb-1">
                    <Badge variant="outline" className="capitalize">
                      {post.category}
                    </Badge>
                  </div>
                )}
                
                <CardTitle className={variant === 'compact' ? 'text-base' : 'text-lg'}>
                  {post.title}
                </CardTitle>
                
                {variant === 'default' && (
                  <CardDescription className="line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                )}

                {showTags && post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>
              
              <CardFooter className="text-sm text-muted-foreground flex justify-between items-center pt-0">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {post.readingTime} min read
                  </div>
                </div>
                
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogRecommendations;
