"use client";

import { Separator } from "@/components/ui/separator";
import { UsersTable } from "./_components/UsersTable";

export default function ReservationsPage() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">View all users.</p>
        </div>
      </div>
      <Separator />
      <UsersTable />
    </>
  );
}
