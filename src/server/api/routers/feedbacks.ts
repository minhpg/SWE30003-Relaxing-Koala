import { z } from "zod";

import { feedbackSchema } from "@/lib/schemas/feedbacks";
import {
  createTRPCRouter,
  publicProcedure,
  staffProcedure,
} from "@/server/api/trpc";
import { feedbacks, payment } from "@/server/db/schema";
import { count, desc, like } from "drizzle-orm";

export const feedbacksRouter = createTRPCRouter({
  createFeedback: publicProcedure
    .input(feedbackSchema)
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const newFeedback = await db
        .insert(feedbacks)
        .values({ ...input })
        .returning();
      return newFeedback[0];
    }),

  getFeedbacksPaginated: staffProcedure
    .input(
      z.object({
        pageIndex: z.number().optional(),
        pageSize: z.number().optional(),
        emailFilter: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const filteredFeedback = await ctx.db.query.feedbacks.findMany({
        limit: input.pageSize,
        offset: (input.pageIndex || 0) * (input.pageSize || 0),
        orderBy: desc(payment.id),
        where: like(feedbacks.email, `%${input.emailFilter || ""}%`),
      });

      const totalCount = await ctx.db
        .select({ count: count() })
        .from(feedbacks)
        .where(like(feedbacks.email, `%${input.emailFilter || ""}%`));

      return {
        rows: filteredFeedback,
        totalCount: totalCount[0]?.count || 0,
      };
    }),
});
