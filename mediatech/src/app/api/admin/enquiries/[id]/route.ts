import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session?.user || (role !== "ADMIN" && role !== "EDITOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, adminNotes } = body;

    const dataToUpdate: any = {};
    if (status) dataToUpdate.status = status;
    if (adminNotes !== undefined) dataToUpdate.adminNotes = adminNotes;

    const updatedEnquiry = await db.enquiry.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, enquiry: updatedEnquiry });
  } catch (error: any) {
    console.error("Admin update enquiry error:", error);
    return NextResponse.json({ error: "Failed to update enquiry." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session?.user || role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await db.enquiry.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Enquiry deleted." });
  } catch (error: any) {
    console.error("Admin delete enquiry error:", error);
    return NextResponse.json({ error: "Failed to delete enquiry." }, { status: 500 });
  }
}
