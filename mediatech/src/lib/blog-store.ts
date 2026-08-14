import { BLOG_POSTS as DEMO_POSTS, BlogPost } from "./blog-data";

// In-memory global cache
declare global {
  var __customBlogPosts: BlogPost[] | undefined;
  var __deletedBlogSlugs: Set<string> | undefined;
}

if (!global.__customBlogPosts) {
  global.__customBlogPosts = [];
}
if (!global.__deletedBlogSlugs) {
  global.__deletedBlogSlugs = new Set();
}

function getStorageFilePath(): string | null {
  if (typeof window !== "undefined") return null;
  try {
    const path = require("path");
    return path.join(process.cwd(), ".custom_blogs.json");
  } catch (e) {
    return null;
  }
}

function loadFromDisk(): void {
  if (typeof window !== "undefined") return;
  try {
    const fs = require("fs");
    const filePath = getStorageFilePath();
    if (filePath && fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(raw);
      if (Array.isArray(data.customPosts)) {
        global.__customBlogPosts = data.customPosts;
      }
      if (Array.isArray(data.deletedSlugs)) {
        global.__deletedBlogSlugs = new Set(data.deletedSlugs);
      }
    }
  } catch (err) {}
}

function saveToDisk(): void {
  if (typeof window !== "undefined") return;
  try {
    const fs = require("fs");
    const filePath = getStorageFilePath();
    if (filePath) {
      const data = {
        customPosts: global.__customBlogPosts || [],
        deletedSlugs: Array.from(global.__deletedBlogSlugs || []),
      };
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    }
  } catch (err) {}
}

export function getCombinedBlogPosts(): BlogPost[] {
  loadFromDisk();
  const custom = global.__customBlogPosts || [];
  const deleted = global.__deletedBlogSlugs || new Set();
  return [...custom, ...DEMO_POSTS].filter((p) => !deleted.has(p.slug));
}

export function addBlogPost(post: BlogPost): void {
  loadFromDisk();
  if (!global.__customBlogPosts) global.__customBlogPosts = [];
  if (!global.__deletedBlogSlugs) global.__deletedBlogSlugs = new Set();

  global.__customBlogPosts = global.__customBlogPosts.filter((p) => p.slug !== post.slug);
  global.__deletedBlogSlugs.delete(post.slug);
  global.__customBlogPosts.unshift(post);
  saveToDisk();
}

export function deleteBlogPost(slug: string): void {
  loadFromDisk();
  if (!global.__customBlogPosts) global.__customBlogPosts = [];
  if (!global.__deletedBlogSlugs) global.__deletedBlogSlugs = new Set();

  global.__deletedBlogSlugs.add(slug);
  global.__customBlogPosts = global.__customBlogPosts.filter((p) => p.slug !== slug);
  saveToDisk();
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  loadFromDisk();
  return getCombinedBlogPosts().find((p) => p.slug === slug);
}
