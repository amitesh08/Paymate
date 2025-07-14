import { z } from "zod";

export const sendRequestSchema = z.object({
  receiverId: z.string().min(1, "Receiver ID is required!"),
  amount: z
    .number({ invalid_type_error: "Amount must be a Number" })
    .int("Amount must be integer")
    .positive("Amount must be greater than zero"),
  note: z.string().optional(),
});

export const respondSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  action: z.enum(["ACCEPT", "REJECT"]),
});
