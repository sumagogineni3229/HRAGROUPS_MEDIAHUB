import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const isCompanyPublisher = session?.user?.email === "mediahub@publisher.com";
    const role = (session?.user as any)?.role;
    const isAdmin = role === "ADMIN" || role === "EDITOR";

    if (!session?.user || (!isAdmin && !isCompanyPublisher)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { platformId, placementPrice, writingPrice, specialTopicPrice, enquiryId } = body;

    if (!platformId) {
      return NextResponse.json({ error: "Platform ID is required." }, { status: 400 });
    }

    const platform = await db.platform.findUnique({
      where: { id: platformId },
      include: { packages: true },
    });

    if (!platform) {
      return NextResponse.json({ error: "Platform not found." }, { status: 404 });
    }

    // Upsert ARTICLE_POSTING (Content Placement)
    if (placementPrice !== undefined && placementPrice !== null && !isNaN(Number(placementPrice))) {
      const price = Number(placementPrice);
      const existing = platform.packages.find((p) => p.type === "ARTICLE_POSTING");
      if (existing) {
        await db.package.update({
          where: { id: existing.id },
          data: { price, isActive: price > 0 },
        });
      } else if (price > 0) {
        await db.package.create({
          data: {
            platformId,
            type: "ARTICLE_POSTING",
            price,
            turnaround: 3,
            isActive: true,
          },
        });
      }
    }

    // Upsert LINK_INSERTION (Writing & Placement)
    if (writingPrice !== undefined && writingPrice !== null && !isNaN(Number(writingPrice))) {
      const price = Number(writingPrice);
      const existing = platform.packages.find((p) => p.type === "LINK_INSERTION");
      if (existing) {
        await db.package.update({
          where: { id: existing.id },
          data: { price, isActive: price > 0 },
        });
      } else if (price > 0) {
        await db.package.create({
          data: {
            platformId,
            type: "LINK_INSERTION",
            price,
            turnaround: 3,
            isActive: true,
          },
        });
      }
    }

    // Upsert PRESS_RELEASE (Special Topic)
    if (specialTopicPrice !== undefined && specialTopicPrice !== null && !isNaN(Number(specialTopicPrice))) {
      const price = Number(specialTopicPrice);
      const existing = platform.packages.find((p) => p.type === "PRESS_RELEASE");
      if (existing) {
        await db.package.update({
          where: { id: existing.id },
          data: { price, isActive: price > 0 },
        });
      } else if (price > 0) {
        await db.package.create({
          data: {
            platformId,
            type: "PRESS_RELEASE",
            price,
            turnaround: 5,
            isActive: true,
          },
        });
      }
    }

    // If linked to an enquiry, mark as IN_PROGRESS or RESOLVED
    if (enquiryId) {
      await db.enquiry.update({
        where: { id: enquiryId },
        data: { status: "RESOLVED" },
      });
    }

    const updatedPlatform = await db.platform.findUnique({
      where: { id: platformId },
      include: { packages: true },
    });

    return NextResponse.json({ success: true, platform: updatedPlatform });
  } catch (error: any) {
    console.error("[UPDATE_PLATFORM_PRICE_ERROR]", error);
    return NextResponse.json({ error: "Failed to update package prices." }, { status: 500 });
  }
}
