import { RequestStatus } from "@prisma/client";
import prisma from "../config/db.js";

const sendRequest = async (req, res) => {
  const { receiverId, amount, note } = req.body;
  const senderId = req.user.id;

  if (senderId == receiverId) {
    return res.status(400).json({
      success: false,
      message: "User can't request to themselves.",
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
        message: "No user present with this ID.",
      });
    }

    //transaction atomically
    const transactionRequest = await prisma.transactionRequest.create({
      data: {
        senderId,
        receiverId,
        amount,
        note,
        status: RequestStatus.PENDING,
      },
    });

    if (!transactionRequest) {
      return res.status(400).json({
        success: false,
        message: "error creating transaction request.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction request sent.",
      request: {
        id: transactionRequest.id,
        status: transactionRequest.status,
        amount: transactionRequest.amount,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error creating Transaction request",
    });
  }
};

export { sendRequest };
