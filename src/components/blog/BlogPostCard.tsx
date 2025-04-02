
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Tag } from 'lucide-react';
import { BlogPost } from '@/types/blog';

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

  if (variant === 'compact') {
    return (
      <Card className="h-full hover:border-primary/50 transition-colors">
        <Link to={`/blog/${slug}`} className="block h-full">
          <CardHeader className="p-4">
            <h3 className="text-base font-medium line-clamp-2">{title}</h3>
          </CardHeader>
          <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {readingTime} min read
            </div>
            <Badge variant="outline" className="text-xs">{category}</Badge>
          </CardFooter>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:border-primary/50 transition-colors">
      <Link to={`/blog/${slug}`} className="block h-full">
        <CardHeader className="p-6">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="capitalize">{category}</Badge>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 line-clamp-2">{title}</h3>
          <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
        </CardHeader>
        <CardContent className="px-6 pb-0">
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-6 flex justify-between items-center">
          <span className="text-sm">{author}</span>
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
