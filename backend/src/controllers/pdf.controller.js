import prisma from "../config/db.js";
import { generateTransactionPDF } from "../utils/pdfGenerator.js";

//export user's transaction history as a downloadable PDF
const exportTransactionsPDF = async (req, res) => {
  const userId = req.user.id; // Authenticated user's ID

  try {
    //Fetch all transactions where the user is either sender or receiver
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" }, // Sort transactions by most recent first
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

    // Handle no transaction case
    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found to export.",
      });
    }

    //// Fetch current user’s balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Error getting current balance!",
      });
    }

    // Generate PDF stream using helper function
    const generatePDF = generateTransactionPDF(
      transactions,
      userId,
      user.balance
    );

    // Check if PDF generation failed
    if (!generatePDF) {
      return res.status(400).json({
        success: false,
        message: "Error while generating transaction PDF!",
      });
    }

    // Set headers to trigger file download in browser
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=transaction-${Date.now()}.pdf`
    );

    //Pipe the PDF stream directly to the response
    generatePDF.pipe(res);

    // NOTE: Don't send another res.status().json() after piping the stream.
    // The stream itself ends the response, so remove this block:
    // res.status(200).json({ ... });

    generatePDF.end();
  } catch (error) {
    // 7. Handle unexpected errors
    console.error("Error exporting PDF:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export PDF",
    });
  }
};

export { exportTransactionsPDF };
