import { createTRPCRouter, staffProcedure } from "@/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  getRevenueStats: staffProcedure.query(({ ctx }) => {
    return {
      revenue: 100,
      orders: 10,
    };
  }),
});
