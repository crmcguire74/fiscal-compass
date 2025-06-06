import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import BlogPostCard from "@/components/blog/BlogPostCard";
import {
  getBlogPosts,
  getBlogCategories,
  getBlogTags,
  searchBlogPosts,
} from "@/services/blogService";
import { BlogPost, BlogCategory, BlogTag } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  BookOpen,
  Tag,
  TrendingUp,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BlogIndex = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("categories");
  const [isLoading, setIsLoading] = useState(true);
  const postsPerPage = 9;

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const blogCategories = getBlogCategories();
    const blogTags = getBlogTags();
    setCategories(blogCategories);
    setTags(blogTags.slice(0, 15));

    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get("category");
    const tagParam = searchParams.get("tag");
    const pageParam = searchParams.get("page");
    const searchParam = searchParams.get("search");

    if (categoryParam) {
      setActiveCategory(categoryParam);
      setActiveTab("categories");
    }

    if (tagParam) {
      setActiveTag(tagParam);
      setActiveTab("tags");
    }

    if (searchParam) setSearchTerm(searchParam);
    if (pageParam) setCurrentPage(parseInt(pageParam) || 1);

    setIsLoading(true);
    loadPosts(
      pageParam ? parseInt(pageParam) : 1,
      categoryParam,
      tagParam,
      searchParam
    );
  }, [location.search]);

  const loadPosts = (
    page: number = 1,
    category?: string | null,
    tag?: string | null,
    search?: string | null
  ) => {
    let filteredPosts: BlogPost[] = [];

    if (search && search.trim()) {
      // Get all search results
      const searchResults = searchBlogPosts(search);

      // Apply additional filters
      filteredPosts = searchResults;
      if (category) {
        filteredPosts = filteredPosts.filter(
          (post) => post.category.toLowerCase() === category.toLowerCase()
        );
      }
      if (tag) {
        filteredPosts = filteredPosts.filter((post) =>
          post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
        );
      }

      // Calculate pagination after all filters are applied
      const totalFilteredPages = Math.max(
        1,
        Math.ceil(filteredPosts.length / postsPerPage)
      );
      const adjustedPage = Math.min(Math.max(1, page), totalFilteredPages);
      const startIndex = (adjustedPage - 1) * postsPerPage;
      const endIndex = Math.min(
        startIndex + postsPerPage,
        filteredPosts.length
      );
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

      setPosts(paginatedPosts);
      setTotalPages(totalFilteredPages);
      setCurrentPage(adjustedPage);
    } else {
      // Use the regular getBlogPosts with built-in pagination
      const result = getBlogPosts(page, postsPerPage, category || undefined);
      filteredPosts = result.posts;

      // Apply tag filter if needed
      if (tag) {
        // Filter by tag
        filteredPosts = filteredPosts.filter((post) =>
          post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
        );

        // Ensure posts are sorted by date (newest first)
        filteredPosts.sort((a, b) => {
          const dateA = a.publishedAt || (a as any).date || "";
          const dateB = b.publishedAt || (b as any).date || "";
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });

        // Recalculate pagination if tag filter was applied
        const totalFilteredPages = Math.max(
          1,
          Math.ceil(filteredPosts.length / postsPerPage)
        );
        const adjustedPage = Math.min(Math.max(1, page), totalFilteredPages);
        const startIndex = (adjustedPage - 1) * postsPerPage;
        const endIndex = Math.min(
          startIndex + postsPerPage,
          filteredPosts.length
        );
        filteredPosts = filteredPosts.slice(startIndex, endIndex);

        setPosts(filteredPosts);
        setTotalPages(totalFilteredPages);
        setCurrentPage(adjustedPage);
      } else {
        // Use pagination from getBlogPosts result
        setPosts(result.posts);
        setTotalPages(result.totalPages);
        setCurrentPage(result.currentPage);
      }
    }
    setIsLoading(false);
  };

  const handleCategoryClick = (categorySlug: string | null) => {
    setActiveCategory(categorySlug);
    setActiveTag(null);
    updateUrlParams(1, categorySlug, null, searchTerm);
  };

  const handleTagClick = (tag: string | null) => {
    setActiveTag(tag);
    setActiveCategory(null);
    updateUrlParams(1, null, tag, searchTerm);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams(1, activeCategory, activeTag, searchTerm);
  };

  const handlePageChange = (page: number) => {
    updateUrlParams(page, activeCategory, activeTag, searchTerm);
  };

  const handleClearFilters = () => {
    setActiveCategory(null);
    setActiveTag(null);
    setSearchTerm("");
    navigate("/blog");
  };

  const updateUrlParams = (
    page: number,
    category: string | null,
    tag: string | null,
    search: string
  ) => {
    const params = new URLSearchParams();

    if (page > 1) params.set("page", page.toString());
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);
    if (search.trim() !== "") params.set("search", search);

    navigate(`/blog?${params.toString()}`);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "categories") {
      setActiveTag(null);
      updateUrlParams(1, activeCategory, null, searchTerm);
    } else if (value === "tags") {
      setActiveCategory(null);
      updateUrlParams(1, null, activeTag, searchTerm);
    }
  };

  return (
    <Layout>
      {/* Header with dark blue background */}
      <div className="bg-gradient-to-r from-finance-primary to-finance-primary/90 text-white py-12">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex items-center text-sm mb-3 text-white/80">
            <Link to="/calculators" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>Blog</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Financial Insights Blog
          </h1>

          <p className="text-center text-white/90 mb-6 max-w-2xl mx-auto">
            Discover actionable advice on investing, retirement planning,
            budgeting, and more to help you make informed financial decisions.
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          {/* Search and Quick Links section */}
          <Card className="p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <form onSubmit={handleSearch} className="flex w-full max-w-lg">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-r-none"
                />
                <Button type="submit" className="rounded-l-none">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Quick Links
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/blog/featured"
                        className="flex items-center w-full"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Featured Articles
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/blog/related/category/investing"
                        className="flex items-center w-full"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Investing Guides
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/blog/related/category/retirement"
                        className="flex items-center w-full"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Retirement Planning
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/blog/related/category/health"
                        className="flex items-center w-full"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Health & Wellness
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>

          {/* Filters section */}
          <Card className="mb-8 overflow-hidden">
            <div className="border-b bg-muted/30 px-4 py-3">
              <h3 className="text-md font-medium flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter Articles
              </h3>
            </div>

            <div className="p-4 bg-blue-50">
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-64 mx-auto mb-6">
                  <TabsTrigger value="categories" className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Categories
                  </TabsTrigger>
                  <TabsTrigger value="tags" className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Tags
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="mt-0">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                      size="sm"
                      onClick={() => handleCategoryClick(null)}
                      className={
                        activeCategory === null
                          ? "bg-blue-700 text-white hover:bg-blue-800" // Active style
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200" // Inactive style
                      }
                    >
                      All Topics
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        size="sm"
                        onClick={() => handleCategoryClick(category.slug)}
                        className={
                          activeCategory === category.slug
                            ? "bg-blue-700 text-white hover:bg-blue-800" // Active style
                            : "bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200" // Inactive style
                        }
                      >
                        {category.name} ({category.count})
                      </Button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="tags" className="mt-0">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button
                      size="sm"
                      onClick={() => handleTagClick(null)}
                      className={
                        activeTag === null
                          ? "bg-blue-700 text-white hover:bg-blue-800" // Active style
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200" // Inactive style
                      }
                    >
                      All Tags
                    </Button>
                    {tags.map((tag) => (
                      <Button
                        key={tag.id}
                        size="sm"
                        onClick={() => handleTagClick(tag.id)}
                        className={
                          activeTag === tag.id
                            ? "bg-blue-700 text-white hover:bg-blue-800" // Active style
                            : "bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200" // Inactive style
                        }
                      >
                        {tag.name} ({tag.count})
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {(activeCategory || activeTag || searchTerm) && (
                <div className="flex justify-center mt-6 pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2 text-center">
                    {activeCategory && (
                      <span>
                        Category:{" "}
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-border text-foreground">
                          {activeCategory.replace("category/", "")}
                        </span>{" "}
                      </span>
                    )}
                    {activeTag && (
                      <span>
                        Tag:{" "}
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-border text-foreground">
                          {activeTag}
                        </span>{" "}
                      </span>
                    )}
                    {searchTerm && (
                      <span>
                        Search:{" "}
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-border text-foreground">
                          {searchTerm}
                        </span>
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="ml-3"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4">
                Try changing your search term or filter selection.
              </p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={handleClearFilters}
              >
                Clear filters
              </Button>
            </div>
          )}

          {totalPages > 1 && posts.length > 0 && (
            <div className="flex justify-center space-x-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>

              {[...Array(totalPages)].map((_, i) => {
                if (
                  i === 0 ||
                  i === totalPages - 1 ||
                  (i >= currentPage - 2 && i <= currentPage + 2)
                ) {
                  return (
                    <Button
                      key={i}
                      variant={i + 1 === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  );
                } else if (i === currentPage - 3 || i === currentPage + 3) {
                  return (
                    <span key={i} className="px-2 self-center">
                      ...
                    </span>
                  );
                } else {
                  return null;
                }
              })}

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogIndex;
