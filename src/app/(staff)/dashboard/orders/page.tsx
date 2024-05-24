"use client";

import { Separator } from "@/components/ui/separator";
import NewOrderDialog from "./_components/NewOrderDialog";
import OrdersTable from "./_components/OrdersTable";

export default function MenuItemsPage() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">View all orders.</p>
        </div>
        <div>
          <NewOrderDialog />
        </div>
      </div>
      <Separator />
      <OrdersTable />
    </>
  );
}
