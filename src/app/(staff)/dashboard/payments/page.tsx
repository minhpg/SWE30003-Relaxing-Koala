"use client";

import { Separator } from "@/components/ui/separator";
import PaymentsTable from "./_components/PaymentsTable";

export default function MenuItemsPage() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground">View all payments made.</p>
        </div>
      </div>
      <Separator />
      <PaymentsTable />
    </>
  );
}
