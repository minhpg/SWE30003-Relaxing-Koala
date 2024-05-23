"use client";

import { Separator } from "@/components/ui/separator";
import TablesTable from "./_components/TablesTable";
import NewTableDialog from "./_components/NewTableDialog";

export default function TablesPage() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tables</h2>
          <p className="text-muted-foreground">View all available tables.</p>
        </div>
        <div>
          <NewTableDialog />
        </div>
      </div>
      <Separator />
      <TablesTable />
    </>
  );
}
