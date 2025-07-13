// utils/pdfgenerate.js

import PDFDocument from "pdfkit-table";
import { formatDate } from "./formatDate.js";

/**
 * Generates a transaction history PDF document.
 *
 * @param {Array} transactions - List of transactions (sent & received).
 * @param {String} currentUserId - ID of the current logged-in user.
 * @param {Number} currentBalance - Current balance of the user.
 * @returns {PDFDocument} - A PDFDocument stream that can be piped into response.
 */

export const generateTransactionPDF = (
  transactions,
  currentUserId,
  currentBalance
) => {
  // Create a new PDF document
  const doc = new PDFDocument({ margin: 30, size: "A4" });

  // Add a title at the top center
  doc.fontSize(18).text("Paymate - Transaction History", { align: "center" });
  doc.moveDown(0.5); // Add vertical spacing

  // Display current user balance in top-right corner
  doc
    .fontSize(12)
    .fillColor("blue")
    .text(`Current Balance: Rs.${currentBalance}`, {
      align: "right",
    });
  doc.moveDown(1); // Add space after balance

  // Prepare table rows from transaction data
  const rows = transactions.map((txn, index) => [
    index + 1,
    formatDate(txn.createdAt),
    txn.senderId === currentUserId ? "SENT" : "RECEIVED",
    `₹${txn.amount}`,
    txn.status,
    txn.note || "-",
  ]);

  // Define table structure with headers and data rows
  const table = {
    headers: ["No.", "Date", "Type", "Amount", "Status", "Note"],
    rows,
  };

  // Render the table into the PDF
  doc.table(table, {
    width: 500, // Optional width
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12), // Header styling
    prepareRow: (row, i) => {
      doc.font("Helvetica").fontSize(10);
      // Highlight failed transactions in red for visibility
      if (row.status === "FAILED") {
        doc.fillColor("red");
      } else {
        doc.fillColor("black");
      }
    },
  });

  // Finalize the PDF document stream
  //   doc.end();

  // Return the document to be piped in the controller
  return doc;
};
