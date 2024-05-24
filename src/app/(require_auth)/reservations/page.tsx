"use client";

import { Separator } from "@/components/ui/separator";
import NewReservationDialog from "./_components/NewReservationDialog";
import ReservationsTable from "./_components/ReservationsTable";

export default function ReservationsPage() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reservations</h2>
          <p className="text-muted-foreground">View all reservations.</p>
        </div>
        <div>
          <NewReservationDialog />
        </div>
      </div>
      <Separator />
      <ReservationsTable />
    </>
  );
}
