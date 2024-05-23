"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NewReservationDialog from "./_components/NewReservationDialog";
import ReservationsTable from "./_components/ReservationsTable";

export default function ReservationPage() {
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
