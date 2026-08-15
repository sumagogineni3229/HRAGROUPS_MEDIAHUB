import { db } from "./db";

export interface RoleWallet {
  role: "ADVERTISER" | "PUBLISHER" | "INFLUENCER";
  balance: number;
  reserved: number;
  bonus: number;
  earnings: number;
  withdrawn: number;
}

/**
 * Calculates role-isolated balances, reserved funds, and earnings for each user profile.
 * - ADVERTISER: Deposited funds (Top-ups) minus funds spent on campaigns, plus escrow reserved.
 * - PUBLISHER: Earnings from completed website platform tasks minus publisher payouts.
 * - INFLUENCER: Earnings from completed social channel tasks minus influencer payouts.
 */
export async function getUserRoleWallet(
  userId: string,
  role: "ADVERTISER" | "PUBLISHER" | "INFLUENCER"
): Promise<RoleWallet> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      balance: true,
      reserved: true,
      bonus: true,
      earnings: true,
      withdrawn: true,
    },
  });

  if (role === "ADVERTISER") {
    // Active escrow held for ongoing advertiser orders (dynamically aggregated from live active tasks)
    const activeTasks = await db.task.aggregate({
      where: {
        advertiserId: userId,
        status: {
          in: ["TASK_ACCEPTANCE", "TASK_REVIEW", "IN_PROGRESS", "YOUR_APPROVAL", "IMPROVEMENT"],
        },
      },
      _sum: { price: true },
    });

    const activeReserved = Math.max(0, activeTasks._sum.price ?? 0);

    return {
      role: "ADVERTISER",
      balance: Math.max(0, user?.balance ?? 0),
      reserved: activeReserved,
      bonus: Math.max(0, user?.bonus ?? 0),
      earnings: 0,
      withdrawn: 0,
    };
  }

  if (role === "PUBLISHER") {
    // Completed publisher tasks earnings
    const completedTasks = await db.task.aggregate({
      where: {
        sellerId: userId,
        sellerType: "PUBLISHER",
        status: "COMPLETED",
      },
      _sum: { sellerEarning: true },
    });

    // Ongoing pending publisher tasks (money to be released upon approval)
    const pendingTasks = await db.task.aggregate({
      where: {
        sellerId: userId,
        sellerType: "PUBLISHER",
        status: {
          in: ["TASK_ACCEPTANCE", "TASK_REVIEW", "IN_PROGRESS", "YOUR_APPROVAL", "IMPROVEMENT"],
        },
      },
      _sum: { sellerEarning: true },
    });

    // Withdrawals made from Publisher role
    const withdrawals = await db.withdrawal.aggregate({
      where: {
        userId,
        status: { in: ["PAID", "PENDING", "PROCESSING"] },
        OR: [
          { details: { contains: "PUBLISHER", mode: "insensitive" } },
          { adminNote: { contains: "PUBLISHER", mode: "insensitive" } },
          { NOT: { details: { contains: "INFLUENCER", mode: "insensitive" } } },
        ],
      },
      _sum: { amount: true },
    });

    const totalEarnings = completedTasks._sum.sellerEarning ?? 0;
    const totalWithdrawn = withdrawals._sum.amount ?? 0;
    const availableBalance = Math.max(0, totalEarnings - totalWithdrawn);
    const reservedBalance = pendingTasks._sum.sellerEarning ?? 0;

    return {
      role: "PUBLISHER",
      balance: availableBalance,
      reserved: reservedBalance,
      bonus: 0,
      earnings: totalEarnings,
      withdrawn: totalWithdrawn,
    };
  }

  if (role === "INFLUENCER") {
    // Completed influencer tasks earnings
    const completedTasks = await db.task.aggregate({
      where: {
        sellerId: userId,
        sellerType: "INFLUENCER",
        status: "COMPLETED",
      },
      _sum: { sellerEarning: true },
    });

    // Ongoing pending influencer tasks (money to be released upon approval)
    const pendingTasks = await db.task.aggregate({
      where: {
        sellerId: userId,
        sellerType: "INFLUENCER",
        status: {
          in: ["TASK_ACCEPTANCE", "TASK_REVIEW", "IN_PROGRESS", "YOUR_APPROVAL", "IMPROVEMENT"],
        },
      },
      _sum: { sellerEarning: true },
    });

    // Withdrawals made from Influencer role
    const withdrawals = await db.withdrawal.aggregate({
      where: {
        userId,
        status: { in: ["PAID", "PENDING", "PROCESSING"] },
        details: { contains: "INFLUENCER", mode: "insensitive" },
      },
      _sum: { amount: true },
    });

    const totalEarnings = completedTasks._sum.sellerEarning ?? 0;
    const totalWithdrawn = withdrawals._sum.amount ?? 0;
    const availableBalance = Math.max(0, totalEarnings - totalWithdrawn);
    const reservedBalance = pendingTasks._sum.sellerEarning ?? 0;

    return {
      role: "INFLUENCER",
      balance: availableBalance,
      reserved: reservedBalance,
      bonus: 0,
      earnings: totalEarnings,
      withdrawn: totalWithdrawn,
    };
  }

  return {
    role,
    balance: user?.balance ?? 0,
    reserved: user?.reserved ?? 0,
    bonus: user?.bonus ?? 0,
    earnings: user?.earnings ?? 0,
    withdrawn: user?.withdrawn ?? 0,
  };
}

/**
 * Returns role-isolated transactions for the specified account type with task details.
 */
export async function getUserRoleTransactions(
  userId: string,
  role: "ADVERTISER" | "PUBLISHER" | "INFLUENCER",
  filterType?: string,
  searchQuery?: string
) {
  const searchFilter = searchQuery?.trim()
    ? {
        OR: [
          { note: { contains: searchQuery.trim(), mode: "insensitive" as const } },
          { id: { contains: searchQuery.trim(), mode: "insensitive" as const } },
          { task: { id: { contains: searchQuery.trim(), mode: "insensitive" as const } } },
        ],
      }
    : {};

  let txList = [];

  if (role === "ADVERTISER") {
    txList = await db.transaction.findMany({
      where: {
        userId,
        ...(filterType && filterType !== "ALL" ? { type: filterType as any } : {}),
        ...searchFilter,
        OR: [
          { type: { in: ["TOPUP", "BONUS", "PAYMENT", "REFUND"] } },
          { task: { advertiserId: userId } },
        ],
      },
      include: {
        task: {
          select: {
            id: true,
            status: true,
            price: true,
            platform: { select: { name: true, url: true } },
            channel: { select: { handle: true, platform: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } else if (role === "PUBLISHER") {
    txList = await db.transaction.findMany({
      where: {
        userId,
        ...(filterType && filterType !== "ALL" ? { type: filterType as any } : {}),
        ...searchFilter,
        OR: [
          { task: { sellerId: userId, sellerType: "PUBLISHER" } },
          { note: { contains: "Publisher", mode: "insensitive" as const } },
          { type: "WITHDRAWAL" },
        ],
      },
      include: {
        task: {
          select: {
            id: true,
            status: true,
            sellerEarning: true,
            platform: { select: { name: true, url: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } else if (role === "INFLUENCER") {
    txList = await db.transaction.findMany({
      where: {
        userId,
        ...(filterType && filterType !== "ALL" ? { type: filterType as any } : {}),
        ...searchFilter,
        OR: [
          { task: { sellerId: userId, sellerType: "INFLUENCER" } },
          { note: { contains: "Influencer", mode: "insensitive" as const } },
          { type: "WITHDRAWAL" },
        ],
      },
      include: {
        task: {
          select: {
            id: true,
            status: true,
            sellerEarning: true,
            channel: { select: { handle: true, platform: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    txList = await db.transaction.findMany({
      where: {
        userId,
        ...(filterType && filterType !== "ALL" ? { type: filterType as any } : {}),
        ...searchFilter,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Fetch withdrawals for this user to map live status (PENDING, PROCESSING, PAID, REJECTED)
  const userWithdrawals = await db.withdrawal.findMany({
    where: { userId },
    select: { id: true, status: true, amount: true, details: true, method: true },
  });

  return txList.map((tx) => {
    if (tx.type === "WITHDRAWAL") {
      const match =
        userWithdrawals.find((w) => w.id === tx.reference) ||
        userWithdrawals.find((w) => Math.abs(w.amount - Math.abs(tx.amount)) < 0.01);

      return {
        ...tx,
        status: match ? match.status : "PAID",
        withdrawalDetails: match ? `${match.method} - ${match.details}` : null,
      };
    }
    return {
      ...tx,
      status: "COMPLETED",
    };
  });
}
