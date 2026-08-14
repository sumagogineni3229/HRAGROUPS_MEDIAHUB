import { NextResponse } from "next/server";
import { getCombinedBlogPosts, addBlogPost } from "@/lib/blog-store";
import { BlogPost } from "@/lib/blog-data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (slug) {
    const { getBlogPostBySlug } = await import("@/lib/blog-store");
    const post = getBlogPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }
    return NextResponse.json({ post });
  }
  const posts = getCombinedBlogPosts();
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, excerpt, category, contentHtml, authorName, authorRole, featuredImage } = body;

    if (!title || !excerpt || !category) {
      return NextResponse.json({ error: "Title, excerpt, and category are required." }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

    const newPost: BlogPost = {
      slug,
      title,
      excerpt,
      category,
      publishDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readTime: "5 min read",
      featuredImage: featuredImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      author: {
        name: authorName || "MediaHub Admin",
        role: authorRole || "Chief Content Strategist",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      contentHtml: contentHtml || `<p>${excerpt}</p>`,
    };

    addBlogPost(newPost);

    return NextResponse.json({ success: true, post: newPost });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create blog post." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required." }, { status: 400 });
    }

    const { deleteBlogPost } = await import("@/lib/blog-store");
    deleteBlogPost(slug);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete post." }, { status: 500 });
  }
}
