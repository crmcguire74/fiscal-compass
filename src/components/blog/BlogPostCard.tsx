
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, User } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { cn } from '@/lib/utils';

interface BlogPostCardProps {
  post: BlogPost;
  variant?: 'default' | 'compact';
}

const BlogPostCard = ({ post, variant = 'default' }: BlogPostCardProps) => {
  const { title, slug, excerpt, publishedAt, category, tags, readingTime, author } = post;
  const formattedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const imageUrl = post.coverImage || post.image || '/placeholder.svg';

  if (variant === 'compact') {
    return (
      <Card className="group h-full overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-md">
        <Link to={`/blog/${slug}`} className="block h-full">
          <div className="aspect-video overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <CardHeader className="p-4">
            <h3 className="text-base font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
          </CardHeader>
          <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {readingTime} min read
            </div>
            <Badge variant="outline" className="text-xs capitalize">{category}</Badge>
          </CardFooter>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="group h-full hover:border-primary/50 transition-all duration-300 hover:shadow-md overflow-hidden">
      <Link to={`/blog/${slug}`} className="block h-full">
        <div className="aspect-video overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardHeader className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="capitalize bg-primary/5 hover:bg-primary/10">
              {category}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {formattedDate}
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {excerpt}
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-0">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-secondary/30 hover:bg-secondary/40"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge 
                variant="secondary" 
                className="text-xs bg-secondary/30 hover:bg-secondary/40"
              >
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-6 flex justify-between items-center border-t mt-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{author}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {readingTime} min read
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default BlogPostCard;
