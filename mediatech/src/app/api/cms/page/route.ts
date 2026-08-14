import { NextRequest, NextResponse } from "next/server";
import { getPageContent, savePageContent } from "@/lib/cms-store";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "Missing page key" }, { status: 400 });
  }

  const html = await getPageContent(key, "");
  return NextResponse.json({ key, html });
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session?.user || (role !== "EDITOR" && role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Editor role required." }, { status: 403 });
    }

    const { key, html } = await req.json();
    if (!key || html === undefined) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await savePageContent(key, html);
    return NextResponse.json({ success: true, key });
  } catch (err) {
    console.error("[CMS_SAVE_ERROR]", err);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session?.user || (role !== "EDITOR" && role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Editor role required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    if (!key) {
      return NextResponse.json({ error: "Missing page key" }, { status: 400 });
    }

    const { revertPageContent } = await import("@/lib/cms-store");
    await revertPageContent(key);
    return NextResponse.json({ success: true, key });
  } catch (err) {
    console.error("[CMS_DELETE_ERROR]", err);
    return NextResponse.json({ error: "Failed to revert content" }, { status: 500 });
  }
}
