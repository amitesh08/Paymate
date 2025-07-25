import { TransactionStatus } from "@prisma/client";
import prisma from "../config/db.js";
import { formatDate } from "../utils/formatDate.js";

const sendMoney = async (req, res) => {
  const senderId = req.user.id;
  const { receiverId, amount, note } = req.body;

  if (senderId == receiverId) {
    return res.status(400).json({
      success: false,
      message: "Can't send money to yourself!",
    });
  }

  try {
    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
    });

    if (!receiver) {
      return res.status(400).json({
        success: false,
        message: "receiver not found!",
      });
    }

    const sender = await prisma.user.findUnique({
      where: {
        id: senderId,
      },
    });

    if (sender.balance < amount) {
      try {
        const transaction = await prisma.transaction.create({
          data: {
            senderId: senderId,
            receiverId: receiverId,
            amount: amount,
            note: note,
            status: TransactionStatus.FAILED,
          },
        });
        if (!transaction) {
          return res.status(400).json({
            sucess: false,
            message: "transaction failed!",
          });
        }
        return res.status(400).json({
          success: false,
          message: "Insufficient balance!",
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Error creating transaction",
        });
      }
    }

    //transaction atomically
    const transaction = await prisma.$transaction(async (txn) => {
      await txn.user.update({
        where: { id: senderId },
        data: { balance: { decrement: amount } },
      });

      await txn.user.update({
        where: { id: receiverId },
        data: { balance: { increment: amount } },
      });

      return await txn.transaction.create({
        data: {
          senderId,
          receiverId,
          amount,
          note,
          status: TransactionStatus.COMPLETED,
        },
      });
    });

    res.status(200).json({
      success: true,
      message: "Transaction successfull!",
      transaction,
    });
  } catch (error) {
    console.error("Error in sendMoney:", error);
    res.status(500).json({
      success: false,
      message: "Transaction failed",
    });
  }
};

const getTransactionHistroy = async (req, res) => {
  const userId = req.user.id;

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" }, //sorting
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!transactions) {
      return res.status(400).json({
        success: false,
        message: "Error getting transactions histroy!",
      });
    }

    //setting type with the txns it sent or recieved money.
    const transactionWithType = transactions.map((txn) => ({
      ...txn,
      createdAt: formatDate(txn.createdAt),
      type: txn.senderId === userId ? "SENT" : "RECEIVED",
    }));

    res.status(200).json({
      success: true,
      message: "Your Transactions-",
      transactions: transactionWithType,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error getting Transaction histroy!",
    });
  }
};

export { sendMoney, getTransactionHistroy };
