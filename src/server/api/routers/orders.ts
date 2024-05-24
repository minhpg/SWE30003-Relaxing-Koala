import { menuSchema, updateMenuSchema } from "@/lib/schemas/menus";
import {
  createOrderSchema,
  orderSchema,
  updateOrderSchema,
} from "@/lib/schemas/orders";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  staffProcedure,
} from "@/server/api/trpc";
import {
  menuItemsToMenu,
  menuItemsToOrder,
  menus,
  orders,
  orderStatus,
} from "@/server/db/schema";
import { and, asc, count, desc, eq } from "drizzle-orm";
import { z } from "zod";

export const ordersRouter = createTRPCRouter({
  createOrder: protectedProcedure
    .input(createOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const newOrder = (
        await ctx.db
          .insert(orders)
          .values({
            tableNumber: input.tableNumber,
            notes: input.notes,
            createdBy: ctx.session.user.id,
          })
          .returning()
      )[0];
      if (!newOrder) throw new Error("Failed to create order");
      // group same order items first
      const groupedItems = input.items.reduce(
        (acc: Record<number, { id: number; quantity: number }>, item) => {
          if (acc[item.id]) {
            acc[item.id]!.quantity += item.quantity;
          } else {
            acc[item.id] = { id: item.id, quantity: item.quantity };
          }
          return acc;
        },
        {},
      );

      const itemsToInsert = Object.values(groupedItems);
      await ctx.db
        .insert(menuItemsToOrder)
        .values(
          itemsToInsert.map((item) => ({
            orderId: newOrder.id,
            menuItemId: item.id,
            quantity: item.quantity,
          })),
        )
        .execute();

      return newOrder;
    }),

  deleteOrderById: staffProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(menuItemsToOrder)
        .where(eq(menuItemsToOrder.orderId, input));
      return await ctx.db.delete(orders).where(eq(orders.id, input));
    }),

  updateOrderById: staffProcedure
    .input(updateOrderSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(menuItemsToOrder)
        .where(eq(menuItemsToOrder.orderId, input.id));
      const groupedItems = input.items.reduce(
        (acc: Record<number, { id: number; quantity: number }>, item) => {
          if (acc[item.id]) {
            acc[item.id]!.quantity += item.quantity;
          } else {
            acc[item.id] = { id: item.id, quantity: item.quantity };
          }
          return acc;
        },
        {},
      );
      const itemsToInsert = Object.values(groupedItems);
      await ctx.db
        .insert(menuItemsToOrder)
        .values(
          itemsToInsert.map((item) => ({
            orderId: input.id,
            menuItemId: item.id,
            quantity: item.quantity,
          })),
        )
        .execute();
      return (
        await ctx.db
          .update(orders)
          .set({
            tableNumber: input.tableNumber,
            notes: input.notes,
          })
          .where(eq(orders.id, input.id))
          .returning()
      )[0];
    }),

  getOrdersPaginated: publicProcedure
    .input(
      z.object({
        pageIndex: z.number().optional(),
        pageSize: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const filteredOrders = await ctx.db.query.orders.findMany({
        limit: input.pageSize,
        offset: (input.pageIndex || 0) * (input.pageSize || 0),
        orderBy: [desc(orders.createdAt), asc(orders.status)],
        with: {
          menuItemsToOrder: {
            with: {
              menuItem: true,
            },
          },
        },
      });

      const totalCount = await ctx.db.select({ count: count() }).from(orders);

      return {
        rows: filteredOrders,
        totalCount: totalCount[0]?.count || 0,
      };
    }),

  addMenuItemToOrder: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        menuItemId: z.number(),
        quantity: z.number().default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(menuItemsToOrder).values({
        orderId: input.orderId,
        menuItemId: input.menuItemId,
        quantity: input.quantity,
      });
    }),

  removeMenuItemFromOrder: staffProcedure
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

  setOrderStatus: staffProcedure
    .input(z.object({ id: z.number(), status: z.enum(orderStatus) }))
    .mutation(async ({ ctx, input }) => {
      return (
        await ctx.db
          .update(orders)
          .set({ status: input.status })
          .where(eq(orders.id, input.id))
          .returning()
      )[0];
    }),

  getOrderById: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.orders.findFirst({
        with: {
          menuItemsToOrder: {
            with: {
              menuItem: true,
            },
          },
        },
        where: eq(orders.id, input),
      });
    }),
});
