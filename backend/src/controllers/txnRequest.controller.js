import { RequestStatus } from "@prisma/client";
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

export { sendRequest, getIncomingRequests, getoutgoingRequests };
