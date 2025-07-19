import prisma from "../config/db.js";

const getAllUsers = async (req, res) => {
  const currentUserId = req.user.id;

  try {
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId, //excluding the current user!
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    if (!users) {
      return res.status(400).josn({
        success: false,
        message: "Error fetching the users!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Users fetched!",
      users,
    });
  } catch (error) {
    return res.status(400).josn({
      success: false,
      message: "failed to get the users!",
    });
  }
};

const getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        balance: true,
      },
    });

    const totalSent = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { senderId: userId },
    });

    const totalReceived = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { receiverId: userId },
    });

    const transactionCount = await prisma.transaction.count({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });

    const recentTransactions = await prisma.transaction.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        sender: { select: { name: true } },
        receiver: { select: { name: true } },
      },
    });

    res.status(200).json({
      success: true,
      message: "User profile fetched.",
      data: {
        ...user,
        stats: {
          totalSent: totalSent._sum.amount || 0,
          totalReceived: totalReceived._sum.amount || 0,
          transactionCount,
        },
        recentTransactions,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

export { getAllUsers, getUserProfile };
