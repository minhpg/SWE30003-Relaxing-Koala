import { orderStatus } from "@/server/db/schema";
import { z } from "zod";

export const orderSchema = z.object({
  tableNumber: z.coerce.number(),
  status: z.enum(orderStatus),
});

export const createOrderSchema = z.object({
  tableNumber: z.coerce.number(),
  items: z
    .array(
      z.object({
        id: z.number(),
        quantity: z.number(),
      }),
    )
    .min(1),
  notes: z.string().nullish(),
});

export const updateOrderSchema = createOrderSchema.extend({
  id: z.number(),
});
