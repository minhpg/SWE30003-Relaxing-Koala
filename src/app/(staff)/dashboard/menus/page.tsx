"use client";

import { Separator } from "@/components/ui/separator";
import MenusTable from "./_components/MenusTable";
import NewMenuDialog from "./_components/NewMenuDialog";

export default function MenuItemsPage() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Menus</h2>
          <p className="text-muted-foreground">View all menus.</p>
        </div>
        <div>
          <NewMenuDialog />
        </div>
      </div>
      <Separator />
      <MenusTable />
    </>
  );
}
