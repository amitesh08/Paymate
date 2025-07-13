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

export { getAllUsers };
