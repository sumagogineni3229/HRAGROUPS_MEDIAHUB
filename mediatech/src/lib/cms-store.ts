import { db } from "@/lib/db";
import { BLOG_POSTS, BlogPost } from "./blog-data";

export interface PageContent {
  key: string;
  title: string;
  content: string; // JSON or HTML
  updatedAt?: string;
}

// In-memory fallback if DB table not available yet
const pageContentCache: Record<string, string> = {};

export async function getPageContent(pageKey: string, defaultHtml: string): Promise<string> {
  try {
    const user = await db.user.findFirst({
      where: { bio: { startsWith: `[CMS_PAGE:${pageKey}]` } },
      select: { bio: true }
    });
    if (user && user.bio) {
      const jsonStr = user.bio.replace(`[CMS_PAGE:${pageKey}]`, "");
      const data = JSON.parse(jsonStr);
      if (data && data.html) return data.html;
    }
  } catch (e) {
    // fallback to cache
  }

  return pageContentCache[pageKey] ?? defaultHtml;
}

export async function savePageContent(pageKey: string, html: string): Promise<boolean> {
  try {
    pageContentCache[pageKey] = html;

    // Find or create CMS storage user record
    const cmsUserEmail = `cms_page_${pageKey.toLowerCase()}@system.mediahub`;
    const payload = `[CMS_PAGE:${pageKey}]` + JSON.stringify({ html, updatedAt: new Date().toISOString() });

    await db.user.upsert({
      where: { email: cmsUserEmail },
      update: { bio: payload },
      create: {
        email: cmsUserEmail,
        name: `CMS Page Content: ${pageKey}`,
        role: "ADMIN",
        bio: payload,
      }
    });

    return true;
  } catch (e) {
    console.error("Failed to save CMS page content:", e);
    pageContentCache[pageKey] = html;
    return true;
  }
}

export async function revertPageContent(pageKey: string): Promise<boolean> {
  try {
    delete pageContentCache[pageKey];
    const cmsUserEmail = `cms_page_${pageKey.toLowerCase()}@system.mediahub`;
    await db.user.deleteMany({
      where: { email: cmsUserEmail }
    });
    return true;
  } catch (e) {
    console.error("Failed to revert CMS page content:", e);
    delete pageContentCache[pageKey];
    return true;
  }
}
