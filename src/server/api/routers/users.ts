import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { roles, users } from "@/server/db/schema";
import { count, eq, ilike } from "drizzle-orm";

import { protectedProcedure, staffProcedure } from "../trpc";

export const usersRouter = {
  getUserById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.users.findFirst({
        where: eq(users.id, input),
      });
    }),
  getUsersPaginated: staffProcedure
    .input(
      z.object({
        pageIndex: z.number().optional(),
        pageSize: z.number().optional(),
        emailFilter: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const filteredUsers = await ctx.db.query.users.findMany({
        limit: input.pageSize,
        offset: (input.pageIndex || 0) * (input.pageSize || 0),
        where: ilike(users.email, `%${input.emailFilter || ""}%`),
      });

      const totalCount = await ctx.db
        .select({ count: count() })
        .from(users)
        .where(ilike(users.email, `%${input.emailFilter || ""}%`));

      return {
        rows: filteredUsers,
        totalCount: totalCount[0]?.count || 0,
      };
    }),

  updateUserRole: staffProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(roles),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ role: input.role })
        .where(eq(users.id, input.userId));
    }),
} satisfies TRPCRouterRecord;
