import { BLOG_POSTS as DEMO_POSTS, BlogPost } from "./blog-data";

let customPosts: BlogPost[] = [];
let deletedSlugs: Set<string> = new Set();

export function getCombinedBlogPosts(): BlogPost[] {
  return [...customPosts, ...DEMO_POSTS].filter((p) => !deletedSlugs.has(p.slug));
}

export function addBlogPost(post: BlogPost): void {
  customPosts.unshift(post);
}

export function deleteBlogPost(slug: string): void {
  deletedSlugs.add(slug);
  customPosts = customPosts.filter((p) => p.slug !== slug);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getCombinedBlogPosts().find((p) => p.slug === slug);
}
