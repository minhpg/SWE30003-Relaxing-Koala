import { z } from "zod";

import { paymentSchema } from "@/lib/schemas/payments";
import { createTRPCRouter, staffProcedure } from "@/server/api/trpc";
import { payment } from "@/server/db/schema";
import { sendInvoiceEmail } from "@/server/helpers/emailHelper";
import { count, desc, like } from "drizzle-orm";

export const paymentsRouter = createTRPCRouter({
  createPayment: staffProcedure
    .input(paymentSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const newPayment = await db
        .insert(payment)
        .values({ ...input })
        .returning();
      await sendInvoiceEmail(input.orderId);
      return newPayment[0];
    }),

  getPaymentsPaginated: staffProcedure
    .input(
      z.object({
        pageIndex: z.number().optional(),
        pageSize: z.number().optional(),
        emailFilter: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const filteredPayments = await ctx.db.query.payment.findMany({
        limit: input.pageSize,
        offset: (input.pageIndex || 0) * (input.pageSize || 0),
        orderBy: desc(payment.id),
        where:
          input.emailFilter && input.emailFilter.length > 0
            ? like(payment.invoiceEmailAddress, `%${input.emailFilter}%`)
            : undefined,
      });

      const totalCount = await ctx.db
        .select({ count: count() })
        .from(payment)
        .where(
          like(payment.invoiceEmailAddress, `%${input.emailFilter || ""}%`),
        );

      return {
        rows: filteredPayments,
        totalCount: totalCount[0]?.count || 0,
      };
    }),
});
