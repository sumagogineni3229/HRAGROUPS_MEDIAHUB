import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import TasksClient from "./tasks-client";

export const metadata = {
  title: "Tasks - MediaHub Publisher",
};

interface PageProps {
  searchParams: Promise<{ 
    status?: string;
    type?: string;
    taskId?: string;
    siteUrl?: string;
    promotedUrl?: string;
    anchorText?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function PublisherTasksPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const currentTab = resolvedParams.status || "TASK_ACCEPTANCE";
  const typeFilter = resolvedParams.type || "";
  const taskIdFilter = resolvedParams.taskId || "";
  const siteUrlFilter = resolvedParams.siteUrl || "";
  const promotedUrlFilter = resolvedParams.promotedUrl || "";
  const anchorTextFilter = resolvedParams.anchorText || "";
  const startDate = resolvedParams.startDate || "";
  const endDate = resolvedParams.endDate || "";

  // Fetch publisher tasks matching filters
  const tasks = await db.task.findMany({
    where: {
      sellerId: session.user.id,
      sellerType: "PUBLISHER",
      ...(currentTab !== "ALL" ? { status: currentTab as any } : {}),
      ...(taskIdFilter ? { id: taskIdFilter } : {}),
      ...(anchorTextFilter ? {
        anchorText: { contains: anchorTextFilter, mode: "insensitive" }
      } : {}),
      ...(promotedUrlFilter ? {
        targetUrl: { contains: promotedUrlFilter, mode: "insensitive" }
      } : {}),
      ...(siteUrlFilter ? {
        platform: {
          url: { contains: siteUrlFilter, mode: "insensitive" }
        }
      } : {}),
      ...(startDate && endDate ? {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      } : {})
    },
    include: {
      platform: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate counts for badges
  const allCount = await db.task.count({ where: { sellerId: session.user.id, sellerType: "PUBLISHER" } });
  const reviewCount = await db.task.count({ where: { sellerId: session.user.id, sellerType: "PUBLISHER", status: "TASK_REVIEW" } });
  const acceptanceCount = await db.task.count({ where: { sellerId: session.user.id, sellerType: "PUBLISHER", status: "TASK_ACCEPTANCE" } });
  const completedCount = await db.task.count({ where: { sellerId: session.user.id, sellerType: "PUBLISHER", status: "COMPLETED" } });

  // Server actions for task responses
  async function handleAccept(formData: FormData) {
    "use server";
    const taskId = formData.get("taskId") as string;
    const { db } = await import("@/lib/db");
    const task = await db.task.findUnique({ where: { id: taskId } });
    if (!task) return;
    await db.task.update({
      where: { id: taskId },
      data: { status: "IN_PROGRESS", acceptedAt: new Date() }
    });
    await db.notification.create({
      data: { userId: task.advertiserId, type: "TASK_UPDATE", title: "Order accepted", body: "Your placement order was accepted and work has started.", link: `/advertiser/tasks/${taskId}` }
    });
    redirect("/publisher/tasks?status=IN_PROGRESS");
  }

  async function handleReject(formData: FormData) {
    "use server";
    const taskId = formData.get("taskId") as string;
    const { db } = await import("@/lib/db");

    const task = await db.task.findUnique({ where: { id: taskId } });
    if (!task) return;

    // Refund escrow to advertiser balance
    await db.$transaction([
      db.user.update({
        where: { id: task.advertiserId },
        data: {
          balance: { increment: task.price },
          reserved: { decrement: task.price }
        }
      }),
      db.task.update({
        where: { id: taskId },
        data: { status: "REJECTED" }
      })
    ]);

    await db.notification.create({
      data: {
        userId: task.advertiserId,
        type: "TASK_UPDATE",
        title: "Order declined",
        body: "Your placement order was declined. Your funds have been refunded.",
        link: `/advertiser/tasks/${taskId}`
      }
    });

    redirect("/publisher/tasks?status=REJECTED");
  }

  async function handleSubmitDeliverable(formData: FormData) {
    "use server";
    const taskId = formData.get("taskId") as string;
    const liveUrl = formData.get("liveUrl") as string;
    const { db } = await import("@/lib/db");
    await db.task.update({
      where: { id: taskId },
      data: { 
        status: "YOUR_APPROVAL", 
        liveUrl,
        deliveredAt: new Date()
      }
    });
    redirect("/publisher/tasks?status=YOUR_APPROVAL");
  }

  return (
    <TasksClient 
      tasks={tasks}
      currentTab={currentTab}
      typeFilter={typeFilter}
      taskIdFilter={taskIdFilter}
      siteUrlFilter={siteUrlFilter}
      promotedUrlFilter={promotedUrlFilter}
      anchorTextFilter={anchorTextFilter}
      startDate={startDate}
      endDate={endDate}
      allCount={allCount}
      reviewCount={reviewCount}
      acceptanceCount={acceptanceCount}
      completedCount={completedCount}
      onAccept={handleAccept}
      onReject={handleReject}
      onSubmitDeliverable={handleSubmitDeliverable}
    />
  );
}
