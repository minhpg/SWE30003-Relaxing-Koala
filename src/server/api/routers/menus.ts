import { menuSchema, updateMenuSchema } from "@/lib/schemas/menus";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  staffProcedure,
} from "@/server/api/trpc";
import { menuItemsToMenu, menus } from "@/server/db/schema";
import { and, count, desc, eq, like } from "drizzle-orm";
import { z } from "zod";

export const menusRouter = createTRPCRouter({
  createMenu: staffProcedure
    .input(menuSchema)
    .mutation(async ({ ctx, input }) => {
      return (
        await ctx.db
          .insert(menus)
          .values({
            ...input,
            createdBy: ctx.session.user.id,
          })
          .returning()
      )[0];
    }),

  deleteMenuById: staffProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(menus).where(eq(menus.id, input));
    }),

  updateMenuById: staffProcedure
    .input(updateMenuSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      return (
        await ctx.db
          .update(menus)
          .set({
            ...input,
          })
          .where(eq(menus.id, input.id))
          .returning()
      )[0];
    }),

  getMenusPaginated: publicProcedure
    .input(
      z.object({
        pageIndex: z.number().optional(),
        pageSize: z.number().optional(),
        nameFilter: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const filteredMenus = await ctx.db.query.menus.findMany({
        limit: input.pageSize,
        offset: (input.pageIndex || 0) * (input.pageSize || 0),
        orderBy: desc(menus.updatedAt),
        where: input.nameFilter
          ? like(menus.name, `%${input.nameFilter || ""}%`)
          : undefined,
      });

      const totalCount = await ctx.db
        .select({ count: count() })
        .from(menus)
        .where(
          input.nameFilter
            ? like(menus.name, `%${input.nameFilter || ""}%`)
            : undefined,
        );

      return {
        rows: filteredMenus,
        totalCount: totalCount[0]?.count || 0,
      };
    }),

  getAllMenus: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.menus.findMany({
      orderBy: desc(menus.updatedAt),
    });
  }),

  addMenuItemToMenu: staffProcedure
    .input(z.object({ menuId: z.number(), menuItemId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(menuItemsToMenu).values({
        menuId: input.menuId,
        menuItemId: input.menuItemId,
      });
    }),

  removeMenuItemFromMenu: staffProcedure
    .input(z.object({ menuId: z.number(), menuItemId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(menuItemsToMenu)
        .where(
          and(
            eq(menuItemsToMenu.menuId, input.menuId),
            eq(menuItemsToMenu.menuItemId, input.menuItemId),
          ),
        );
    }),

  getMenuById: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.menus.findFirst({
        where: eq(menus.id, input),
      });
    }),

  getLandingMenu: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.menus.findMany({
      with: {
        menuItemsToMenu: {
          with: {
            menuItem: true,
          },
        },
      },
      orderBy: desc(menus.recommended),
    });
  }),
});
