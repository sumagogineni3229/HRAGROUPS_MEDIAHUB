import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session?.user || (role !== "ADMIN" && role !== "EDITOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {
      type: "PRICING_REQUEST",
    };
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { companyName: { contains: search, mode: "insensitive" } },
        { specificWebsite: { contains: search, mode: "insensitive" } },
        { query: { contains: search, mode: "insensitive" } },
      ];
    }

    const enquiries = await db.enquiry.findMany({
      where,
      include: {
        platform: {
          select: {
            id: true,
            url: true,
            niche: true,
            da: true,
            country: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, enquiries });
  } catch (error: any) {
    console.error("Admin enquiries fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch enquiries." }, { status: 500 });
  }
}
