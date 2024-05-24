"use client";

import { Separator } from "@/components/ui/separator";
import MenuItemsTable from "./_components/MenuItemsTable";
import NewMenuItemDialog from "./_components/NewMenuItemDialog";

export default function MenuItemsPage() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Menu Items</h2>
          <p className="text-muted-foreground">View all menu items.</p>
        </div>
        <div>
          <NewMenuItemDialog />
        </div>
      </div>
      <Separator />
      <MenuItemsTable />
    </>
  );
}
