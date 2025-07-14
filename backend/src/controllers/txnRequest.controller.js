import { RequestStatus, TransactionStatus } from "@prisma/client";
import prisma from "../config/db.js";
import { success } from "zod";
import { formatDate } from "../utils/formatDate.js";

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

//get all incomming request
const getIncomingRequests = async (req, res) => {
  try {
    const incomingRequests = await prisma.transactionRequest.findMany({
      where: {
        receiverId: req.user.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    if (!incomingRequests) {
      return res.status(400).json({
        success: false,
        message: "Error getting the requests",
      });
    }

    const formattedRequests = incomingRequests.map((request) => ({
      id: request.id,
      amount: request.amount,
      note: request.note,
      status: request.status,
      createdAt: formatDate(request.createdAt),
      sender: request.sender,
    }));

    res.status(200).json({
      success: true,
      message: "fetched all the incoming requests.",
      requests: formattedRequests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while getting requests.",
    });
  }
};

//get all outgoing request
const getoutgoingRequests = async (req, res) => {
  try {
    const outgoingRequests = await prisma.transactionRequest.findMany({
      where: {
        senderId: req.user.id,
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    if (!outgoingRequests) {
      return res.status(400).json({
        success: false,
        message: "Error getting the requests",
      });
    }

    const formattedRequests = outgoingRequests.map((request) => ({
      id: request.id,
      amount: request.amount,
      note: request.note,
      status: request.status,
      createdAt: formatDate(request.createdAt),
      receiver: request.receiver,
    }));

    res.status(200).json({
      success: true,
      message: "fetched all the outgoing requests.",
      requests: formattedRequests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while getting requests.",
    });
  }
};

//repond to request
const respondRequest = async (req, res) => {
  const { requestId, action } = req.body;
  const receiverId = req.user.id;

  try {
    const request = await prisma.transactionRequest.findUnique({
      where: { id: requestId },
    });

    // Validate request ownership and status
    if (
      !request ||
      request.receiverId !== receiverId ||
      request.status !== "PENDING"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or unauthorized request.",
      });
    }

    if (action === "REJECT") {
      await prisma.transactionRequest.update({
        where: { id: requestId },
        data: { status: RequestStatus.REJECTED },
      });

      return res.status(200).json({
        success: true,
        message: "Request rejected.",
      });
    }

    if (action === "ACCEPT") {
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
      });

      if (receiver.balance < request.amount) {
        return res.status(400).json({
          success: false,
          message: "Insufficient balance to accept request.",
        });
      }

      // Run atomic transaction
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: receiverId },
          data: { balance: { decrement: request.amount } },
        });

        await tx.user.update({
          where: { id: request.senderId },
          data: { balance: { increment: request.amount } },
        });

        await tx.transaction.create({
          data: {
            senderId: receiverId, // because receiver is sending now
            receiverId: request.senderId,
            amount: request.amount,
            note: request.note,
            status: TransactionStatus.COMPLETED,
          },
        });

        await tx.transactionRequest.update({
          where: { id: requestId },
          data: { status: RequestStatus.ACCEPTED },
        });
      });

      return res.status(200).json({
        success: true,
        message: "Request accepted and money sent.",
        data: {
          transaction: {
            amount: request.amount,
            to: request.senderId,
            note: request.note,
          },
        },
      });
    }

    res.status(400).json({
      success: false,
      message: "Invalid action type. Must be ACCEPT or REJECT.",
    });
  } catch (error) {
    console.error("Respond Request Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to respond to request.",
    });
  }
};

export {
  sendRequest,
  getIncomingRequests,
  getoutgoingRequests,
  respondRequest,
};
