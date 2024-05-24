import { paymentMethod, paymentStatus } from "@/server/db/schema";
import { z } from "zod";

export const paymentSchema = z.object({
  orderId: z.number(),
  amount: z.number(),
  invoiceAddress: z.string().nullish(),
  paymentMethod: z.enum(paymentMethod).default("CASH"),
  paymentStatus: z.enum(paymentStatus).default("COMPLETED"),
  invoiceName: z.string().nullish(),
  invoiceEmailAddress: z.string().email().nullish(),
});
