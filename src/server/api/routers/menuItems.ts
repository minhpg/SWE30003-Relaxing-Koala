import { menuItemSchema, updateMenuItemSchema } from "@/lib/schemas/menus";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  staffProcedure,
} from "@/server/api/trpc";
import { menuItems, menuItemsToMenu } from "@/server/db/schema";
import { count, desc, eq, like } from "drizzle-orm";
import { z } from "zod";

export const menuItemsRouter = createTRPCRouter({
  createMenuItem: staffProcedure
    .input(menuItemSchema)
    .mutation(async ({ ctx, input }) => {
      return (
        await ctx.db
          .insert(menuItems)
          .values({
            ...input,
            createdBy: ctx.session.user.id,
          })
          .returning()
      )[0];
    }),

  deleteMenuItemById: staffProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(menuItems).where(eq(menuItems.id, input));
    }),

  updateMenuItemById: staffProcedure
    .input(updateMenuItemSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      return (
        await ctx.db
          .update(menuItems)
          .set({
            ...input,
          })
          .where(eq(menuItems.id, input.id))
          .returning()
      )[0];
    }),

  getMenuItemsPaginated: publicProcedure
    .input(
      z.object({
        pageIndex: z.number().optional(),
        pageSize: z.number().optional(),
        nameFilter: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const filteredMenuItems = await ctx.db.query.menuItems.findMany({
        limit: input.pageSize,
        offset: (input.pageIndex || 0) * (input.pageSize || 0),
        orderBy: desc(menuItems.updatedAt),
        where: input.nameFilter
          ? like(menuItems.name, `%${input.nameFilter || ""}%`)
          : undefined,
      });

      const totalCount = await ctx.db
        .select({ count: count() })
        .from(menuItems)
        .where(
          input.nameFilter
            ? like(menuItems.name, `%${input.nameFilter || ""}%`)
            : undefined,
        );

      return {
        rows: filteredMenuItems,
        totalCount: totalCount[0]?.count || 0,
      };
    }),

  getMenuItemInMenus: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.menuItemsToMenu.findMany({
        where: eq(menuItemsToMenu.menuItemId, input),
      });
    }),

  getMenuItemById: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.menuItems.findFirst({
        where: eq(menuItems.id, input),
      });
    }),

  getAllMenuItems: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.menuItems.findMany();
  }),
});
