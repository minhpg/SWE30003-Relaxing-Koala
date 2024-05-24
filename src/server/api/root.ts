import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { dashboardRouter } from "./routers/dashboard";
import { feedbacksRouter } from "./routers/feedbacks";
import { menuItemsRouter } from "./routers/menuItems";
import { menusRouter } from "./routers/menus";
import { ordersRouter } from "./routers/orders";
import { paymentsRouter } from "./routers/payments";
import { reservationsRouter } from "./routers/reservations";
import { usersRouter } from "./routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  reservations: reservationsRouter,
  menus: menusRouter,
  menuItems: menuItemsRouter,
  orders: ordersRouter,
  payments: paymentsRouter,
  users: usersRouter,
  feedbacks: feedbacksRouter,
  dashboard: dashboardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
