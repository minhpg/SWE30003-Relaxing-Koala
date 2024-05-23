import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  staffProcedure,
} from "@/server/api/trpc";
import { reservations } from "@/server/db/schema";
import {
  editReservationSchema,
  reservationSchema,
} from "@/lib/schemas/reservations";
import { count, desc, eq } from "drizzle-orm";

export const reservationsRouter = createTRPCRouter({
  createReservation: protectedProcedure
    .input(reservationSchema)
    .mutation(async ({ ctx, input }) => {
      return (
        await ctx.db
          .insert(reservations)
          .values({
            ...input,
            createdBy: ctx.session.user.id,
          })
          .returning()
      )[0];
    }),

  editReservation: protectedProcedure
    .input(editReservationSchema)
    .mutation(async ({ ctx, input }) => {
      return (
        await ctx.db
          .update(reservations)
          .set({
            ...input,
          })
          .where(eq(reservations.id, input.id))
          .returning()
      )[0];
    }),

  getReservationById: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.reservations.findFirst({
        where: eq(reservations.id, input),
      });
    }),

  deleteReservationById: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(reservations)
        .where(eq(reservations.id, input))
        .returning();
    }),

  getReservationsPaginated: staffProcedure
    .input(
      z.object({
        pageIndex: z.number().optional(),
        pageSize: z.number().optional(),
        emailFilter: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const filteredReservations = await ctx.db.query.reservations.findMany({
        limit: input.pageSize,
        offset: (input.pageIndex || 0) * (input.pageSize || 0),
        orderBy: desc(reservations.updatedAt),
      });

      const totalCount = await ctx.db
        .select({ count: count() })
        .from(reservations);

      return {
        rows: filteredReservations,
        totalCount: totalCount[0]?.count || 0,
      };
    }),
});
